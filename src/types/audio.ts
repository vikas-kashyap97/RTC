export type VoiceEffect = 'normal' | 'male' | 'female' | 'child' | 'oldAge' | 'robot';

export interface AudioProcessorProps {
  stream: MediaStream | null;
  effect: VoiceEffect;
  onProcessedStream: (stream: MediaStream) => void;
}

export interface User {
  peerId: string;
  username: string;
}

export interface CallState {
  isInCall: boolean;
  remotePeerId: string | null;
  isSpeakerOn: boolean;
  audioQuality: 'low' | 'medium' | 'high';
}

export interface AudioStats {
  bitrate: number;
  packetsLost: number;
  latency: number;
}