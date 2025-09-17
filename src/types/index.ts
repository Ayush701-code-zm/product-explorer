export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'rating-desc';

export interface FilterState {
  category: string;
  sortBy: SortOption;
  searchQuery: string;
}