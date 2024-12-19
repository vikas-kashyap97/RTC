import { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';
import { useCallStore } from '../store/useCallStore';
import { useAudioStore } from '../store/useAudioStore';
import { socketService } from '../services/socketService';

export function usePeerConnection() {
  const { processedStream } = useAudioStore();
  const { isInCall, remotePeerId, setIsInCall } = useCallStore();
  
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [connection, setConnection] = useState<Peer.MediaConnection | null>(null);

  useEffect(() => {
    const initPeer = async () => {
      const newPeer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });
      
      newPeer.on('open', (id) => {
        setPeerId(id);
        socketService.registerUser(id, `User-${id.slice(0, 4)}`);
      });

      newPeer.on('call', handleIncomingCall);
      setPeer(newPeer);
    };

    initPeer();
    return () => peer?.destroy();
  }, []);

  const handleIncomingCall = useCallback((call: Peer.MediaConnection) => {
    if (processedStream) {
      call.answer(processedStream);
      setConnection(call);
      setIsInCall(true);
      
      call.on('stream', (remoteStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play().catch(console.error);
      });
    }
  }, [processedStream, setIsInCall]);

  const initiateCall = useCallback(() => {
    if (!peer || !processedStream || !remotePeerId) return;

    const call = peer.call(remotePeerId, processedStream);
    setConnection(call);
    setIsInCall(true);

    call.on('stream', (remoteStream) => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(console.error);
    });

    socketService.sendCallRequest(remotePeerId, peerId);
  }, [peer, processedStream, remotePeerId, peerId]);

  const endCall = useCallback(() => {
    if (connection) {
      connection.close();
      setConnection(null);
      setIsInCall(false);
    }
  }, [connection]);

  return {
    peerId,
    initiateCall,
    endCall
  };
}