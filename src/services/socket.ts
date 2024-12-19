import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/constants';

export const socket = io(API_CONFIG.SOCKET_URL, {
  reconnectionDelay: API_CONFIG.RECONNECTION_DELAY,
  reconnectionDelayMax: API_CONFIG.RECONNECTION_DELAY_MAX,
  reconnectionAttempts: API_CONFIG.RECONNECTION_ATTEMPTS,
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});