import { create } from 'zustand';
import { Product, SortOption, FilterState } from '../types';

interface AppState {
  currentPage: number;
  selectedCategory: string;
  sortBy: SortOption;
  searchQuery: string;
  selectedProduct: Product | null;
  isModalOpen: boolean;
  setCurrentPage: (page: number) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: SortOption) => void;
  setSearchQuery: (query: string) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 1,
  selectedCategory: 'all',
  sortBy: 'title-asc',
  searchQuery: '',
  selectedProduct: null,
  isModalOpen: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  openProductModal: (product) => set({ selectedProduct: product, isModalOpen: true }),
  closeProductModal: () => set({ selectedProduct: null, isModalOpen: false }),
  resetFilters: () => set({ 
    selectedCategory: 'all', 
    sortBy: 'title-asc', 
    searchQuery: '', 
    currentPage: 1 
  }),
}));