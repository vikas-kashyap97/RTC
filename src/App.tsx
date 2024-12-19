import React, { useEffect, useState, useCallback } from 'react';
import { Copy, Link } from 'lucide-react';
import { AudioProcessor } from './components/AudioProcessor';
import { CallControls } from './components/CallControls';
import { EffectSelector } from './components/EffectSelector';
import { UserList } from './components/UserList';
import { CallNotification } from './components/CallNotification';
import { useCallStore } from './store/useCallStore';
import { useAudioStore } from './store/useAudioStore';
import { usePeerConnection } from './hooks/usePeerConnection';
import { socketService } from './services/socketService';
import { audioService } from './services/audioService';
import type { VoiceEffect, User } from './types/audio';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [incomingCall, setIncomingCall] = useState<{ from: string } | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<VoiceEffect>('normal'); // Added state for current effect

  const { isInCall, isSpeakerOn, setIsSpeakerOn } = useCallStore();
  const { setLocalStream } = useAudioStore();
  const { peerId, initiateCall, endCall } = usePeerConnection();

  const initializeAudio = useCallback(async () => {
    if (audioInitialized) return;

    try {
      await audioService.initialize();
      const stream = await audioService.getUserMedia();
      setLocalStream(stream);
      setAudioInitialized(true);
    } catch (err) {
      console.error('Failed to initialize audio:', err);
    }
  }, [audioInitialized, setLocalStream]);

  useEffect(() => {
    socketService.connect();
    socketService.onUsersUpdate(setUsers);
    socketService.onIncomingCall(setIncomingCall);

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleCallToggle = async () => {
    if (!audioInitialized) {
      await initializeAudio();
    }

    if (isInCall) {
      endCall();
    } else {
      initiateCall();
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}?peer=${peerId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-800">Voice Changer</h1>

        {!audioInitialized && (
          <button
            onClick={initializeAudio}
            className="w-full py-3 px-4 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Click to Initialize Audio
          </button>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Your ID: {peerId}</span>
            <button
              onClick={copyPeerId}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Copy ID"
            >
              <Copy size={18} />
            </button>
          </div>

          <button
            onClick={copyShareLink}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
          >
            <Link size={18} />
            Copy share link
          </button>

          <UserList users={users} currentPeerId={peerId} />
          {/* Fixed EffectSelector props */}
          <EffectSelector
            currentEffect={currentEffect}
            onEffectChange={(effect) => setCurrentEffect(effect)}
          />

          <CallControls
            isInCall={isInCall}
            isSpeakerOn={isSpeakerOn}
            onToggleCall={handleCallToggle}
            onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
          />
        </div>

        <AudioProcessor />

        {incomingCall && (
          <CallNotification
            caller={incomingCall.from}
            onAccept={async () => {
              if (!audioInitialized) {
                await initializeAudio();
              }
              initiateCall();
              setIncomingCall(null);
            }}
            onReject={() => setIncomingCall(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
