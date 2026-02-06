import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import LocationPrompt from './components/LocationPrompt';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Philosophy from './pages/Philosophy';
import Contact from './pages/Contact';
import Consultation from './pages/Consultation';
import TrackRitual from './pages/TrackRitual';
import Sustainability from './pages/Sustainability';
import Privacy from './pages/Privacy';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import MyOrders from './pages/MyOrders';
import { Product, CartItem, UserStored } from './types';
import { dbService } from './services/db';
import { AnimatePresence } from 'framer-motion';
import { CURRENCY_MAP, CurrencyConfig } from './constants';

const ACTIVE_USER_KEY = 'lumiere_active_session';
const LOCATION_SET_KEY = 'lumiere_location_selected';
const COUNTRY_KEY = 'lumiere_active_country';

const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationPromptOpen, setIsLocationPromptOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isAdmin?: boolean } | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize from storage or defaults
  const [activeCountry, setActiveCountry] = useState<string>(() => {
    return localStorage.getItem(COUNTRY_KEY) || "United States";
  });
  const [hasLocationSet, setHasLocationSet] = useState<boolean>(() => {
    return localStorage.getItem(LOCATION_SET_KEY) === 'true';
  });

  const currency = useMemo(() => CURRENCY_MAP[activeCountry] || CURRENCY_MAP["United States"], [activeCountry]);

  // Global price formatter
  const formatPrice = (usdPrice: number) => {
    const converted = usdPrice * currency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
    }).format(converted);
  };

  useEffect(() => {
    const storedProducts = dbService.getProducts();
    setProducts(storedProducts);

    const activeSession = localStorage.getItem(ACTIVE_USER_KEY);
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        localStorage.removeItem(ACTIVE_USER_KEY);
      }
    }
  }, []);

  const handleUpdateLocation = (country: string) => {
    setActiveCountry(country);
    setHasLocationSet(true);
    localStorage.setItem(COUNTRY_KEY, country);
    localStorage.setItem(LOCATION_SET_KEY, 'true');
    setIsLocationPromptOpen(false);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), 
  [cart]);

  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0), 
  [cart]);

  const handleLoginAction = (name: string, email: string, pass: string, isSignUp: boolean): { success: boolean; message?: string } => {
    const emailLower = email.toLowerCase();
    const existingUsers = dbService.getUsers();
    
    let loggedInUser = null;
    if (emailLower === 'admin@lumiere.com' && pass === 'admin') {
      loggedInUser = { name: 'Maison Admin', email: emailLower, isAdmin: true };
    } else {
      if (isSignUp) {
        const newUser: UserStored = { name, email: emailLower, password: pass };
        dbService.saveUser(newUser);
        loggedInUser = { name, email: emailLower, isAdmin: false };
      } else {
        const foundUser = existingUsers.find(u => u.email.toLowerCase() === emailLower);
        if (foundUser && foundUser.password === pass) {
          loggedInUser = { name: foundUser.name, email: foundUser.email, isAdmin: foundUser.isAdmin };
        }
      }
    }

    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(loggedInUser));
      setIsLoginModalOpen(false);
      
      if (loggedInUser.isAdmin) {
        // Admin goes straight to dashboard, no location prompt
        navigate('/admin');
      } else if (!hasLocationSet) {
        // Regular users get location prompt if not set
        setTimeout(() => setIsLocationPromptOpen(true), 800);
      }
      
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials or account ritual incomplete.' };
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_KEY);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-100 selection:text-amber-900">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        user={user} 
        activeCountry={activeCountry}
        currency={currency}
        onLogout={handleLogout} 
        onOpenAuth={() => setIsLoginModalOpen(true)}
        onOpenLocation={() => setIsLocationPromptOpen(true)}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home user={user} formatPrice={formatPrice} />} />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} products={products} formatPrice={formatPrice} />} />
            <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} products={products} formatPrice={formatPrice} />} />
            <Route path="/philosophy" element={<Philosophy />} />
            <Route path="/contact" element={<Contact user={user} />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/track-ritual" element={<TrackRitual />} />
            <Route path="/my-orders" element={<MyOrders user={user} formatPrice={formatPrice} />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/checkout" element={
              <Checkout 
                items={cart} 
                total={cartTotal} 
                user={user} 
                activeCountry={activeCountry}
                hasLocationSet={hasLocationSet}
                setActiveCountry={handleUpdateLocation}
                onOpenLocation={() => setIsLocationPromptOpen(true)}
                formatPrice={formatPrice}
                onOpenLogin={() => setIsLoginModalOpen(true)} 
              />
            } />
            <Route 
              path="/admin" 
              element={
                user?.isAdmin ? (
                  <Admin 
                    products={products} 
                    onAddProduct={(p) => {
                      const newProducts = [p, ...products];
                      setProducts(newProducts);
                      dbService.saveProducts(newProducts);
                    }} 
                    onDeleteProduct={(id) => {
                      const newProducts = products.filter(p => p.id !== id);
                      setProducts(newProducts);
                      dbService.saveProducts(newProducts);
                    }} 
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>

      <footer className="bg-stone-900 text-white py-24 px-4 overflow-hidden mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-16 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <h2 className="text-4xl font-serif tracking-tighter text-white">LUMIÈRE</h2>
            <p className="text-stone-400 font-light max-w-sm leading-relaxed text-lg">
              The pinnacle of botanical luxury. Crafted with intention, delivered with grace. Join our journey to radiant skin.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-amber-500">Maison</h4>
            <ul className="space-y-4 text-stone-400 font-light">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><button onClick={() => setIsLocationPromptOpen(true)} className="hover:text-white transition-colors">Change Hub</button></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-amber-500">Care</h4>
            <ul className="space-y-4 text-stone-400 font-light">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/sustainability" className="hover:text-white transition-colors">Our Promise</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-stone-500 tracking-[0.2em] uppercase">
          <p>© 2024 Lumière Essence. Global Presence: {activeCountry}</p>
        </div>
      </footer>

      <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLoginAction} />
      
      <LocationPrompt 
        isOpen={isLocationPromptOpen} 
        onClose={() => setIsLocationPromptOpen(false)} 
        onUpdateLocation={handleUpdateLocation} 
      />

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            total={cartTotal}
            formatPrice={formatPrice}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;