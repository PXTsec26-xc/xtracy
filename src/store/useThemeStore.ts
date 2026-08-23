import { create } from 'zustand';
import { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  triggerQuickExit: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  setMode: (mode: ThemeMode) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light', 'emergency-theme');
      if (mode === 'dark') {
        root.classList.add('dark');
      } else if (mode === 'light') {
        root.classList.add('light');
      } else if (mode === 'emergency') {
        root.classList.add('emergency-theme');
      }
    }
    set({ mode });
  },
  triggerQuickExit: () => {
    if (typeof window !== 'undefined') {
      // Clear sensitive session storage if any
      sessionStorage.clear();
      // Redirect immediately to a neutral location
      window.location.replace('https://www.weather.com');
    }
  },
}));
