import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles, User, LogOut, Globe, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyConfig } from '../constants';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  user: { name: string; email: string; isAdmin?: boolean } | null;
  activeCountry: string;
  currency: CurrencyConfig;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenLocation: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  user, 
  activeCountry,
  currency,
  onLogout, 
  onOpenAuth,
  onOpenLocation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Philosophy', path: '/philosophy' },
    { name: 'Consultation', path: '/consultation' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-stone-900 flex items-center gap-2 group">
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500/20 group-hover:rotate-12 transition-transform" />
              <span className="bg-gradient-to-r from-stone-900 to-stone-600 bg-clip-text text-transparent">LUMIÈRE</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative py-2 ${
                  isActive(link.path) ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                  />
                )}
              </Link>
            ))}
            
            <div className="flex items-center gap-6 border-l border-stone-100 pl-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={onOpenLocation}
                className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 group transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{currency.code}</span>
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => user ? setIsProfileMenuOpen(!isProfileMenuOpen) : onOpenAuth()}
                  className="p-2 text-stone-600 hover:text-amber-600 transition-colors relative flex items-center gap-2 group"
                >
                  <User className={`w-6 h-6 ${user ? 'text-amber-600' : ''}`} />
                  {user && <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline">{user.name.split(' ')[0]}</span>}
                </button>

                <AnimatePresence>
                  {user && isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden z-[60]"
                    >
                      <div className="p-8 space-y-4 text-center">
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Maison Seeker</p>
                        <p className="font-serif text-lg truncate px-2 text-stone-900">{user.name}</p>
                        
                        <div className="pt-4 border-t border-stone-50 space-y-2">
                          <Link 
                            to="/my-orders" 
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-600 transition-colors py-3"
                          >
                            <Package className="w-3.5 h-3.5" /> My Rituals
                          </Link>
                          
                          {user.isAdmin && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors py-3"
                            >
                              Oracle Dashboard
                            </Link>
                          )}

                          <button 
                            onClick={() => { onLogout(); setIsProfileMenuOpen(false); navigate('/'); }} 
                            className="flex items-center justify-center gap-2 w-full text-xs font-bold text-red-400 hover:text-red-500 transition-colors py-3"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={onOpenCart} className="relative p-2 text-stone-600 hover:text-amber-600 transition-colors group">
                <ShoppingBag className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-amber-600 rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button className="md:hidden p-2 text-stone-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-serif ${isActive(link.path) ? 'text-amber-600' : 'text-stone-900'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-stone-50 space-y-6">
                 <button onClick={() => { onOpenLocation(); setIsOpen(false); }} className="flex items-center gap-4 text-stone-600">
                   <Globe className="w-5 h-5" /> <span className="font-bold text-sm uppercase tracking-widest">{activeCountry}</span>
                 </button>
                 {!user && (
                    <button onClick={() => { onOpenAuth(); setIsOpen(false); }} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold">Sign In</button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
