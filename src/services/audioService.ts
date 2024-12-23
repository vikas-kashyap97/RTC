// src/services/audioService.ts
import * as Tone from 'tone';
import { AUDIO_CONFIG } from '../config/constants';
import type { VoiceEffect } from '../types/audio';

class AudioService {
  private initialized: boolean = false;
  private context: AudioContext | null = null;
  private currentStream: MediaStream | null = null;
  private deviceId: string | null = null;

  // Add method to check available devices
  async checkAudioDevices(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      if (audioDevices.length === 0) {
        console.error('No audio input devices found');
        return false;
      }

      // Store the first available device ID
      this.deviceId = audioDevices[0].deviceId;
      console.log('Available audio devices:', audioDevices.length);
      return true;
    } catch (error) {
      console.error('Error checking audio devices:', error);
      return false;
    }
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Check for audio devices first
      const hasAudioDevices = await this.checkAudioDevices();
      if (!hasAudioDevices) {
        throw new Error('No audio input devices available');
      }

      // Initialize audio context
      this.context = new AudioContext({
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
        latencyHint: 'interactive'
      });

      // Initialize Tone.js
      await Tone.start();
      Tone.setContext(this.context);

      this.initialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw new Error(`Audio initialization failed: ${error.message}`);
    }
  }

  async getUserMedia() {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Check if we have permission to access the microphone
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permission.state === 'denied') {
        throw new Error('Microphone permission denied');
      }

      // Try to get the audio stream with specific constraints
      const constraints: MediaStreamConstraints = {
        audio: {
          deviceId: this.deviceId ? { exact: this.deviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: AUDIO_CONFIG.CHANNELS,
          sampleRate: { ideal: AUDIO_CONFIG.SAMPLE_RATE }
        }
      };

      // Attempt to get the stream with specific constraints
      try {
        this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        // If failed with specific constraints, try with basic audio constraints
        console.warn('Failed to get stream with specific constraints, trying basic audio');
        this.currentStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
      }

      if (!this.currentStream) {
        throw new Error('Failed to get audio stream');
      }

      // Verify that we actually got audio tracks
      const audioTracks = this.currentStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio tracks found in the media stream');
      }

      console.log('Audio input stream acquired successfully');
      return this.currentStream;

    } catch (error) {
      console.error('Failed to get user media:', error);
      throw new Error(`Failed to access microphone: ${error.message}`);
    }
  }

  // Add method to handle device changes
  async handleDeviceChange() {
    try {
      await this.checkAudioDevices();
      // If we have an active stream, restart it with the new device
      if (this.currentStream) {
        this.cleanup();
        await this.getUserMedia();
      }
    } catch (error) {
      console.error('Error handling device change:', error);
    }
  }

  // Rest of the AudioService implementation...

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

      this.initialized = false;
      this.deviceId = null;
      console.log('Audio system cleaned up successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Add device change listener
navigator.mediaDevices.addEventListener('devicechange', async () => {
  await audioService.handleDeviceChange();
});

export const audioService = new AudioService();
