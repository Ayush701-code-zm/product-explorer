import { useState, useEffect } from 'react';
import { Product, ProductsResponse, ApiError } from '../types';

const API_BASE = 'http://localhost:3001/api';

export const useProducts = (limit: number = 12, skip: number = 0, category?: string, searchQuery?: string) => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = `${API_BASE}/products?limit=${limit}&skip=${skip}`;
        if (searchQuery && searchQuery.trim()) {
          url += `&q=${encodeURIComponent(searchQuery.trim())}`;
        }
        
        if (category && category !== 'all') {
          url = `${API_BASE}/products/category/${category}?limit=${limit}&skip=${skip}`;
          if (searchQuery && searchQuery.trim()) {
            url += `&q=${encodeURIComponent(searchQuery.trim())}`;
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'An error occurred',
          status: 500
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, skip, category, searchQuery]);

  return { data, loading, error, refetch: () => window.location.reload() };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/products/categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Normalize categories to strings to avoid runtime errors in UI
        const normalized = Array.isArray(result)
          ? result.map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                return item.slug || item.name || String(item);
              }
              return String(item);
            })
          : [];
        setCategories(['all', ...normalized]);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to load categories'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setProduct(result);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : 'Failed to load product'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};