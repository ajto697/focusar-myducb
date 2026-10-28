/**
 * AutoMascot Video Factory - Mascot Movement & Animated Video Engine
 * Features:
 * - 100% Brand New AI Story Images Preloader
 * - Animated Mascot Body Bouncing & Head Tilting
 * - Talking Mouth Opening/Closing Synced Speech
 * - Pulsing Soundwave Rings & Energy Sparkles
 * - Dynamic Parallax Handheld Camera Float
 */

// Scene Payload using 100% BRAND NEW AI GENERATED IMAGES
const scenes = [
  {
    id: 1,
    image: 'scene_new_1.png',
    startTime: 0,
    endTime: 5,
    speaker: 'Bóng (Mascot Bi)',
    avatar: 'mascot_bi.png',
    pitch: 1.3,
    title: 'Scene 1: Cái rổ phơi đồ?',
    text: 'Bi Bót ơi! Nhìn cái rổ cao tít kia kìa! Sao hồi xưa người ta lại nghĩ ra việc treo rổ lên cao như thế nhỉ?',
    motion: 'zoom-in',
    sfx: 'whistle'
  },
  {
    id: 2,
    image: 'scene_new_2.png',
    startTime: 5,
    endTime: 11,
    speaker: 'Bi Bót (Glasses Boy)',
    avatar: 'mascot_bot.png',
    pitch: 0.95,
    title: 'Scene 2: Mùa đông lạnh giá 1891',
    text: 'Năm 1891, bên Mỹ vào mùa đông lạnh cóng! Cả phòng tập YMCA bị nhốt trong nhà, học sinh chán quá đánh nhau suốt ngày!',
    motion: 'zoom-out',
    sfx: 'wind'
  },
  {
    id: 3,
    image: 'scene_new_3.png',
    startTime: 11,
    endTime: 17,
    speaker: 'Bi Bót (Glasses Boy)',
    avatar: 'mascot_bot.png',
    pitch: 1.0,
    title: 'Scene 3: Hạn chót 14 ngày',
    text: 'Thế là thầy Naismith được giao nhiệm vụ 14 ngày phải sáng chế môn thể thao mới trong nhà, không là bị đuổi việc!',
    motion: 'pan-left',
    sfx: 'ding'
  },
  {
    id: 4,
    image: 'scene_new_4.png',
    startTime: 17,
    endTime: 23,
    speaker: 'Bi Bót (Glasses Boy)',
    avatar: 'mascot_bot.png',
    pitch: 1.0,
    title: 'Scene 4: Rổ đựng đào nguyên đáy',
    text: 'Thầy nhờ bác bảo vệ tìm 2 cái thùng gỗ. Bác ấy mang về 2 cái rổ đựng đào còn nguyên đáy!',
    motion: 'zoom-in',
    sfx: 'thud'
  },
  {
    id: 5,
    image: 'scene_new_5.png',
    startTime: 23,
    endTime: 30,
    speaker: 'Bi Bót (Glasses Boy)',
    avatar: 'mascot_bot.png',
    pitch: 1.0,
    title: 'Scene 5: Dựng thang trèo lấy bóng',
    text: 'Mỗi lần ném trúng, quả bóng mắc kẹt trong rổ! Phải dựng cái thang gỗ trèo lên móc bóng ra mới chơi tiếp được!',
    motion: 'pan-up',
    sfx: 'bounce'
  },
  {
    id: 6,
    image: 'scene_new_6.png',
    startTime: 30,
    endTime: 36,
    speaker: 'Bi & Bi Bót',
    avatar: 'poster.png',
    pitch: 1.1,
    title: 'Scene 6: Cuộc cách mạng bóng rổ!',
    text: 'Về sau người ta đục thủng đáy rổ để bóng rơi tự do, tạo nên môn bóng rổ hiện đại bùng nổ toàn cầu!',
    motion: 'hero-zoom',
    sfx: 'bell'
  }
];

// App State
let currentSceneIndex = 0;
let currentTime = 0;
let isPlaying = false;
let playbackSpeed = 1.0;
let isMuted = false;
let totalDuration = 36;
let isRecording = false;
let mediaRecorder = null;
let recordedChunks = [];
let animFrameId = null;
let lastTimestamp = 0;

