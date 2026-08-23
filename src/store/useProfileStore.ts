import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSafetyProfile } from '@/types';

interface ProfileState {
  profile: UserSafetyProfile;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  updateProfile: (updated: Partial<UserSafetyProfile>) => void;
  toggleItem: (category: keyof Omit<UserSafetyProfile, 'userRole' | 'isConfigured' | 'updatedAt'>, item: string) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserSafetyProfile = {
  operatingSystems: ['Android', 'Windows'],
  devices: ['Smartphone', 'Laptop'],
  browsers: ['Chrome'],
  emailProviders: ['Gmail'],
  socialMedia: ['Instagram', 'WhatsApp'],
  onlineServices: ['Google Workspace'],
  userRole: 'Everyday User',
  isConfigured: true,
  updatedAt: new Date().toISOString(),
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      isModalOpen: false,
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      updateProfile: (updated) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updated,
            isConfigured: true,
            updatedAt: new Date().toISOString(),
          },
        })),
      toggleItem: (category, item) =>
        set((state) => {
          const currentList = state.profile[category] as string[];
          const exists = currentList.includes(item);
          const newList = exists
            ? currentList.filter((i) => i !== item)
            : [...currentList, item];
          return {
            profile: {
              ...state.profile,
              [category]: newList,
              isConfigured: true,
              updatedAt: new Date().toISOString(),
            },
          };
        }),
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: 'xtracy-user-profile-v1',
    }
  )
);
