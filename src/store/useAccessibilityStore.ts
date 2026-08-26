import { create } from 'zustand';

export interface AccessibilityState {
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  enhancedFocus: boolean;
  announcement: string;
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleEnhancedFocus: () => void;
  announce: (msg: string) => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  textSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  enhancedFocus: true,
  announcement: '',
  setTextSize: (size) => set({ textSize: size }),
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  toggleEnhancedFocus: () => set((state) => ({ enhancedFocus: !state.enhancedFocus })),
  announce: (msg) => set({ announcement: msg }),
}));
