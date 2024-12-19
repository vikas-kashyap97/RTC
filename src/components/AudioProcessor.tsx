import React, { useEffect, useRef } from 'react';
import { AudioEffectProcessor } from '../utils/audioEffects';
import { useAudioStore } from '../store/useAudioStore';
import type { AudioProcessorProps } from '../types/audio';

export function AudioProcessor({ stream, effect, onProcessedStream }: AudioProcessorProps) {
  const processorRef = useRef<AudioEffectProcessor | null>(null);

  useEffect(() => {
    if (!stream) return;

    const setupAudioProcessing = async () => {
      if (!processorRef.current) {
        processorRef.current = new AudioEffectProcessor();
      }

      const processedStream = await processorRef.current.setupAudioChain(stream);
      onProcessedStream(processedStream);
    };

    setupAudioProcessing();

    return () => {
      if (processorRef.current) {
        processorRef.current.dispose();
        processorRef.current = null;
      }
    };
  }, [stream]);

  useEffect(() => {
    if (processorRef.current) {
      processorRef.current.applyEffect(effect);
    }
  }, [effect]);

  return null;
}