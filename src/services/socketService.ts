import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../config/constants';
import type { User } from '../types/audio';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(API_CONFIG.SOCKET_URL, {
      reconnectionAttempts: API_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: API_CONFIG.RECONNECTION_DELAY,
      reconnectionDelayMax: API_CONFIG.RECONNECTION_DELAY_MAX,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.setupDefaultListeners();
  }

  private setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  registerUser(peerId: string, username: string) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, attempting to connect...');
      this.connect();
    }
    this.socket?.emit('user:register', { peerId, username });
  }

  onUsersUpdate(callback: (users: User[]) => void) {
    this.socket?.on('users:update', callback);
  }

  onIncomingCall(callback: (data: { from: string }) => void) {
    this.socket?.on('call:incoming', callback);
  }

  sendCallRequest(to: string, from: string) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, attempting to connect...');
      this.connect();
    }
    this.socket?.emit('call:request', { to, from });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();