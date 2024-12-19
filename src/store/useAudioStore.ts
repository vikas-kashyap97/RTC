import { create } from 'zustand';
import type { VoiceEffect } from '../types/audio';

interface AudioStore {
  currentEffect: VoiceEffect;
  localStream: MediaStream | null;
  processedStream: MediaStream | null;
  setCurrentEffect: (effect: VoiceEffect) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setProcessedStream: (stream: MediaStream | null) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentEffect: 'normal',
  localStream: null,
  processedStream: null,
  setCurrentEffect: (currentEffect) => set({ currentEffect }),
  setLocalStream: (localStream) => set({ localStream }),
  setProcessedStream: (processedStream) => set({ processedStream }),
}));