// Loaded Images Cache
const loadedImages = {};

// Web Audio Context
let audioCtx = null;
let bgmGainNode = null;
let sfxGainNode = null;
let destAudioNode = null;

// Speech Synthesis
const synth = window.speechSynthesis;
let voices = [];
let selectedVoice = null;

// DOM Elements
const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnRestart = document.getElementById('btnRestart');
const btnMuteAudio = document.getElementById('btnMuteAudio');
const btnExportVideo = document.getElementById('btnExportVideo');
const btnFullscreen = document.getElementById('btnFullscreen');
const seekBar = document.getElementById('seekBar');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const speedSelect = document.getElementById('speedSelect');
const timelineStrip = document.getElementById('timelineStrip');
const scriptList = document.getElementById('scriptList');

const btnToggleBatchPanel = document.getElementById('btnToggleBatchPanel');
const batchDashboardPanel = document.getElementById('batchDashboardPanel');
const btnAddScriptToQueue = document.getElementById('btnAddScriptToQueue');
const newTopicTitle = document.getElementById('newTopicTitle');
const newTopicScriptText = document.getElementById('newTopicScriptText');
const queueListContainer = document.getElementById('queueListContainer');
const recIndicator = document.getElementById('recIndicator');

const voiceSelect = document.getElementById('voiceSelect');
const pitchSlider = document.getElementById('pitchSlider');

let activeStoriesBatch = [];

// Image Cache Helper
function getImage(src) {
  if (!src) return null;
  if (loadedImages[src]) return loadedImages[src];

  const img = new Image();
  img.src = src;
  img.onload = () => { loadedImages[src] = img; };
  loadedImages[src] = img;
  return img;
}

function preloadAllImages(sceneArray, callback) {
  const sources = new Set();
  sceneArray.forEach(s => {
    if (s.image) sources.add(s.image);
    if (s.avatar) sources.add(s.avatar);
  });
  sources.add('scene_new_1.png');
  sources.add('scene_new_2.png');
  sources.add('scene_new_3.png');
  sources.add('scene_new_4.png');
  sources.add('scene_new_5.png');
  sources.add('scene_new_6.png');
  sources.add('mascot_bi.png');
  sources.add('mascot_bot.png');
  sources.add('poster.png');

  let loaded = 0;
  const total = sources.size;

  sources.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedImages[src] = img;
      loaded++;
      if (loaded >= total && callback) callback();
    };
    img.onerror = () => {
      loaded++;
      if (loaded >= total && callback) callback();
    };
  });
}

// Audio Engine Setup
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    bgmGainNode = audioCtx.createGain();
    sfxGainNode = audioCtx.createGain();
    destAudioNode = audioCtx.createMediaStreamDestination();

    bgmGainNode.gain.value = 0.25;
    sfxGainNode.gain.value = 0.5;

    bgmGainNode.connect(audioCtx.destination);
    sfxGainNode.connect(audioCtx.destination);
    bgmGainNode.connect(destAudioNode);
    sfxGainNode.connect(destAudioNode);

    startBgmSynthesizer('springfield');
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

let bgmInterval = null;
function startBgmSynthesizer(preset) {
  if (bgmInterval) clearInterval(bgmInterval);
  if (!audioCtx) return;

  const notes = {
    springfield: [261.63, 329.63, 392.00, 440.00],
    blizzard: [196.00, 220.00, 261.63, 293.66],
    court: [130.81, 164.81, 196.00, 261.63],
    cartoon: [329.63, 392.00, 523.25, 659.25]
  }[preset] || [261.63, 329.63, 392.00];

  let step = 0;
  bgmInterval = setInterval(() => {
    if (!isPlaying || isMuted) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = preset === 'cartoon' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(bgmGainNode);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
      step++;
    } catch(e) {}
  }, 900);
}

function playSoundFx(type) {
  if (!audioCtx || isMuted) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    if (type === 'whistle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2500, now);
      osc.frequency.exponentialRampToValueAtTime(3000, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    } else if (type === 'ding') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    } else if (type === 'bounce') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    } else if (type === 'bell') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(sfxGainNode);
    osc.start();
    osc.stop(now + 0.5);
  } catch(e) {}
}

