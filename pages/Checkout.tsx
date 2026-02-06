
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  User, 
  MapPin, 
  ChevronDown,
  Search,
  Check,
  Phone,
  Crosshair,
  Loader2,
  AlertCircle,
  Globe,
  Wallet,
  Building,
  Zap,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  QrCode,
  Copy,
  ExternalLink,
  // Added Sparkles import to fix the "Cannot find name 'Sparkles'" error on line 402
  Sparkles
} from 'lucide-react';
import { CartItem, Order } from '../types';
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_STATE, POSTAL_CODES_BY_CITY, CURRENCY_MAP } from '../constants';
import { dbService } from '../services/db';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  user: { name: string; email: string; isAdmin?: boolean } | null;
  activeCountry: string;
  hasLocationSet: boolean;
  setActiveCountry: (c: string) => void;
  onOpenLocation: () => void;
  formatPrice: (usdPrice: number) => string;
  onOpenLogin: () => void;
}

const CustomDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ label, value, options, onChange, placeholder = "Select...", disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    const opts = options || [];
    const extended = value && !opts.includes(value) ? [value, ...opts] : opts;
    return extended.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [options, searchTerm, value]);

  return (
    <div className={`space-y-2 relative ${disabled ? 'opacity-50' : ''}`}>
      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 pl-2">{label}</label>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-white transition-all cursor-pointer flex justify-between items-center ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <span className={value ? "text-stone-900 font-medium" : "text-stone-300"}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-stone-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute z-[70] left-0 right-0 top-full mt-2 bg-white rounded-[2rem] shadow-2xl border border-stone-100 overflow-hidden flex flex-col max-h-72"
            >
              <div className="p-4 border-b border-stone-50">
                <input type="text" autoFocus placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 bg-stone-50 rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-amber-100" />
              </div>
              <div className="overflow-y-auto no-scrollbar py-2">
                {filteredOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }} className="w-full text-left px-6 py-3 text-sm hover:bg-amber-50 transition-colors flex justify-between items-center">
                    <span className={value === opt ? "text-amber-600 font-bold" : "text-stone-600"}>{opt}</span>
                    {value === opt && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Checkout: React.FC<CheckoutProps> = ({ 
  items, 
  total, 
  user, 
  activeCountry, 
  hasLocationSet,
  setActiveCountry, 
  onOpenLocation,
  formatPrice, 
  onOpenLogin 
}) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStage, setVerificationStage] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'express' | 'upi' | 'bank'>('card');
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [address, setAddress] = useState({ street: '', city: '', state: '', postalCode: '', phone: '' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: user?.name || '' });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (!hasLocationSet && user) {
      onOpenLocation();
    }
  }, [hasLocationSet, user, onOpenLocation]);

  const tax = total * 0.08;
  const grandTotal = total + tax;

  const handleAutoFill = () => {
    if (!user) return;
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const data = await res.json();
            
            if (data && data.address) {
              const addr = data.address;
              const house = addr.house_number ? `${addr.house_number}, ` : '';
              const road = addr.road || addr.pedestrian || addr.suburb || 'Sanctuary Road';
              const city = addr.city || addr.town || addr.village || addr.suburb || '';
              const state = addr.state || '';
              const postcode = addr.postcode || '';
              const detectedCountry = addr.country;

              setAddress({
                street: `${house}${road}`,
                city: city,
                state: state,
                postalCode: postcode,
                phone: address.phone || '+1 (555) RITUALS'
              });

              if (detectedCountry && COUNTRIES.includes(detectedCountry) && detectedCountry !== activeCountry) {
                setActiveCountry(detectedCountry);
              }
              setCardData(prev => ({ ...prev, name: user.name }));
            }
          } catch (e) {
            console.error("Precision tracking error:", e);
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
          setCardData(prev => ({ ...prev, name: user.name }));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsProcessing(true);
    setVerificationStage(1);
    
    setTimeout(() => setVerificationStage(2), 1200);
    setTimeout(() => setVerificationStage(3), 2800);
    setTimeout(() => {
      const generatedId = `LUM-${Math.floor(10000 + Math.random() * 90000)}`;
      const order: Order = {
        id: generatedId,
        customerName: user.name,
        customerEmail: user.email,
        items: [...items],
        total: grandTotal,
        status: 'Pending',
        paymentMethod: paymentMethod.toUpperCase(),
        date: new Date().toLocaleString(),
        address: { ...address, country: activeCountry, phone: address.phone || 'Not Provided' }
      };
      dbService.saveOrder(order);
      setConfirmedOrderId(generatedId);
      setIsProcessing(false);
      setIsConfirmed(true);
      window.scrollTo(0, 0);
    }, 4500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(confirmedOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardData({ ...cardData, number: value.substring(0, 19) });
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    setCardData({ ...cardData, expiry: value.substring(0, 5) });
  };

  if (!user && !isConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-8 max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-[3rem] flex items-center justify-center shadow-inner"><User className="w-10 h-10" /></div>
        <h2 className="text-4xl font-serif">Maison Entrance Required</h2>
        <button onClick={onOpenLogin} className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold shadow-xl">Sign In to Continue</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <AnimatePresence mode="wait">
        {!isConfirmed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center gap-6 mb-8 overflow-x-auto no-scrollbar pb-2">
                <button onClick={() => setStep('shipping')} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 'shipping' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 bg-stone-50'}`}>1. Shipping</button>
                <div className="w-8 h-px bg-stone-200 shrink-0" />
                <button onClick={() => setStep('payment')} disabled={!address.street} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${step === 'payment' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 bg-stone-50 disabled:opacity-50'}`}>2. Secure Payment</button>
              </div>

              {step === 'shipping' ? (
                <section className="space-y-10">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                    <h3 className="text-3xl font-serif text-stone-900">Delivery Sanctum</h3>
                    <div className="flex gap-2">
                      <button onClick={onOpenLocation} className="text-stone-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-stone-900 transition-colors">
                        <Globe className="w-3 h-3" /> Change Hub
                      </button>
                      <button 
                        onClick={handleAutoFill}
                        disabled={isLocating}
                        className="text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-amber-50 px-6 py-2.5 rounded-full border border-amber-100 shadow-sm hover:shadow-md transition-all active:scale-95"
                      >
                        {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />} 
                        {isLocating ? "Locating..." : "Precision Auto-Fill"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <CustomDropdown label="Country (Current Hub)" value={activeCountry} options={COUNTRIES} onChange={(val) => setActiveCountry(val)} />
                    <CustomDropdown label="State" value={address.state} options={STATES_BY_COUNTRY[activeCountry] || []} onChange={(val) => setAddress({...address, state: val})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 pl-2">Sanctuary Entrance (Street)</label>
                    <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-200 transition-all font-medium" placeholder="Street Address" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <CustomDropdown label="City" value={address.city} options={CITIES_BY_STATE[address.state] || []} onChange={(val) => setAddress({...address, city: val})} />
                    <CustomDropdown label="Postal Code" value={address.postalCode} options={POSTAL_CODES_BY_CITY[address.city] || []} onChange={(val) => setAddress({...address, postalCode: val})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 pl-2">Messenger Token (Phone)</label>
                    <input type="tel" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-200 transition-all font-medium" placeholder="+1 (000) 000-0000" />
                  </div>

                  <button onClick={() => setStep('payment')} className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]">Continue to Payment <ArrowRight className="w-5 h-5" /></button>
                </section>
              ) : (
                <form onSubmit={handlePayment} className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-serif text-stone-900 border-b border-stone-100 pb-4">Alchemical Gateway</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { id: 'card', icon: CreditCard, label: 'Card' },
                        { id: 'upi', icon: Smartphone, label: 'UPI' },
                        { id: 'express', icon: Zap, label: 'Express' },
                        { id: 'bank', icon: Building, label: 'Bank' }
                      ].map(method => (
                        <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id as any)} className={`p-6 rounded-[2rem] border flex flex-col items-center gap-3 transition-all ${paymentMethod === method.id ? 'bg-stone-900 text-white border-stone-900 shadow-xl' : 'bg-white text-stone-500 border-stone-100 hover:border-amber-200'}`}>
                          <method.icon className="w-6 h-6" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-stone-900 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
                      <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-stone-500">Secure Token (Card Number)</label>
                          <input type="text" required placeholder="0000 0000 0000 0000" value={cardData.number} onChange={handleCardNumber} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 outline-none font-mono text-lg tracking-widest" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-stone-500">Maturity (MM/YY)</label>
                            <input type="text" required placeholder="12/28" value={cardData.expiry} onChange={handleExpiry} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-stone-500">Aura Code (CVV)</label>
                            <input type="password" required placeholder="•••" maxLength={3} value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-stone-500">Name on Account</label>
                          <input type="text" required placeholder="Full Name" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:bg-white/10 outline-none" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'upi' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                      <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-3xl border border-stone-100">
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm"><QrCode className="w-8 h-8 text-stone-900" /></div>
                         <div>
                            <h4 className="font-serif text-xl">UPI Aura Pay</h4>
                            <p className="text-stone-400 text-xs font-light">Scan and pay instantly from any UPI app.</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] uppercase font-bold text-stone-400 ml-4">VPA / UPI ID</label>
                         <input 
                            type="text" 
                            required 
                            placeholder="lumiere@essence" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-200 transition-all font-medium" 
                         />
                      </div>
                    </motion.div>
                  )}

                  <button type="submit" className="w-full bg-stone-900 text-white py-8 rounded-full font-bold text-xl shadow-2xl hover:bg-stone-800 transition-all flex items-center justify-center gap-4 active:scale-[0.98]">
                    <Lock className="w-5 h-5 text-amber-500" /> Seal Ritual & Pay {formatPrice(grandTotal)}
                  </button>
                </form>
              )}
            </div>
            
            <aside className="lg:col-span-5">
              <div className="sticky top-32 bg-white rounded-[4rem] p-12 border border-stone-100 shadow-xl space-y-12">
                <h3 className="text-3xl font-serif">Ritual Selection</h3>
                <div className="space-y-10 max-h-[400px] overflow-y-auto no-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-6">
                      <img src={item.image} className="w-24 h-32 rounded-3xl object-cover shadow-sm" />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-serif text-2xl text-stone-900">{item.name}</h4>
                        <p className="font-serif font-bold text-amber-700 mt-2 text-xl">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-10 border-t border-stone-100 space-y-4">
                  <div className="flex justify-between text-sm uppercase tracking-widest text-stone-500"><span>Subtotal</span><span className="font-bold text-stone-900">{formatPrice(total)}</span></div>
                  <div className="flex justify-between text-sm uppercase tracking-widest text-stone-500"><span>Tax</span><span className="font-bold text-stone-900">{formatPrice(tax)}</span></div>
                  <div className="flex justify-between text-4xl font-serif pt-8 border-t border-stone-100 text-stone-900"><span>Total</span><span className="text-amber-600 font-bold">{formatPrice(grandTotal)}</span></div>
                </div>
              </div>
            </aside>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 space-y-12 max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-16 h-16" /></div>
            <div className="space-y-6">
              <h1 className="text-7xl font-serif">Ritual Accepted</h1>
              <p className="text-stone-500 text-2xl font-light">Gratitude, {user?.name}. Your botanical selection is being synthesized.</p>
            </div>

            <div className="bg-stone-50 rounded-[3rem] p-10 space-y-6 border border-stone-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles className="w-24 h-24" /></div>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600">Your Unique Ritual ID</p>
               <div className="flex flex-col items-center gap-4">
                  <span className="text-5xl font-mono font-bold text-stone-900 select-all">{confirmedOrderId}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-white px-6 py-2.5 rounded-full border border-stone-200 text-xs font-bold text-stone-600 hover:border-amber-400 hover:text-amber-600 transition-all shadow-sm active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Ritual ID Secured' : 'Copy Ritual ID'}
                  </button>
               </div>
               <p className="text-xs text-stone-400 italic">Save this code to track your package's spiritual journey in your account.</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to={`/track-ritual?id=${confirmedOrderId}`} className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold shadow-xl flex items-center justify-center gap-3"><ExternalLink className="w-4 h-4" /> Start Tracking</Link>
               <Link to="/my-orders" className="bg-white text-stone-900 px-12 py-5 rounded-full font-bold border border-stone-200">View History</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-stone-900/80 backdrop-blur-xl" />
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-full max-w-md bg-white rounded-[4rem] p-16 text-center space-y-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-stone-100">
                   <motion.div initial={{ width: 0 }} animate={{ width: verificationStage === 1 ? '33%' : verificationStage === 2 ? '66%' : '100%' }} className="h-full bg-amber-500 transition-all duration-1000" />
                </div>
                
                <div className="space-y-8">
                  <div className="relative">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-[2.5rem] border-4 border-stone-100 border-t-amber-500 mx-auto" />
                    <ShieldAlert className="absolute inset-0 m-auto w-8 h-8 text-stone-200" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif">Sanctuary Shield</h2>
                    <AnimatePresence mode="wait">
                      <motion.p key={verificationStage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">
                        {verificationStage === 1 && "Connecting to Secure Vault..."}
                        {verificationStage === 2 && "Validating VPA Aura..."}
                        {verificationStage === 3 && "Finalizing Spiritual Exchange..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                
                <p className="text-stone-300 text-xs font-light italic">Please do not refresh. This ritual is delicate.</p>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
