import { useCallback, useRef } from 'react';

function getCtx(ref: { current: AudioContext | null }): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ref.current) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ref.current = new Ctx();
  }
  return ref.current;
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playTear = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.36;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const envelope = Math.pow(1 - t, 1.25);
      const grit = Math.sin(2 * Math.PI * (120 + t * 180) * (i / sampleRate)) * 0.25;
      data[i] = ((Math.random() * 2 - 1) * 0.8 + grit) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(420, now);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(4200, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.42, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  }, []);

  const playDrumroll = useCallback(() => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const start = ctx.currentTime;

    for (let i = 0; i < 14; i++) {
      const t = start + i * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95 + i * 3.5, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.085);
    }

    const crashTime = start + 14 * 0.045 + 0.02;
    const crashDuration = 0.46;
    const sampleRate = ctx.sampleRate;
    const crashFrames = Math.floor(sampleRate * crashDuration);
    const crashBuffer = ctx.createBuffer(1, crashFrames, sampleRate);
    const crashData = crashBuffer.getChannelData(0);
    for (let i = 0; i < crashFrames; i++) {
      const t = i / crashFrames;
      crashData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.4);
    }
    const crashSource = ctx.createBufferSource();
    crashSource.buffer = crashBuffer;
    const crashFilter = ctx.createBiquadFilter();
    crashFilter.type = 'bandpass';
    crashFilter.frequency.setValueAtTime(1900, crashTime);
    const crashGain = ctx.createGain();
    crashGain.gain.setValueAtTime(0.0001, crashTime);
    crashGain.gain.exponentialRampToValueAtTime(0.34, crashTime + 0.02);
    crashGain.gain.exponentialRampToValueAtTime(0.0001, crashTime + crashDuration);

    crashSource.connect(crashFilter);
    crashFilter.connect(crashGain);
    crashGain.connect(ctx.destination);
    crashSource.start(crashTime);
    crashSource.stop(crashTime + crashDuration);
  }, []);

  return { playTear, playDrumroll };
}