// Speech Synthesis
function populateVoices() {
  voices = synth ? synth.getVoices() : [];
  voiceSelect.innerHTML = '';
  
  let viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
  voices.forEach(v => {
    const option = document.createElement('option');
    option.value = v.name;
    option.textContent = `${v.name} (${v.lang})`;
    if (viVoice && v.name === viVoice.name) {
      option.selected = true;
      selectedVoice = v;
    }
    voiceSelect.appendChild(option);
  });

  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices[0];
  }
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speakDialogue(scene) {
  if (isMuted || !synth) return;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(scene.text);
  utterance.rate = playbackSpeed;
  utterance.pitch = (parseFloat(pitchSlider.value) || 1.1) * (scene.pitch || 1.0);
  if (selectedVoice) utterance.voice = selectedVoice;

  synth.speak(utterance);
}

// Text Wrap Helper
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
}

// CANVAS RENDER ENGINE WITH ANIMATED MASCOT MOVEMENTS (CỬ ĐỘNG MASCOT 60FPS)
function renderFrame(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  if (isPlaying) {
    currentTime += deltaTime * playbackSpeed;
    if (currentTime >= totalDuration) {
      currentTime = totalDuration;
      pauseVideo();
    }
  }

  let sceneIndex = scenes.findIndex(s => currentTime >= s.startTime && currentTime < s.endTime);
  if (sceneIndex === -1) sceneIndex = scenes.length - 1;

  if (sceneIndex !== currentSceneIndex) {
    currentSceneIndex = sceneIndex;
    if (isPlaying) {
      speakDialogue(scenes[currentSceneIndex]);
      playSoundFx(scenes[currentSceneIndex].sfx);
    }
  }

  const scene = scenes[currentSceneIndex] || scenes[0];

  // 1. CLEAR & BACKGROUND
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bgGrad.addColorStop(0, '#0B0F19');
  bgGrad.addColorStop(1, '#1A2332');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. STORYBOARD IMAGE WITH KEN BURNS & PARALLAX FLOAT
  const img = getImage(scene.image);
  if (img && (img.complete || img.naturalWidth > 0)) {
    const sceneProgress = Math.max(0, Math.min(1, (currentTime - scene.startTime) / ((scene.endTime - scene.startTime) || 4)));
    let scale = 1.0;
    let offsetX = Math.sin(timestamp / 1500) * 8;
    let offsetY = Math.cos(timestamp / 1200) * 5;

    if (scene.motion === 'zoom-in') {
      scale = 1.0 + sceneProgress * 0.12;
    } else if (scene.motion === 'zoom-out') {
      scale = 1.12 - sceneProgress * 0.12;
    } else if (scene.motion === 'pan-left') {
      scale = 1.08;
      offsetX += -sceneProgress * 40;
    } else if (scene.motion === 'pan-right') {
      scale = 1.08;
      offsetX += sceneProgress * 40;
    } else if (scene.motion === 'pan-up') {
      scale = 1.08;
      offsetY += -sceneProgress * 30;
    } else if (scene.motion === 'hero-zoom') {
      scale = 1.0 + Math.sin(sceneProgress * Math.PI) * 0.15;
    }

    const drawW = canvas.width * scale;
    const drawH = canvas.height * scale;
    const posX = (canvas.width - drawW) / 2 + offsetX;
    const posY = (canvas.height - drawH) / 2 + offsetY;

    ctx.drawImage(img, posX, posY, drawW, drawH);
  }

  // 3. CINEMA VIGNETTE
  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.7
  );
  grad.addColorStop(0, 'rgba(0,0,0,0.05)');
  grad.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 4. TOP SCENE HUD BAR
  ctx.fillStyle = 'rgba(9, 12, 21, 0.88)';
  ctx.beginPath();
  ctx.roundRect(20, 20, 520, 48, 24);
  ctx.fill();
  ctx.strokeStyle = '#00F2FE';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#00F2FE';
  ctx.beginPath();
  ctx.arc(42, 44, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(scene.title, 60, 50);

  // 5. ANIMATED MASCOT CHARACTER SPRITE MOVEMENTS (CỬ ĐỘNG MASCOT 60FPS)
  const isBiBot = scene.speaker.includes('Bi Bót');
  const avatarSrc = scene.avatar || (isBiBot ? 'mascot_bot.png' : 'mascot_bi.png');
  const avatarImg = getImage(avatarSrc);

  // Mascot Bouncing & Tilting Physics
  const mascotBobY = isPlaying ? Math.sin(timestamp / 180) * 8 : Math.sin(timestamp / 400) * 3;
  const mascotTilt = isPlaying ? Math.sin(timestamp / 220) * 0.08 : 0;

  const avatarX = 60;
  const avatarY = canvas.height - 180 + mascotBobY;
  const avatarSize = 120;
  const centerX = avatarX + avatarSize / 2;
  const centerY = avatarY + avatarSize / 2;

  // Soundwave Pulsing Rings around Mascot Badge when Speaking
  if (isPlaying) {
    for (let r = 1; r <= 2; r++) {
      const ringRadius = (avatarSize / 2) + ((timestamp * 0.15 + r * 35) % 45);
      const ringAlpha = 1 - (ringRadius - avatarSize / 2) / 45;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isBiBot ? `rgba(0, 242, 254, ${ringAlpha * 0.7})` : `rgba(255, 107, 0, ${ringAlpha * 0.7})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  // Draw Mascot Badge Frame with Rotation & Scale
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(mascotTilt);

  // Avatar Border Circle
  ctx.beginPath();
  ctx.arc(0, 0, avatarSize / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = isBiBot ? '#00F2FE' : '#FF6B00';
  ctx.fill();

  // Avatar Image Clip
  ctx.beginPath();
  ctx.arc(0, 0, avatarSize / 2, 0, Math.PI * 2);
  ctx.clip();
  if (avatarImg && (avatarImg.complete || avatarImg.naturalWidth > 0)) {
    ctx.drawImage(avatarImg, -avatarSize / 2, -avatarSize / 2, avatarSize, avatarSize);
  }

  // ANIMATED TALKING MOUTH & BLINKING EYES OVERLAY (CỬ ĐỘNG HÁ MIỆNG & CHỚP MẮT)
  if (isPlaying) {
    const mouthOpen = Math.abs(Math.sin(timestamp / 100)) * 12 + 4;
    // Animated Mouth Oval
    ctx.beginPath();
    ctx.ellipse(0, 18, 12, mouthOpen / 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#900000';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner Tongue
    ctx.beginPath();
    ctx.arc(0, 18 + mouthOpen / 4, 6, 0, Math.PI);
    ctx.fillStyle = '#FF5577';
    ctx.fill();
  }

  ctx.restore();

  // 6. ANIMATED COMIC SPEECH BUBBLE WITH BOUNCE & SPARKLES
  const bubbleX = 210;
  const bubbleY = canvas.height - 195;
  const bubbleW = canvas.width - 240;
  const bubbleH = 155;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.shadowColor = isBiBot ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 107, 0, 0.4)';
  ctx.shadowBlur = 20;

  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 22);
  ctx.fill();

  // Pointer Tail
  ctx.beginPath();
  ctx.moveTo(bubbleX, bubbleY + 60);
  ctx.lineTo(bubbleX - 22, bubbleY + 75 + mascotBobY * 0.5);
  ctx.lineTo(bubbleX, bubbleY + 90);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.fill();

  // Speaker Name Tag
  ctx.fillStyle = isBiBot ? '#0077CC' : '#E65100';
  ctx.font = 'bold 23px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(scene.speaker.toUpperCase(), bubbleX + 25, bubbleY + 40);

  // Subtitle / Dialogue Text
  ctx.fillStyle = '#111111';
  ctx.font = 'bold 24px sans-serif';
  wrapText(ctx, scene.text, bubbleX + 25, bubbleY + 78, bubbleW - 50, 34);

  // Action Sparkles / Energy Particles when Speaking
  if (isPlaying) {
    for (let p = 0; p < 4; p++) {
      const sparkX = bubbleX + bubbleW - 30 - p * 25 + Math.sin(timestamp / 200 + p) * 10;
      const sparkY = bubbleY + 30 + Math.cos(timestamp / 200 + p) * 8;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 4 + p, 0, Math.PI * 2);
      ctx.fillStyle = p % 2 === 0 ? '#FFD200' : '#00F2FE';
      ctx.fill();
    }
  }

  ctx.restore();

  // Update UI Seekbar & Time
  seekBar.value = currentTime;
  currentTimeDisplay.textContent = formatTime(currentTime);

  animFrameId = requestAnimationFrame(renderFrame);
}

// Video Controls
function playVideo() {
  initAudio();
  isPlaying = true;
  btnPlayPause.textContent = '⏸ Pause Video';
  btnPlayPause.classList.add('btn-primary');
  speakDialogue(scenes[currentSceneIndex]);
}

function pauseVideo() {
  isPlaying = false;
  btnPlayPause.textContent = '▶ Play Video';
  if (synth) synth.cancel();
}

function togglePlayPause() {
  if (isPlaying) {
    pauseVideo();
  } else {
    playVideo();
  }
}

function restartVideo() {
  currentTime = 0;
  currentSceneIndex = 0;
  seekBar.value = 0;
  if (isPlaying) speakDialogue(scenes[0]);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Build Timeline Strip
function buildTimelineUI() {
  timelineStrip.innerHTML = '';
  scenes.forEach((scene, index) => {
    const div = document.createElement('div');
    div.className = `thumb-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `
      <img src="${scene.image}" alt="Frame ${scene.id}">
      <span class="thumb-num">#${scene.id}</span>
    `;
    div.onclick = () => {
      currentTime = scene.startTime;
      currentSceneIndex = index;
      if (isPlaying) speakDialogue(scene);
    };
    timelineStrip.appendChild(div);
  });
}

