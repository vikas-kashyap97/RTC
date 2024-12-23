// src/services/audioService.ts
import * as Tone from 'tone';
import { AUDIO_CONFIG } from '../config/constants';
import type { VoiceEffect } from '../types/audio';

class AudioService {
  private initialized: boolean = false;
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize audio context
      this.context = new AudioContext({
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE || 44100,
        latencyHint: 'interactive'
      });

      // Get user media with optimal constraints
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 2,
          sampleRate: AUDIO_CONFIG.SAMPLE_RATE || 44100,
          latency: 0
        }
      });

      // Add audio tracks to peer connection
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => {
          if (this.peerConnection) {
            this.peerConnection.addTrack(track, this.stream!);
          }
        });
      }

      this.initialized = true;
      console.log('Audio system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  setupPeerConnection(configuration: RTCConfiguration) {
    try {
      this.peerConnection = new RTCPeerConnection(configuration);
      
      // Add existing audio tracks if stream exists
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => {
          this.peerConnection?.addTrack(track, this.stream!);
        });
      }

      // Handle incoming tracks
      this.peerConnection.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        // Play remote audio
        const remoteStream = new MediaStream([event.track]);
        const audioElement = new Audio();
        audioElement.srcObject = remoteStream;
        audioElement.play().catch(console.error);
      };

      // Log connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
      };

      // Log ICE connection state changes
      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', this.peerConnection?.iceConnectionState);
      };

      return this.peerConnection;
    } catch (error) {
      console.error('Error setting up peer connection:', error);
      throw error;
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      throw error;
    }
  }

  // Add method to check audio levels
  startAudioLevelMonitoring() {
    if (!this.context || !this.stream) return;

    const audioContext = this.context;
    const source = audioContext.createMediaStreamSource(this.stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    source.connect(analyser);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      console.log('Audio input level:', average);
      requestAnimationFrame(checkLevel);
    };

    checkLevel();
  }

  cleanup() {
    // Stop all tracks
    this.stream?.getAudioTracks().forEach(track => {
      track.stop();
    });

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Close audio context
    if (this.context) {
      this.context.close();
      this.context = null;
    }

    this.stream = null;
    this.initialized = false;
  }
}

export const audioService = new AudioService();
