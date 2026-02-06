
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, Film } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard: React.FC<{ product: Product; formatPrice: (p: number) => string; onAddToCart: (p: Product) => void }> = ({ product, formatPrice, onAddToCart }) => {
  const [mediaIndex, setMediaIndex] = useState(0);
  
  // Combine images and video into a single media array for cycling
  const mediaItems = useMemo(() => {
    const items: { type: 'image' | 'video'; url: string }[] = [];
    
    // Add images
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => items.push({ type: 'image', url: img }));
    } else {
      items.push({ type: 'image', url: product.image });
    }
    
    // Add video if it exists
    if (product.video) {
      items.push({ type: 'video', url: product.video });
    }
    
    return items;
  }, [product]);

  useEffect(() => {
    if (mediaItems.length <= 1) return;

    const interval = setInterval(() => {
      setMediaIndex((prev) => (prev + 1) % mediaItems.length);
    }, 3000); // 3 seconds per item as requested

    return () => clearInterval(interval);
  }, [mediaItems]);

  const currentMedia = mediaItems[mediaIndex];

  return (
    <motion.div 
      layout
      className="group flex flex-col h-full bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-700"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-stone-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={mediaIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            {currentMedia.type === 'image' ? (
              <img 
                src={currentMedia.url} 
                className="w-full h-full object-cover" 
                alt={product.name}
              />
            ) : (
              <video 
                src={currentMedia.url} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {mediaItems.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-3 py-1.5 bg-black/10 backdrop-blur-md rounded-full">
            {mediaItems.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-500 ${i === mediaIndex ? 'w-4 bg-white shadow-sm' : 'w-1 bg-white/40'}`} 
              />
            ))}
          </div>
        )}

        {product.video && (
          <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <Film className="w-4 h-4" />
          </div>
        )}
      </Link>
      
      <div className="p-10 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-serif">{product.name}</h3>
          <span className="text-xl font-light text-stone-900">{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
          ))}
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest ml-2">{product.reviews} reviews</span>
        </div>
        <p className="text-sm text-stone-500 font-light line-clamp-2 mb-8 flex-1 leading-relaxed">{product.description}</p>
        <button onClick={(e) => { e.preventDefault(); onAddToCart(product); }} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-amber-600 transition-all active:scale-95">
          <ShoppingBag className="w-5 h-5" /> Add to Ritual
        </button>
      </div>
    </motion.div>
  );
};

interface ShopProps {
  onAddToCart: (p: Product) => void;
  products: Product[];
  formatPrice: (usdPrice: number) => string;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, products, formatPrice }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'priceLow' | 'priceHigh' | 'rating'>('default');

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeCategory, searchQuery, sortBy, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2">The Apothecary</h1>
          <p className="text-stone-500 font-light">Global botanical selection for the intentional seeker.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search rituals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-amber-200 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-10 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat ? 'bg-amber-600 text-white shadow-xl' : 'bg-white text-stone-500 border border-stone-100 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} onAddToCart={onAddToCart} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shop;
