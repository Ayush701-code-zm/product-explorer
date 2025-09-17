import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorState } from './ErrorState';
import { Pagination } from './Pagination';
import { useProducts } from '../hooks/useProducts';
import { Package } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { sortProducts, filterProducts } from '../utils/sorting';

export const ProductGrid: React.FC = () => {
  const { 
    currentPage, 
    selectedCategory, 
    sortBy, 
    searchQuery, 
    setCurrentPage 
  } = useAppStore();

  const limit = 12;
  const skip = (currentPage - 1) * limit;
  
  const { data, loading, error, refetch } = useProducts(limit, skip, selectedCategory, searchQuery);

  const processedProducts = useMemo(() => {
    if (!data?.products) return [];
    
    let products = [...data.products];
    
    if (searchQuery.trim()) {
      products = filterProducts(products, searchQuery);
    }
    
    // Apply sorting
    products = sortProducts(products, sortBy);
    
    return products;
  }, [data?.products, searchQuery, sortBy]);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  if (loading) {
    return <LoadingSkeleton count={limit} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (processedProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Package className="w-8 h-8 text-gray-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-gray-600">
          Showing {processedProducts.length} of {data?.total || 0} products
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {searchQuery.trim() && ` matching "${searchQuery}"`}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {processedProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
};