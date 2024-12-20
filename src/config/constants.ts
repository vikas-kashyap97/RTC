// API endpoints and configuration
export const API_CONFIG = {
  SOCKET_URL: import.meta.env.PROD 
    ? 'https://rtc-l2n1.onrender.com/'
    : 'http://localhost:3000',
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
};

// Audio processing configuration
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  BUFFER_SIZE: 4096,
  CHANNELS: 1,
};

// Voice effect parameters
export const VOICE_EFFECTS = {
  NORMAL: { pitch: 1.0, gain: 1.0 },
  MALE: { pitch: 0.8, gain: 1.2 },
  FEMALE: { pitch: 1.2, gain: 1.0 },
  CHILD: { pitch: 1.5, gain: 0.9 },
  OLD_AGE: { pitch: 0.7, gain: 1.1 }
};