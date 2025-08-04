
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CityState {
  selectedCity: string | null;
  setSelectedCity: (city: string) => void;
  clearSelectedCity: () => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: null,
      setSelectedCity: (city) => set({ selectedCity: city }),
      clearSelectedCity: () => set({ selectedCity: null }),
    }),
    {
      name: 'city-storage',
    }
  )
);
