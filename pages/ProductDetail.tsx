
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Star, ShieldCheck, RefreshCcw, Droplets, Play, Film } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductDetailProps {
  onAddToCart: (p: Product) => void;
  products: Product[];
  formatPrice: (usdPrice: number) => string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart, products, formatPrice }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const allImages = product?.images && product.images.length > 0 ? product.images : [product?.image || ''];
  const hasVideo = !!product?.video;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl font-serif">Product Not Found</h2>
        <Link to="/shop" className="text-amber-600 underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center space-x-2 text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/shop" className="hover:text-stone-900">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-stone-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
        {/* Gallery Section */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-square rounded-[4rem] overflow-hidden bg-white border border-stone-100 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {mediaType === 'image' ? (
                <motion.img 
                  key={activeMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={allImages[activeMediaIndex]} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <motion.video 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={product.video} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-cover" 
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => { setActiveMediaIndex(idx); setMediaType('image'); }}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeMediaIndex === idx && mediaType === 'image' ? 'border-amber-500 ring-4 ring-amber-100' : 'border-stone-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
            {hasVideo && (
              <button 
                onClick={() => setMediaType('video')}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-stone-900 flex flex-col items-center justify-center gap-1 ${mediaType === 'video' ? 'border-amber-500 ring-4 ring-amber-100' : 'border-stone-100'}`}
              >
                <Film className="w-6 h-6 text-white" />
                <span className="text-[8px] font-bold text-white uppercase tracking-widest">Ritual</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">{product.category}</span>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />)}
              </div>
              <span className="text-stone-500 text-sm font-medium">{product.reviews} Reviews</span>
            </div>
          </div>

          <p className="text-5xl font-light text-stone-900">{formatPrice(product.price)}</p>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">The Narrative</h3>
            <p className="text-stone-600 leading-relaxed font-light text-xl">{product.description}</p>
          </div>

          <div className="space-y-8 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-stone-50 p-6 rounded-3xl">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-widest">100% Organic</span>
              </div>
              <div className="flex items-center gap-4 bg-stone-50 p-6 rounded-3xl">
                <RefreshCcw className="w-6 h-6 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-widest">Recyclable</span>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)} 
              className="w-full bg-stone-900 text-white py-6 rounded-full font-bold text-xl shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-4 active:scale-95"
            >
              <ShoppingBag className="w-6 h-6" /> Add to Ritual
            </button>
          </div>

          {product.ingredients.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Molecular Elements</h3>
              <div className="flex flex-wrap gap-3">
                {product.ingredients.map((ing, idx) => (
                  <span key={idx} className="px-5 py-2.5 bg-stone-50 rounded-full text-xs font-medium text-stone-600 border border-stone-100">{ing}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
