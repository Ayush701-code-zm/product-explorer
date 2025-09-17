import React from 'react';
import { motion } from 'framer-motion';
import { Package, Github, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-white bg-opacity-20 rounded-lg"
            >
              <Package className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Product Showcase Explorer</h1>
              <p className="text-blue-100 text-sm">Discover amazing products with style</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/Ayush701-code-zm/product-explorer.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};