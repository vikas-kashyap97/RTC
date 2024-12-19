import type { VoiceEffect } from '../types/audio';

interface RTCConfig {
  iceServers: RTCIceServer[];
}

const rtcConfig: RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ]
};

export const createPeerConnection = () => {
  const pc = new RTCPeerConnection(rtcConfig);
  
  // Enable echo cancellation and noise suppression
  const audioConstraints = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  };

  return { pc, audioConstraints };
};