import React from 'react';
import type { VoiceEffect } from '../types/audio';
import { Mic, User, UserRound, Baby, UserCog } from 'lucide-react';
import { clsx } from 'clsx';

interface EffectSelectorProps {
  currentEffect: VoiceEffect;
  onEffectChange: (effect: VoiceEffect) => void;
}

const effects: { type: VoiceEffect; label: string; icon: React.ReactNode }[] = [
  { type: 'normal', label: 'Normal', icon: <Mic size={20} /> },
  { type: 'male', label: 'Male', icon: <User size={20} /> },
  { type: 'female', label: 'Female', icon: <UserRound size={20} /> },
  { type: 'child', label: 'Child', icon: <Baby size={20} /> },
  { type: 'oldAge', label: 'Old Age', icon: <UserCog size={20} /> },
];

export function EffectSelector({ currentEffect, onEffectChange }: EffectSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {effects.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onEffectChange(type)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            currentEffect === type
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
