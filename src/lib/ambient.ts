/**
 * Optional atmospheric sound, synthesised with Web Audio (no audio file to download).
 * It only starts after an explicit click on the sound toggle.
 */

type Ambient = { ctx: AudioContext; master: GainNode; nodes: AudioScheduledSourceNode[] };

let current: Ambient | null = null;

function brownNoise(ctx: AudioContext): AudioBufferSourceNode {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

export function startAmbient(): boolean {
  if (current) return true;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Low, slightly detuned drone.
  const nodes: AudioScheduledSourceNode[] = [];
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.22;
  droneGain.connect(master);
  for (const [freq, detune] of [
    [55, 0],
    [82.41, 4],
    [110, -6],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = detune;
    osc.connect(droneGain);
    nodes.push(osc);
  }

  // Wind-like air, filtered and slowly breathing.
  const noise = brownNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const air = ctx.createGain();
  air.gain.value = 0.35;
  noise.connect(filter).connect(air).connect(master);
  nodes.push(noise);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.15;
  lfo.connect(lfoDepth).connect(air.gain);
  nodes.push(lfo);

  nodes.forEach((n) => n.start());
  master.gain.setTargetAtTime(0.09, ctx.currentTime, 1.2);
  current = { ctx, master, nodes };
  return true;
}

export function stopAmbient(): void {
  if (!current) return;
  const { ctx, master, nodes } = current;
  current = null;
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  window.setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    void ctx.close();
  }, 1600);
}
