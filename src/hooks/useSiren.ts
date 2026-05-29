import { useRef, useCallback } from 'react';

export default function useSiren() {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const gain = ctx.createGain();
      gain.gain.value = 0.3;
      gain.connect(ctx.destination);
      gainRef.current = gain;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.connect(gain);
      oscRef.current = osc;

      // Two-tone siren: alternate between 800Hz and 1100Hz
      osc.frequency.value = 800;
      osc.start();

      let high = true;
      intervalRef.current = setInterval(() => {
        const freq = high ? 1100 : 800;
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + 0.08);
        high = !high;
      }, 400);
    } catch {
      // Audio not available — siren won't play but SOS still works
    }
  }, []);

  return { start, stop };
}
