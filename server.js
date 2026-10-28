/**
 * AutoMascot Video Factory - Backend REST API & Static Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const VideoGeneratorEngine = require('./generator_engine');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'output_videos');

const engine = new VideoGeneratorEngine({ outputDir: OUTPUT_DIR });

// In-Memory Queue State
let renderQueue = [];
let queueHistory = [];
let currentRendering = null;

// MIME Types Map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // REST API Endpoints
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ONLINE',
      activeQueueCount: renderQueue.length,
      currentRendering: currentRendering,
      completedCount: queueHistory.length
    }));
  }

  if (pathname === '/api/queue' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      queue: renderQueue,
      current: currentRendering,
      history: queueHistory
    }));
  }

  if (pathname === '/api/queue/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const task = {
          id: `task_${Date.now()}`,
          title: payload.title || 'Untitled Story',
          storyScript: payload,
          status: 'PENDING',
          addedAt: new Date().toISOString()
        };
        renderQueue.push(task);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, task: task, queueLength: renderQueue.length }));

        // Process queue in background
        processNextInQueue();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/output-videos' && req.method === 'GET') {
    try {
      const files = fs.readdirSync(OUTPUT_DIR).map(filename => {
        const filePath = path.join(OUTPUT_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          filename: filename,
          sizeBytes: stats.size,
          createdAt: stats.birthtime,
          url: `/output_videos/${filename}`
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ files: files }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Serve Static Files
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Server Error');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Process Queue Background Worker
async function processNextInQueue() {
  if (currentRendering || renderQueue.length === 0) return;

  const currentTask = renderQueue.shift();
  currentTask.status = 'RENDERING';
  currentRendering = currentTask;

  try {
    const res = await engine.renderStoryToVideo(currentTask.storyScript, (prog) => {
      currentTask.progress = prog;
    });
    currentTask.status = 'COMPLETED';
    currentTask.outputPath = res.outputPath;
    currentTask.filename = res.filename;
    queueHistory.unshift(currentTask);
  } catch (err) {
    currentTask.status = 'FAILED';
    currentTask.error = err.message;
    queueHistory.unshift(currentTask);
  } finally {
    currentRendering = null;
    processNextInQueue();
  }
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏀 AutoMascot Video Factory Server running at: http://localhost:${PORT}`);
  console.log(`📂 Output Video Library: ${OUTPUT_DIR}`);
  console.log(`=======================================================`);
});
