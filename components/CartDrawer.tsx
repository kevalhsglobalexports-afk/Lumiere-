
import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  total: number;
  // Added formatPrice to props interface to handle currency conversion
  formatPrice: (usdPrice: number) => string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove, 
  total,
  // Destructured formatPrice from props
  formatPrice
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-serif font-bold text-stone-900">Shopping Cart</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    onClick={onClose}
                    className="p-2 -m-2 text-stone-400 hover:text-stone-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="mx-auto h-12 w-12 text-stone-300" />
                    <p className="mt-4 text-stone-500 font-medium">Your cart is empty.</p>
                    <button
                      onClick={onClose}
                      className="mt-6 text-amber-600 font-semibold hover:text-amber-700 underline underline-offset-4"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-stone-100">
                    {items.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-stone-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-stone-900">
                              <h3 className="font-serif">{item.name}</h3>
                              {/* Used formatPrice instead of hardcoded $ symbol */}
                              <p className="ml-4">{formatPrice(item.price)}</p>
                            </div>
                            <p className="mt-1 text-sm text-stone-500">{item.category}</p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center border border-stone-200 rounded-full px-2">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="p-1 text-stone-500 hover:text-stone-900"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="mx-3 text-stone-900 font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="p-1 text-stone-500 hover:text-stone-900"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemove(item.id)}
                              className="font-medium text-red-400 hover:text-red-500 flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-stone-100 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-stone-900">
                  <p>Subtotal</p>
                  {/* Used formatPrice instead of hardcoded $ symbol and toFixed(2) */}
                  <p>{formatPrice(total)}</p>
                </div>
                <p className="mt-0.5 text-sm text-stone-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link 
                    to="/checkout"
                    onClick={onClose}
                    className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-stone-900 hover:bg-stone-800 transition-all"
                  >
                    Checkout Now
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-stone-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-amber-600 font-medium hover:text-amber-500"
                      onClick={onClose}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
