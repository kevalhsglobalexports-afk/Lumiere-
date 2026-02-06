
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, X, Loader2, Navigation, Check, AlertCircle } from 'lucide-react';
import { COUNTRIES } from '../constants';

interface LocationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateLocation: (country: string) => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ isOpen, onClose, onUpdateLocation }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAutoDetect = () => {
    setIsLocating(true);
    setError('');

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            const data = await res.json();
            
            if (data && data.address) {
              const country = data.address.country;
              if (COUNTRIES.includes(country)) {
                onUpdateLocation(country);
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                  onClose();
                }, 1500);
              } else {
                onUpdateLocation("United States");
                setError(`Hub for "${country}" is currently offline. Routing to Global HQ.`);
              }
            }
          } catch (e) {
            setError("Atmospheric interference detected. Please select manual hub.");
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setError("Sanctuary coordinates denied. Please select manual hub.");
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setError("Celestial tracking not supported by this vessel.");
      setIsLocating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3.5rem] p-12 shadow-2xl overflow-hidden text-center"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900"><X /></button>
            
            <div className="space-y-8">
              <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                {isLocating ? <Loader2 className="w-10 h-10 text-amber-600 animate-spin" /> : <Navigation className="w-10 h-10 text-amber-600" />}
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif">Select Your Maison Hub</h2>
                <p className="text-stone-500 font-light text-sm px-4">
                  Allow Lumière to align your experience. We will adjust the apothecary's tender and shipping rituals to your current sanctum.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleAutoDetect}
                  disabled={isLocating || success}
                  className={`w-full py-6 rounded-full font-bold shadow-xl transition-all flex items-center justify-center gap-3 ${
                    success ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-amber-600'
                  }`}
                >
                  {success ? <><Check /> Hub Synchronized</> : <><MapPin className="w-5 h-5" /> Auto-Detect My Sanctuary</>}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100" /></div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-stone-400"><span className="bg-white px-4 italic">or manual selection</span></div>
                </div>

                <select 
                  onChange={(e) => { onUpdateLocation(e.target.value); onClose(); }}
                  className="w-full px-6 py-5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-200 transition-all font-bold text-stone-800 appearance-none text-center"
                >
                  <option disabled selected>Select Manual Hub...</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && (
                <div className="flex items-center gap-2 justify-center text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationPrompt;
