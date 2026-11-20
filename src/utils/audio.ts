// Web Audio API synthesized interactive sound effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playPageFlipSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 0.16;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const env = Math.sin((i / bufferSize) * Math.PI);
    data[i] = (Math.random() * 2 - 1) * env * 0.22;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + duration);
  filter.Q.value = 1.4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

export function playTone(
  freq: number,
  duration = 0.25,
  type: OscillatorType = 'sine',
  enabled = true,
  volume = 0.15,
): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

export function playSparkleSound(enabled: boolean): void {
  if (!enabled) return;
  const notes = [587.33, 783.99, 987.77, 1174.66];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.22, 'triangle', enabled, 0.12), idx * 55);
  });
}

export function playSuccessFanfare(enabled: boolean): void {
  if (!enabled) return;
  const chord = [523.25, 659.25, 783.99, 1046.5];
  chord.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.45, 'triangle', enabled, 0.14), idx * 80);
  });
}

export function playMechanicalClick(enabled: boolean): void {
  if (!enabled) return;
  playTone(290, 0.07, 'square', enabled, 0.07);
  setTimeout(() => playTone(440, 0.09, 'triangle', enabled, 0.09), 35);
}

export function playErrorSound(enabled: boolean): void {
  if (!enabled) return;
  playTone(210, 0.16, 'sawtooth', enabled, 0.07);
  setTimeout(() => playTone(165, 0.22, 'sawtooth', enabled, 0.06), 110);
}

export function playRocketLaunchSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const duration = 1.6;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    const env = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / 0.8);
    data[i] = (Math.random() * 2 - 1) * env * 0.4;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(140, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 1.2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.32, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();

  playSuccessFanfare(enabled);
}
