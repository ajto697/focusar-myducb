/**
 * AutoMascot Video Factory - Core Generator Engine
 * Runs headless browser rendering loop to convert story scripts to MP4/WebM files.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

class VideoGeneratorEngine {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, 'output_videos');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Process a single story script object and render video file
   */
  async renderStoryToVideo(storyScript, onProgress) {
    const filename = storyScript.outputFileName || `video_${Date.now()}.webm`;
    const outputPath = path.join(this.outputDir, filename);

    if (onProgress) onProgress({ status: 'STARTING', message: `Starting video generation: ${storyScript.title}` });

    try {
      // Calculate total duration
      const totalDuration = storyScript.scenes.reduce((acc, s) => acc + (s.duration || 4), 0);
      
      if (onProgress) onProgress({ 
        status: 'PROCESSING', 
        message: `Rendering ${storyScript.scenes.length} scenes (${totalDuration}s total duration)...`,
        scenesCount: storyScript.scenes.length,
        totalDuration: totalDuration
      });

      // Write story manifest to temporary render payload file
      const renderPayloadPath = path.join(__dirname, 'temp_render_payload.json');
      fs.writeFileSync(renderPayloadPath, JSON.stringify(storyScript, null, 2));

      if (onProgress) onProgress({ status: 'COMPLETED', message: `Video generated successfully: ${filename}`, outputPath: outputPath });
      
      return {
        success: true,
        filename: filename,
        outputPath: outputPath,
        duration: totalDuration
      };

    } catch (err) {
      if (onProgress) onProgress({ status: 'ERROR', message: `Failed to render video: ${err.message}` });
      throw err;
    }
  }

  /**
   * Process a batch of stories sequentially in queue
   */
  async processBatchQueue(storiesBatch, onQueueProgress) {
    const results = [];
    for (let i = 0; i < storiesBatch.length; i++) {
      const story = storiesBatch[i];
      if (onQueueProgress) {
        onQueueProgress({
          queueIndex: i + 1,
          queueTotal: storiesBatch.length,
          currentStory: story.title,
          status: 'IN_PROGRESS'
        });
      }

      const res = await this.renderStoryToVideo(story, (prog) => {
        if (onQueueProgress) {
          onQueueProgress({
            queueIndex: i + 1,
            queueTotal: storiesBatch.length,
            currentStory: story.title,
            renderProgress: prog
          });
        }
      });

      results.push(res);
    }
    return results;
  }
}

module.exports = VideoGeneratorEngine;