// Build Script List
function buildScriptUI() {
  scriptList.innerHTML = '';
  scenes.forEach((scene, index) => {
    const div = document.createElement('div');
    div.className = `script-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `
      <span class="speaker">${scene.speaker}:</span>
      <span>"${scene.text}"</span>
    `;
    div.onclick = () => {
      currentTime = scene.startTime;
      currentSceneIndex = index;
      if (isPlaying) speakDialogue(scene);
    };
    scriptList.appendChild(div);
  });
}

// Export Video via MediaRecorder
function exportVideo() {
  initAudio();
  if (isRecording) return;

  isRecording = true;
  if (recIndicator) recIndicator.classList.add('active');
  btnExportVideo.textContent = '⏺ Recording Video...';
  btnExportVideo.disabled = true;

  const canvasStream = canvas.captureStream(60);
  let combinedStream = canvasStream;

  if (destAudioNode && destAudioNode.stream.getAudioTracks().length > 0) {
    const audioTrack = destAudioNode.stream.getAudioTracks()[0];
    combinedStream = new MediaStream([...canvasStream.getVideoTracks(), audioTrack]);
  }

  recordedChunks = [];
  try {
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
  } catch (e) {
    mediaRecorder = new MediaRecorder(combinedStream);
  }

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    isRecording = false;
    if (recIndicator) recIndicator.classList.remove('active');
    btnExportVideo.textContent = '🎬 Export Active Video (.webm)';
    btnExportVideo.disabled = false;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mascot_Animated_Basketball_Story_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  restartVideo();
  playVideo();
  mediaRecorder.start();

  const checkEnd = setInterval(() => {
    if (currentTime >= totalDuration || !isPlaying) {
      clearInterval(checkEnd);
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        pauseVideo();
      }
    }
  }, 500);
}

// Queue UI Management
function renderQueueListUI() {
  if (!queueListContainer) return;
  if (activeStoriesBatch.length === 0) {
    queueListContainer.innerHTML = '<div style="color:#9CA3AF; padding:0.5rem;">Hàng chờ trống. Hãy thêm câu chuyện mới!</div>';
    return;
  }

  queueListContainer.innerHTML = activeStoriesBatch.map((s, idx) => `
    <div style="padding: 0.4rem; background: ${idx === 0 ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.05)'}; border-left: 3px solid ${idx === 0 ? '#00F2FE' : '#6B7280'}; margin-bottom: 0.4rem; border-radius: 4px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong>${s.title}</strong><br>
        <small style="color: ${idx === 0 ? '#10B981' : '#9CA3AF'};">${idx === 0 ? '● Active Ready' : '⏳ Pending'}</small>
      </div>
      <button class="btn" style="padding:0.2rem 0.5rem; font-size:0.75rem;" onclick="loadStoryFromQueue(${idx})">▶ Load</button>
    </div>
  `).join('');
}

window.loadStoryFromQueue = function(idx) {
  if (activeStoriesBatch[idx]) {
    const story = activeStoriesBatch[idx];
    scenes.length = 0;
    let accTime = 0;
    story.scenes.forEach(s => {
      s.startTime = accTime;
      s.endTime = accTime + (s.duration || 4);
      accTime = s.endTime;
      scenes.push(s);
    });
    totalDuration = accTime;
    seekBar.max = totalDuration;
    totalTimeDisplay.textContent = formatTime(totalDuration);

    preloadAllImages(scenes, () => {
      buildTimelineUI();
      buildScriptUI();
      restartVideo();
    });
  }
};

function fetchSampleStories() {
  fetch('sample_stories.json')
    .then(r => r.json())
    .then(data => {
      activeStoriesBatch = data;
      renderQueueListUI();
      if (data.length > 0) {
        window.loadStoryFromQueue(0);
      }
    })
    .catch(e => console.log('Loaded default single story payload'));
}

// Dashboard Events
if (btnToggleBatchPanel && batchDashboardPanel) {
  btnToggleBatchPanel.addEventListener('click', () => {
    const isHidden = batchDashboardPanel.style.display === 'none';
    batchDashboardPanel.style.display = isHidden ? 'block' : 'none';
  });
}

if (btnAddScriptToQueue) {
  btnAddScriptToQueue.addEventListener('click', () => {
    const title = newTopicTitle.value.trim() || 'Untitled Story';
    const text = newTopicScriptText.value.trim();

    if (!text) {
      alert('Vui lòng nhập văn bản kể chuyện!');
      return;
    }

    const newStory = {
      id: `custom_${Date.now()}`,
      title: title,
      bgm: 'court',
      outputFileName: `${title.replace(/\s+/g, '_')}.webm`,
      scenes: [
        {
          id: 1,
          image: 'scene_new_1.png',
          duration: 6,
          speaker: 'Bóng (Mascot Bi)',
          avatar: 'mascot_bi.png',
          text: text,
          motion: 'zoom-in',
          sfx: 'whistle'
        },
        {
          id: 2,
          image: 'scene_new_6.png',
          duration: 5,
          speaker: 'Bi & Bi Bót',
          avatar: 'poster.png',
          text: 'Cảm ơn các bạn đã theo dõi câu chuyện bóng rổ tuyệt vời này!',
          motion: 'hero-zoom',
          sfx: 'bell'
        }
      ]
    };

    activeStoriesBatch.push(newStory);
    renderQueueListUI();

    newTopicTitle.value = '';
    newTopicScriptText.value = '';
    alert(`✅ Đã thêm câu chuyện "${title}" vào hàng chờ auto render!`);
  });
}

// Event Listeners
btnPlayPause.addEventListener('click', togglePlayPause);
btnRestart.addEventListener('click', restartVideo);
btnMuteAudio.addEventListener('click', () => {
  isMuted = !isMuted;
  btnMuteAudio.textContent = isMuted ? '🔇 Audio OFF' : '🔊 Audio ON';
  if (isMuted && synth) synth.cancel();
});
seekBar.addEventListener('input', (e) => {
  currentTime = parseFloat(e.target.value);
});
speedSelect.addEventListener('change', (e) => {
  playbackSpeed = parseFloat(e.target.value);
});
btnExportVideo.addEventListener('click', exportVideo);
btnFullscreen.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
voiceSelect.addEventListener('change', (e) => {
  selectedVoice = voices.find(v => v.name === e.target.value);
});

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const preset = btn.dataset.preset;
    startBgmSynthesizer(preset);
  });
});

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  preloadAllImages(scenes, () => {
    buildTimelineUI();
    buildScriptUI();
    populateVoices();
    fetchSampleStories();
    animFrameId = requestAnimationFrame(renderFrame);
  });
});
