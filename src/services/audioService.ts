import * as Tone from 'tone';
import { AUDIO_CONFIG } from '../config/constants';
import type { VoiceEffect } from '../types/audio';

class AudioService {
  private initialized: boolean = false;
  private context: AudioContext | null = null;

  async initialize() {
    if (this.initialized) return;

    try {
      // Only initialize after user interaction
      await Tone.start();
      this.context = new AudioContext();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  async getUserMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      throw error;
    }
  }

  async processAudio(stream: MediaStream, effect: VoiceEffect) {
    if (!this.context) {
      throw new Error('Audio context not initialized');
    }

    const source = this.context.createMediaStreamSource(stream);
    const processor = this.context.createScriptProcessor(4096, 1, 1);
    
    // Simple audio processing
    processor.onaudioprocess = (e) => {
      const inputBuffer = e.inputBuffer;
      const outputBuffer = e.outputBuffer;
      
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        
        for (let i = 0; i < inputBuffer.length; i++) {
          // Apply basic effects based on the selected voice effect
          outputData[i] = this.applyEffect(inputData[i], effect);
        }
      }
    };

    source.connect(processor);
    processor.connect(this.context.destination);

    return stream;
  }

  private applyEffect(sample: number, effect: VoiceEffect): number {
    // Simple effect processing
    switch (effect) {
      case 'male':
        return sample * 0.8;
      case 'female':
        return sample * 1.2;
      case 'child':
        return sample * 1.5;
      case 'oldAge':
        return sample * 0.6;
      default:
        return sample;
    }
  }

  cleanup() {
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.initialized = false;
  }
}

export const audioService = new AudioService();