import { useEffect } from 'react';
import { useSocketStore } from '../store/socketStore';
import { initSocket } from '../services/socket';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const { socket, connected, notifications, addNotification, markAllRead, unreadCount } = useSocketStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      initSocket();
    }
  }, [isAuthenticated]);

  return { socket, connected, notifications, addNotification, markAllRead, unreadCount: unreadCount(useSocketStore.getState()) };
};
