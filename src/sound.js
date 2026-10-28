// src/sound.js — Procedural Web Audio Sound Engine
// Synthesizes distinct, studio-grade tactile UI & scrollytelling sounds:
// 1. Page/Stage Transition Whoosh (filtered pink/air noise sweep + sub-harmonic body)
// 2. Milestone Switch (mechanical detent click + progressive pitched harmonic marimba chime)
// 3. Speech Bubble Pop (organic pitch-envelope lip pop)
// 4. UI Click / Tap (crisp glass/woodblock micro-tap)
// 5. Modal Open / Close (warm ascending/descending chord shimmer)
// 6. Mascot 360° Trick (spring spin whistle + celebration arpeggio)
// 7. Success / Copy Confirmation (bright double-bell ding)
// 8. Hover Tick (ultra-subtle high-tech micro-tick)

let audioCtx = null;
let soundEnabled = true;
let noiseBuffer = null;
let lastWhooshTime = 0;
let lastHoverTime = 0;

function getAudioContext() {
  if (!soundEnabled) return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

// Pre-generate a smooth pink-ish noise buffer for realistic air whooshes & mechanical clicks
function getNoiseBuffer(ctx) {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
    return noiseBuffer;
  }
  const duration = 1.0;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  // Paul Kellet's pink noise filter approximation for warm, non-harsh air texture
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
    b6 = white * 0.115926;
  }

  noiseBuffer = buffer;
  return noiseBuffer;
}

// Unlock AudioContext on first user gesture so scroll whooshes work immediately
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
    } catch (e) {}
  };

  ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'wheel', 'click'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  return soundEnabled;
}

/**
 * 1. PAGE / STAGE TRANSITION WHOOSH
 * Silky air whoosh + low-end motion body when scrolling between portfolio sections.
 * @param {'down'|'up'} direction - Scroll direction
 * @param {boolean} isCrossScreen - Whether the character is also sprinting across the screen
 */
export function playStageWhoosh(direction = 'down', isCrossScreen = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const nowMs = performance.now();
  if (nowMs - lastWhooshTime < 140) return; // Prevent overlapping whooshes during rapid scroll
  lastWhooshTime = nowMs;

  try {
    const now = ctx.currentTime;
    const duration = isCrossScreen ? 0.42 : 0.32;

    // Layer A: Filtered Pink Noise Air Sweep
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = getNoiseBuffer(ctx);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.Q.setValueAtTime(isCrossScreen ? 1.8 : 2.2, now);

    const startFreq = direction === 'down' ? 190 : 280;
    const peakFreq = isCrossScreen ? 920 : 680;
    const endFreq = direction === 'down' ? 240 : 160;

    bandpass.frequency.setValueAtTime(startFreq, now);
    bandpass.frequency.exponentialRampToValueAtTime(peakFreq, now + duration * 0.42);
    bandpass.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    const noiseGain = ctx.createGain();
    const peakGain = isCrossScreen ? 0.24 : 0.17;
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(peakGain, now + duration * 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSrc.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSrc.start(now);
    noiseSrc.stop(now + duration + 0.02);

    // Layer B: Soft Aero Sub-Sine Body (gives weight & direction to the whoosh)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';

    const subStart = direction === 'down' ? 135 : 95;
    const subPeak = direction === 'down' ? 210 : 175;
    const subEnd = direction === 'down' ? 85 : 125;

    subOsc.frequency.setValueAtTime(subStart, now);
    subOsc.frequency.exponentialRampToValueAtTime(subPeak, now + duration * 0.38);
    subOsc.frequency.exponentialRampToValueAtTime(subEnd, now + duration);

    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.linearRampToValueAtTime(0.055, now + duration * 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + duration + 0.02);
  } catch (e) {}
}

/**
 * 2. MILESTONE SWITCH SOUND
 * Tactile mechanical station detent + progressive pitched harmonic chime (Note 01 -> 04).
 * @param {number} milestoneIdx - 0 to 3
 */
export function playMilestoneSound(milestoneIdx = 0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Progressive pentatonic scale across the 4 milestones: C5, D5, E5, G5
    const baseFreqs = [523.25, 587.33, 659.25, 783.99];
    const idx = Math.max(0, Math.min(baseFreqs.length - 1, milestoneIdx));
    const rootFreq = baseFreqs[idx];

    // Part A: Crisp Mechanical Detent Click (station lock-in)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1200, now);
    clickOsc.frequency.exponentialRampToValueAtTime(180, now + 0.028);
    clickGain.gain.setValueAtTime(0.09, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

    // Part B: Warm Marimba / Bell Fundamental Tone
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(rootFreq, now + 0.015);
    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.linearRampToValueAtTime(0.085, now + 0.022);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    bellOsc.connect(bellGain);
    bellGain.connect(ctx.destination);
    bellOsc.start(now + 0.015);
    bellOsc.stop(now + 0.35);

    // Part C: Perfect Fifth Harmonic Shimmer (1.5x frequency)
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();
    harmOsc.type = 'sine';
    harmOsc.frequency.setValueAtTime(rootFreq * 1.5, now + 0.045);
    harmGain.gain.setValueAtTime(0.0001, now + 0.045);
    harmGain.gain.linearRampToValueAtTime(0.045, now + 0.055);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    harmOsc.connect(harmGain);
    harmGain.connect(ctx.destination);
    harmOsc.start(now + 0.045);
    harmOsc.stop(now + 0.4);
  } catch (e) {}
}

/**
 * 3. SPEECH BUBBLE POP
 * Soft organic pop when the character's speech bubble appears after walking across the stage.
 */
export function playBubblePop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(310, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.065);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}

