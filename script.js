const drumSounds = {
  kick: 60,
  snare: 220,
  hat: 4000,
  tom: 200,
  floor: 120,
  clap: 250,
  shaker: 6000,
  snap: 1400,
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playDrum(frequency, type = 'sine') {
  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

function triggerPad(pad) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  pad.classList.add('playing');
  const drum = pad.dataset.drum;
  playDrum(drumSounds[drum], drum === 'hat' ? 'triangle' : 'square');
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
