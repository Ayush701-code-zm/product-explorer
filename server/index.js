const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://product-explorer-six.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < duration) {
      console.log(`Cache HIT for ${key}`);
      return res.json(cached.data);
    }
    
    console.log(`Cache MISS for ${key}`);
    const originalSend = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      originalSend.call(this, data);
    };
    next();
  };
};

app.get('/api/products', cacheMiddleware(), async (req, res) => {
  try {
    const { limit = 12, skip = 0, q } = req.query;
    
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    
    if (q && q.trim()) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(q.trim())}&limit=${limit}&skip=${skip}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`DummyJSON API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

app.get('/api/products/categories', cacheMiddleware(10 * 60 * 1000), async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/products/categories');
    
    if (!response.ok) {
      throw new Error(`DummyJSON API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      message: error.message 
    });
  }
});

app.get('/api/products/category/:category', cacheMiddleware(), async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, skip = 0, q } = req.query;
    
    let url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`DummyJSON API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch category products',
      message: error.message 
    });
  }
});

app.get('/api/products/:id', cacheMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`DummyJSON API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      error: 'Failed to fetch product',
      message: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cache: {
      size: cache.size,
      entries: Array.from(cache.keys())
    }
  });
});

app.post('/api/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache cleared successfully' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧹 Clear cache: POST http://localhost:${PORT}/api/cache/clear`);
});

module.exports = app;