import * as Tone from 'tone';
import type { VoiceEffect } from '../types/audio';

export class AudioEffectProcessor {
  private pitchShift: Tone.PitchShift;
  private reverb: Tone.Reverb;
  private tremolo: Tone.Tremolo;
  private compressor: Tone.Compressor;
  private noiseGate: Tone.Gate;
  private eq: Tone.EQ3;
  private limiter: Tone.Limiter;
  private initialized: boolean = false;

  constructor() {
    // Initialize audio nodes
    this.pitchShift = new Tone.PitchShift();
    this.reverb = new Tone.Reverb();
    this.tremolo = new Tone.Tremolo();
    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 12,
      attack: 0.003,
      release: 0.25
    });
    this.noiseGate = new Tone.Gate({
      threshold: -60,
      attack: 0.1,
      release: 0.1
    });
    this.eq = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: -3
    });
    this.limiter = new Tone.Limiter(-3);

    // Start tremolo
    this.tremolo.start();
  }

  async initializeAudioContext() {
    if (!this.initialized) {
      await Tone.start();
      this.initialized = true;
    }
  }

  async setupAudioChain(stream: MediaStream): Promise<MediaStream> {
    await this.initializeAudioContext();
    
    const source = new Tone.UserMedia();
    await source.open();

    // Connect the audio chain
    source.chain(
      this.noiseGate,
      this.eq,
      this.pitchShift,
      this.reverb,
      this.tremolo,
      this.compressor,
      this.limiter,
      Tone.Destination
    );

    // Create output stream
    const context = Tone.context;
    const destination = context.createMediaStreamDestination();
    this.limiter.connect(destination);

    return destination.stream;
  }

  // Rest of the class implementation remains the same
}