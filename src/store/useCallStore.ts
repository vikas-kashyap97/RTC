import { create } from 'zustand';
import type { CallState } from '../types/audio';

interface CallStore extends CallState {
  setIsInCall: (isInCall: boolean) => void;
  setRemotePeerId: (remotePeerId: string | null) => void;
  setIsSpeakerOn: (isSpeakerOn: boolean) => void;
  setAudioQuality: (quality: CallState['audioQuality']) => void;
}

export const useCallStore = create<CallStore>((set) => ({
  isInCall: false,
  remotePeerId: null,
  isSpeakerOn: true,
  audioQuality: 'high',
  setIsInCall: (isInCall) => set({ isInCall }),
  setRemotePeerId: (remotePeerId) => set({ remotePeerId }),
  setIsSpeakerOn: (isSpeakerOn) => set({ isSpeakerOn }),
  setAudioQuality: (audioQuality) => set({ audioQuality }),
}));