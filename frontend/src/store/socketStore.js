import { create } from 'zustand';

export const useSocketStore = create((set) => ({
  socket: null,
  connected: false,
  audioUnlocked: false,
  notifications: [],

  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ connected }),
  setAudioUnlocked: (audioUnlocked) => set({ audioUnlocked }),

  addNotification: (notification) =>
    set((s) => ({
      notifications: [{ ...notification, id: Date.now(), read: false }, ...s.notifications].slice(0, 50),
    })),

  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  clearNotifications: () => set({ notifications: [] }),

  unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
}));
