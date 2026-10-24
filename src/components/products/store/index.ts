import { create } from "zustand";
import type { ProductsFilters, SortType } from "../types";

type FiltersState = ProductsFilters & {
  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  setSort: (sort: SortType) => void;
  reset: () => void;
};

const initialFilters: ProductsFilters = {
  search: "",
  category: null,
  sort: "default",
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialFilters,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  reset: () => set(initialFilters),
}));
