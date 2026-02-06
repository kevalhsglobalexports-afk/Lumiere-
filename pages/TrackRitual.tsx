
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Truck, CheckCircle2, MapPin, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { dbService } from '../services/db';
import { Order } from '../types';

const TrackRitual: React.FC = () => {
  const [ritualId, setRitualId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [result, setResult] = useState<null | 'not_found' | 'tracking'>(null);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setRitualId(id);
      handleTrack(null, id);
    }
  }, [location]);

  const handleTrack = async (e: React.FormEvent | null, idOverride?: string) => {
    if (e) e.preventDefault();
    const idToTrack = idOverride || ritualId;
    if (!idToTrack) return;

    setTracking(true);
    setResult(null);

    // Simulate API call delay for atmosphere
    setTimeout(() => {
      const allOrders = dbService.getOrders();
      const foundOrder = allOrders.find(o => o.id.toLowerCase() === idToTrack.toLowerCase());
      
      if (foundOrder) {
        setOrderData(foundOrder);
        setResult('tracking');
      } else {
        setOrderData(null);
        setResult('not_found');
      }
      setTracking(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 min-h-[70vh]">
      <div className="text-center space-y-4 mb-16">
        <Link to="/my-orders" className="text-stone-400 hover:text-stone-900 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to My Rituals
        </Link>
        <span className="text-amber-600 font-bold uppercase tracking-[0.3em] text-xs">Post-Purchase Journey</span>
        <h1 className="text-5xl font-serif">Track Your Ritual</h1>
        <p className="text-stone-500 font-light max-w-lg mx-auto">
          Enter your unique Ritual ID provided in your confirmation email to see the progress of your botanical essentials.
        </p>
      </div>

      <div className="bg-white rounded-[4rem] p-8 md:p-12 shadow-2xl border border-stone-100">
        <form onSubmit={(e) => handleTrack(e)} className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
            <input 
              type="text" 
              placeholder="e.g. LUM-8832-721" 
              value={ritualId}
              onChange={(e) => setRitualId(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border border-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-lg font-light bg-stone-50 focus:bg-white"
            />
          </div>
          <button 
            type="submit"
            disabled={tracking || !ritualId}
            className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {tracking ? <><Loader2 className="w-5 h-5 animate-spin" /> Locating...</> : 'Track Journey'}
          </button>
        </form>

        <motion.div 
          animate={{ opacity: result ? 1 : 0, y: result ? 0 : 20 }}
          className="space-y-8"
        >
          {result === 'tracking' && orderData && (
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-stone-100 pb-10 gap-6">
                <div>
                  <h3 className="text-2xl font-serif text-stone-900">Current Aura: <span className="text-amber-600 font-bold italic">{orderData.status}</span></h3>
                  <p className="text-stone-400 text-sm mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Manifested on {orderData.date}
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Destination</p>
                    <p className="text-xs font-bold text-stone-900">{orderData.address.city}, {orderData.address.country}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="relative space-y-12 pl-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-stone-100">
                {/* Pending State */}
                <div className="relative">
                  <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    ['Pending', 'Shipped', 'Delivered'].includes(orderData.status) ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-300'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900">Ritual Prepared & Verified</h4>
                  <p className="text-stone-500 text-sm font-light">Maison artisans have hand-selected and verified your botanical components.</p>
                </div>

                {/* Shipped State */}
                <div className="relative">
                  <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    ['Shipped', 'Delivered'].includes(orderData.status) ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-300'
                  }`}>
                    {['Shipped', 'Delivered'].includes(orderData.status) ? <Truck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <h4 className={`font-bold ${['Shipped', 'Delivered'].includes(orderData.status) ? 'text-stone-900' : 'text-stone-400'}`}>Departed Maison Hub</h4>
                  <p className="text-stone-500 text-sm font-light">The selection has begun its physical journey to your sanctuary.</p>
                </div>

                {/* Delivered State */}
                <div className="relative">
                  <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    orderData.status === 'Delivered' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-stone-100 text-stone-300'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold ${orderData.status === 'Delivered' ? 'text-stone-900' : 'text-stone-400'}`}>Sanctuary Arrival</h4>
                  <p className="text-stone-500 text-sm font-light">Fulfillment confirmed at your coordinates. Ritual complete.</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 text-center">
                 <p className="text-xs text-stone-500 font-light italic">Need assistance with your journey? Our beauty concierge is ready.</p>
                 <Link to="/contact" className="inline-block mt-4 text-amber-600 font-bold uppercase tracking-widest text-[10px] border-b border-amber-600 pb-1">Contact Support</Link>
              </div>
            </div>
          )}

          {result === 'not_found' && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto text-stone-200">
                <Package className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif">Ritual Not Found</h3>
                <p className="text-stone-500 font-light max-w-xs mx-auto">We couldn't locate a journey with the ID: <span className="font-bold text-stone-900">{ritualId}</span>.</p>
              </div>
              <button 
                onClick={() => setRitualId('')}
                className="text-amber-600 font-bold uppercase tracking-widest text-[10px] underline underline-offset-4"
              >
                Try Another ID
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Internal Loader component
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default TrackRitual;
