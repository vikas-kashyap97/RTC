// src/utils/audioEffects.ts
import * as Tone from 'tone';

export class AudioEffectProcessor {
  private pitchShift: Tone.PitchShift;
  private compressor: Tone.Compressor;
  private eq: Tone.EQ3;
  private limiter: Tone.Limiter;
  private initialized: boolean = false;

  constructor() {
    // Initialize audio nodes with improved settings
    this.pitchShift = new Tone.PitchShift({
      pitch: 0,
      windowSize: 0.1,
      delayTime: 0,
      feedback: 0
    });

    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 12,
      attack: 0.003,
      release: 0.25,
      knee: 30
    });

    this.eq = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 0,
      lowFrequency: 400,
      highFrequency: 2500
    });

    this.limiter = new Tone.Limiter(-1);
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

    // Create optimized audio chain
    source.chain(
      this.eq,
      this.pitchShift,
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

  async updateEffectSettings(settings: any) {
    try {
      this.pitchShift.pitch = settings.pitch;
      this.compressor.threshold = settings.gain;
      await this.eq.set(settings.eq || {});
    } catch (error) {
      console.error('Error updating effect settings:', error);
    }
  }

  cleanup() {
    try {
      this.pitchShift.dispose();
      this.compressor.dispose();
      this.eq.dispose();
      this.limiter.dispose();
      this.initialized = false;
    } catch (error) {
      console.error('Error cleaning up audio effects:', error);
    }
  }
}
