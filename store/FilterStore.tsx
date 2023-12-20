import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterState {
  filter: {
    user: number | undefined;
    category: number | undefined;
    price: number | undefined;
  };
  setUserFilter(price: number | undefined): void;
  setCategoryFilter(price: number | undefined): void;
  setPriceFilter(price: number | undefined): void;
  resetFilter(): void;
}
export const useFilter = create(
  persist<FilterState>(
    (set, get) => ({
      filter: {
        user: 0,
        category: 0,
        price: 0,
      },
      setUserFilter: user => {
        set(state => ({
          filter: {
            ...state.filter,
            user,
          },
        }));
      },
      setCategoryFilter: category => {
        set(state => ({
          filter: {
            ...state.filter,
            category,
          },
        }));
      },
      setPriceFilter: price => {
        set(state => ({
          filter: {
            ...state.filter,
            price,
          },
        }));
      },
      resetFilter: () => {
        set(state => ({
          filter: {
            user: 0,
            category: 0,
            price: 0,
          },
        }));
      },
    }),
    {name: 'filter-storage', storage: createJSONStorage(() => AsyncStorage)},
  ),
);
