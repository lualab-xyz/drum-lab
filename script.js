const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function whiteNoise(duration = 0.3) {
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playKick() {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

function playSnare() {
  const now = audioCtx.currentTime;
  const noise = audioCtx.createBufferSource();
  noise.buffer = whiteNoise(0.2);
  const band = audioCtx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1800;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  noise.connect(band).connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.25);
}

function playHat() {
  const now = audioCtx.currentTime;
  const noise = audioCtx.createBufferSource();
  noise.buffer = whiteNoise(0.12);
  const hp = audioCtx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 8000;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  noise.connect(hp).connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.15);
}

function playTom(frequency) {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.9, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

function playClap() {
  const now = audioCtx.currentTime;
  const noise = audioCtx.createBufferSource();
  noise.buffer = whiteNoise(0.25);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  noise.connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.25);
}

function playShaker() {
  const now = audioCtx.currentTime;
  const noise = audioCtx.createBufferSource();
  noise.buffer = whiteNoise(0.3);
  const hp = audioCtx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 9000;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  noise.connect(hp).connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.35);
}

function playSnap() {
  const now = audioCtx.currentTime;
  const noise = audioCtx.createBufferSource();
  noise.buffer = whiteNoise(0.18);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  noise.connect(gain).connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.25);
}

function triggerPad(pad) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  pad.classList.add('playing');
  const drum = pad.dataset.drum;
  switch (drum) {
    case 'kick':
      playKick();
      break;
    case 'snare':
      playSnare();
      break;
    case 'hat':
      playHat();
      break;
    case 'tom':
      playTom(220);
      break;
    case 'floor':
      playTom(140);
      break;
    case 'clap':
      playClap();
      break;
    case 'shaker':
      playShaker();
      break;
    case 'snap':
      playSnap();
      break;
  }
  setTimeout(() => pad.classList.remove('playing'), 150);
}

document.querySelectorAll('.pad').forEach(pad => {
  pad.addEventListener('pointerdown', () => triggerPad(pad));
});

document.addEventListener('keydown', event => {
  const keyMap = {
    a: 'kick',
    s: 'snare',
    d: 'hat',
    f: 'tom',
    g: 'floor',
    h: 'clap',
    j: 'shaker',
    k: 'snap',
  };
  const padKey = keyMap[event.key.toLowerCase()];
  if (!padKey) return;
  const pad = document.querySelector(`.pad[data-drum="${padKey}"]`);
  if (pad) {
    event.preventDefault();
    triggerPad(pad);
  }
});
