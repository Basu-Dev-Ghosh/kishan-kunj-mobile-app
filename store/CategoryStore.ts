import {create} from 'zustand';
interface CategoryState {
  category: Category | null;
  setCategory(category: Category): void;
}
export const useCategory = create<CategoryState>((set, get) => ({
  category: null,
  setCategory: (category: Category) => set({category}),
}));
