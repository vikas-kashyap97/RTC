import React from 'react';
import { Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';

interface CallControlsProps {
  isInCall: boolean;
  isSpeakerOn: boolean;
  onToggleCall: () => void;
  onToggleSpeaker: () => void;
}

export function CallControls({
  isInCall,
  isSpeakerOn,
  onToggleCall,
  onToggleSpeaker,
}: CallControlsProps) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onToggleCall}
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isInCall
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        } text-white transition-colors`}
      >
        {isInCall ? (
          <>
            <PhoneOff size={20} /> End Call
          </>
        ) : (
          <>
            <Phone size={20} /> Start Call
          </>
        )}
      </button>
      <button
        onClick={onToggleSpeaker}
        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isSpeakerOn ? 'bg-blue-500' : 'bg-gray-500'
        } text-white transition-colors hover:opacity-90`}
      >
        {isSpeakerOn ? (
          <>
            <Volume2 size={20} /> Speaker On
          </>
        ) : (
          <>
            <VolumeX size={20} /> Speaker Off
          </>
        )}
      </button>
    </div>
  );
}