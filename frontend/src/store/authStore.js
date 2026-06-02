import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      updateUser: (user) => set((s) => ({ user: { ...s.user, ...user } })),

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      hasRole: (role) => {
        const { user } = get();
        const hierarchy = { SUPER_ADMIN: 3, SCHOOL_ADMIN: 2, STAFF: 1 };
        return (hierarchy[user?.role] || 0) >= (hierarchy[role] || 0);
      },
    }),
    {
      name: 'smartbell-auth',
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
