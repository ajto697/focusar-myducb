/* -------------------------------------------------------------
 * PIXELOPOLIS - CHIPTUNE WEB AUDIO SYNTHESIZER
 * Procedural 8-bit sound effects & relaxing ambient background music
 * ------------------------------------------------------------- */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.musicPlaying = false;
    this.musicTimer = null;
    this.rainGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.enabled = true;
    console.log("🔊 Audio Engine Initialized");
    this.startMusic();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.musicPlaying) {
      this.stopMusic();
    } else if (this.enabled && !this.musicPlaying) {
      this.startMusic();
    }
    return this.enabled;
  }

  // Play a simple square wave tone
  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // --- SOUND EFFECTS ---
  playBuildSound() {
    if (!this.enabled) return;
    this.playTone(440, 'square', 0.08, 0.08);
    setTimeout(() => this.playTone(554, 'square', 0.08, 0.08), 60);
    setTimeout(() => this.playTone(659, 'triangle', 0.12, 0.1), 120);
  }

  playDemolishSound() {
    if (!this.enabled || !this.ctx) return;
    // Crushing noise
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  playClick() {
    this.playTone(800, 'sine', 0.03, 0.04);
  }

  playMoneySound() {
    if (!this.enabled) return;
    this.playTone(659, 'triangle', 0.08, 0.08); // E5
    setTimeout(() => this.playTone(987, 'triangle', 0.15, 0.1), 80); // B5
  }

  playSirenSound() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // --- BACKGROUND MUSIC GENERATOR ---
  startMusic() {
    if (this.musicPlaying || !this.enabled) return;
    this.musicPlaying = true;

    // Pentatonic ambient scale (C4, D4, E4, G4, A4, C5, E5)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.musicPlaying || !this.enabled) return;

      // Pick next melody note
      const freq = scale[noteIdx % scale.length];
      this.playTone(freq, 'sine', 0.4, 0.03);

      // Random step forward or arpeggio pattern
      noteIdx += (Math.floor(Math.random() * 3) + 1);

      // Schedule next note with relaxing rhythm
      const interval = 400 + Math.random() * 400;
      this.musicTimer = setTimeout(playNextNote, interval);
    };

    playNextNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

const AUDIO = new AudioEngine();
