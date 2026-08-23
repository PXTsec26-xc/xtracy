import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  userRole: 'Everyday User' | 'Student' | 'Professional' | 'Family' | 'High-Risk Profile';
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAuthModalOpen: boolean;

  openAuthModal: (returnUrl?: string) => void;
  closeAuthModal: () => void;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUserRole: (role: AuthUser['userRole']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      isAuthModalOpen: false,

      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),

      setSession: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isGuest: false,
          isAuthModalOpen: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: true,
        }),

      updateUserRole: (role) =>
        set((state) => ({
          user: state.user ? { ...state.user, userRole: role } : null,
        })),
    }),
    {
      name: 'xtracy-auth-store-v2b',
    }
  )
);
