// src/services/audioService.ts
import * as Tone from 'tone';
import { AUDIO_CONFIG, VOICE_EFFECTS } from '../config/constants';
import type { VoiceEffect } from '../types/audio';
import { AudioEffectProcessor } from '../utils/audioEffects';

class AudioService {
  private initialized: boolean = false;
  private context: AudioContext | null = null;
  private effectProcessor: AudioEffectProcessor | null = null;
  private currentStream: MediaStream | null = null;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Web Audio API context with proper sample rate
      this.context = new AudioContext({
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
        latencyHint: 'interactive'
      });
      
      // Initialize Tone.js
      await Tone.start();
      Tone.setContext(this.context);
      
      // Initialize effect processor
      this.effectProcessor = new AudioEffectProcessor();
      await this.effectProcessor.initializeAudioContext();
      
      this.initialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  async getUserMedia() {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: AUDIO_CONFIG.CHANNELS,
          sampleRate: { ideal: AUDIO_CONFIG.SAMPLE_RATE }
        } 
      });

      this.currentStream = stream;
      console.log('Audio input stream acquired successfully');
      return stream;
    } catch (error) {
      console.error('Failed to get user media:', error);
      throw error;
    }
  }

  async processAudio(stream: MediaStream, effect: VoiceEffect): Promise<MediaStream> {
    if (!this.context || !this.effectProcessor) {
      throw new Error('Audio context or effect processor not initialized');
    }

    try {
      // Create a new audio worklet for processing
      const workletStream = await this.createAudioWorklet(stream);
      
      // Process the stream through the effect processor
      const processedStream = await this.effectProcessor.setupAudioChain(workletStream);
      
      // Apply voice effect settings
      await this.applyVoiceEffect(effect);

      console.log(`Audio processing completed with effect: ${effect}`);
      return processedStream;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  private async createAudioWorklet(stream: MediaStream): Promise<MediaStream> {
    if (!this.context) throw new Error('Audio context not initialized');

    try {
      // Create media stream source
      const source = this.context.createMediaStreamSource(stream);
      
      // Create media stream destination
      const destination = this.context.createMediaStreamDestination();

      // Create audio worklet for processing
      await this.context.audioWorklet.addModule('src/worklets/audioProcessor.js');
      const workletNode = new AudioWorkletNode(this.context, 'audio-processor', {
        processorOptions: {
          bufferSize: AUDIO_CONFIG.BUFFER_SIZE,
          numberOfChannels: AUDIO_CONFIG.CHANNELS
        }
      });

      // Connect nodes
      source.connect(workletNode);
      workletNode.connect(destination);

      return destination.stream;
    } catch (error) {
      console.error('Error creating audio worklet:', error);
      throw error;
    }
  }

  private async applyVoiceEffect(effect: VoiceEffect) {
    if (!this.effectProcessor) return;

    const effectSettings = VOICE_EFFECTS[effect.toUpperCase()] || VOICE_EFFECTS.NORMAL;
    await this.effectProcessor.updateEffectSettings(effectSettings);
  }

  cleanup() {
    try {
      // Stop all tracks in the current stream
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => track.stop());
        this.currentStream = null;
      }

      // Close audio context
      if (this.context) {
        this.context.close();
        this.context = null;
      }

      // Reset effect processor
      if (this.effectProcessor) {
        this.effectProcessor.cleanup();
        this.effectProcessor = null;
      }

      this.initialized = false;
      console.log('Audio system cleaned up successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

export const audioService = new AudioService();
