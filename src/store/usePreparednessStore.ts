import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PreparednessCheckitem } from '@/types';
import { DEFAULT_PREPAREDNESS_ITEMS, calculatePreparednessScore } from '@/lib/preparednessCalculator';

interface PreparednessState {
  items: PreparednessCheckitem[];
  toggleItem: (id: string) => void;
  resetChecklist: () => void;
  getScoreData: () => ReturnType<typeof calculatePreparednessScore>;
}

export const usePreparednessStore = create<PreparednessState>()(
  persist(
    (set, get) => ({
      items: DEFAULT_PREPAREDNESS_ITEMS,
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        })),
      resetChecklist: () => set({ items: DEFAULT_PREPAREDNESS_ITEMS }),
      getScoreData: () => calculatePreparednessScore(get().items),
    }),
    {
      name: 'xtracy-preparedness-store-v1',
    }
  )
);
