import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let audioContext = null;

// Must be called on a user gesture to unlock browser audio autoplay policy
export const unlockAudio = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    // Play a silent buffer — satisfies the user-gesture requirement
    const buf = audioContext.createBuffer(1, 1, 22050);
    const src = audioContext.createBufferSource();
    src.buffer = buf;
    src.connect(audioContext.destination);
    src.start(0);
    useSocketStore.getState().setAudioUnlocked(true);
  } catch (_) {
    // AudioContext unavailable — mark unlocked anyway so UI clears
    useSocketStore.getState().setAudioUnlocked(true);
  }
};

export const initSocket = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return null;

  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    useSocketStore.getState().setConnected(true);
    useSocketStore.getState().setSocket(socket);
    console.log('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', () => {
    useSocketStore.getState().setConnected(false);
    console.log('[Socket] Disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  // Announcement events
  socket.on('announcement:play', (data) => {
    useSocketStore.getState().addNotification({
      type: 'announcement',
      title: 'Bell Triggered',
      message: data.title || data.text?.substring(0, 60),
      data,
    });
    // Play audio in browser
    playAnnouncement(data);
  });

  socket.on('emergency:broadcast', (data) => {
    useSocketStore.getState().addNotification({
      type: 'emergency',
      title: '🚨 Emergency Alert',
      message: data.text?.substring(0, 80),
      data,
    });
    toast.error(`🚨 EMERGENCY: ${data.emergencyType?.replace(/_/g, ' ')}`, { duration: 10000 });
    playAnnouncement({ ...data, repeatCount: 3 });
  });

  socket.on('device:online', (data) => {
    useSocketStore.getState().addNotification({
      type: 'device',
      title: 'Device Online',
      message: `Device ${data.deviceId} is now online`,
      data,
    });
  });

  socket.on('device:offline', (data) => {
    useSocketStore.getState().addNotification({
      type: 'warning',
      title: 'Device Offline',
      message: `Device ${data.deviceId} went offline`,
      data,
    });
  });

  return socket;
};

const speakText = (text, volume, repeatCount) => {
  if (!window.speechSynthesis) return;
  let count = 0;
  const speak = () => {
    if (count >= repeatCount) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.volume = Math.min(Math.max(volume, 0), 1);
    utter.rate = 0.9;
    // onend fires once playback finishes — increment ONCE here, not outside
    utter.onend = () => {
      count++;
      if (count < repeatCount) speak();
    };
    window.speechSynthesis.speak(utter);
  };
  speak();
};

const playAnnouncement = (data) => {
  const { audioUrl, text, repeatCount = 1, volume = 1.0 } = data;

  if (audioUrl) {
    let played = 0;
    const playNext = () => {
      const audio = new Audio(audioUrl);
      audio.volume = Math.min(Math.max(volume, 0), 1);
      audio.onended = () => {
        played++;
        if (played < repeatCount) playNext();
      };
      audio.play().catch((err) => {
        console.warn('[Audio] Play blocked:', err.message);
        // Fallback to speech synthesis if audio is blocked
        if (text) speakText(text, volume, repeatCount);
      });
    };
    playNext();
  } else if (text) {
    speakText(text, volume, repeatCount);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    useSocketStore.getState().setConnected(false);
    useSocketStore.getState().setSocket(null);
  }
};

export const getSocket = () => socket;
