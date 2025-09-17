import { Product, SortOption } from '../types';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

export const filterProducts = (products: Product[], searchQuery: string): Product[] => {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase();
  return products.filter(product => {
    const title = String((product as any)?.title ?? '').toLowerCase();
    const description = String((product as any)?.description ?? '').toLowerCase();
    const brand = String((product as any)?.brand ?? '').toLowerCase();
    const category = String((product as any)?.category ?? '').toLowerCase();
    return (
      title.includes(query) ||
      description.includes(query) ||
      brand.includes(query) ||
      category.includes(query)
    );
  });
};