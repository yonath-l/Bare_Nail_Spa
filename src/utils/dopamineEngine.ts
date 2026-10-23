/**
 * Sensory Dopamine Engine
 * Zero-dependency Web Audio API sound synthesizer, haptic engine, and particle burst
 */

// Web Audio API Context singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 1. Warm low-end wax-seal thud + shimmering crystal chime
 */
export function playStampImpactSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Thud oscillator (wax seal / heavy metal stamp)
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();

  thudOsc.type = 'triangle';
  thudOsc.frequency.setValueAtTime(140, now);
  thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.18);

  thudGain.gain.setValueAtTime(0.45, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);

  thudOsc.start(now);
  thudOsc.stop(now + 0.22);

  // Shimmering crystal chime resonance (luxury harmonics)
  const frequencies = [1320, 1760, 2640];
  frequencies.forEach((freq, index) => {
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(freq, now + 0.04);

    const initialGain = 0.08 / (index + 1);
    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.linearRampToValueAtTime(initialGain, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    chimeOsc.start(now + 0.04);
    chimeOsc.stop(now + 0.85);
  });
}

/**
 * 2. Uplifting luxury major-7th chord arpeggio for Visit 5 & Visit 10 rewards
 */
export function playMilestoneFanfare(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C-Major 7th / Champagne harmonics: C5, E5, G5, B5, C6, G6
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1567.98];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.9);
  });
}

/**
 * 3. Tactile Haptics Engine (calls navigator.vibrate safely)
 */
export function triggerHapticFeedback(type: 'stamp' | 'milestone' | 'tap' = 'stamp'): void {
  if (typeof window === 'undefined' || !('navigator' in window)) return;
  if (!('vibrate' in navigator)) return;

  try {
    if (type === 'stamp') {
      navigator.vibrate([70, 40, 150]);
    } else if (type === 'milestone') {
      navigator.vibrate([100, 50, 100, 50, 300]);
    } else {
      navigator.vibrate(35);
    }
  } catch {
    // Gracefully ignore vibration errors on restrictive devices
  }
}