/**
 * 4. UI CLICK / INTERACTIVE TAP
 * Crisp, snappy tactile micro-tap for buttons, social cards, skill pills, and filter tabs.
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.042);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

/**
 * 5. MODAL / DOSSIER OPEN & CLOSE
 * Distinct two-note ascending/descending glassy chord for opening/closing modals.
 */
export function playModalOpenSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [440.0, 554.37, 659.25]; // A4 major triad shimmer
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const start = now + i * 0.04;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.055, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.34);
    });
  } catch (e) {}
}

export function playModalCloseSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.11);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {}
}

/**
 * 6. 360° MASCOT BACKFLIP TRICK & CONFETTI SOUND
 * Playful kinetic spin whistle + bright celebration arpeggio.
 */
export function playTrickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Spin upward whistle
    const spinOsc = ctx.createOscillator();
    const spinGain = ctx.createGain();
    spinOsc.type = 'sine';
    spinOsc.frequency.setValueAtTime(280, now);
    spinOsc.frequency.exponentialRampToValueAtTime(980, now + 0.18);
    spinGain.gain.setValueAtTime(0.06, now);
    spinGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    spinOsc.connect(spinGain);
    spinGain.connect(ctx.destination);
    spinOsc.start(now);
    spinOsc.stop(now + 0.2);

    // Bright confetti chord arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const start = now + 0.12 + idx * 0.045;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.055, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.28);
    });
  } catch (e) {}
}

/**
 * 7. SUCCESS / COPY CONFIRMATION CHIME
 * Crisp two-note confirmation ding (used for clipboard copy & enabling sound).
 */
export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // D5 -> A5 Swiss chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.075, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.07);
    gain2.gain.setValueAtTime(0.065, now + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.44);
  } catch (e) {}
}

/**
 * 8. SUBTLE HOVER MICRO-TICK
 * Soft, low-volume mechanical tick when hovering interactive cards or controls.
 */
export function playHoverTick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const nowMs = performance.now();
  if (nowMs - lastHoverTime < 65) return;
  lastHoverTime = nowMs;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.012);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.016);
  } catch (e) {}
}

// Keep legacy alias mapped to success chime for backward compatibility
export const playSwissChime = playSuccessSound;

if (typeof window !== 'undefined') {
  window.playStageWhoosh = playStageWhoosh;
  window.playMilestoneSound = playMilestoneSound;
  window.playBubblePop = playBubblePop;
  window.playClickSound = playClickSound;
  window.playModalOpenSound = playModalOpenSound;
  window.playModalCloseSound = playModalCloseSound;
  window.playTrickSound = playTrickSound;
  window.playSuccessSound = playSuccessSound;
  window.playHoverTick = playHoverTick;
  window.playSwissChime = playSuccessSound;
}

