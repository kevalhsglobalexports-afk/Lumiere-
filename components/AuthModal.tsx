
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User as UserIcon, Sparkles, ArrowRight, Check, ShieldAlert, Inbox, ShieldCheck, Loader2, AlertCircle, Ban, BellRing } from 'lucide-react';
import { dbService } from '../services/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string, pass: string, isSignUp: boolean) => { success: boolean; message?: string };
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [activeRitualCode, setActiveRitualCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const adminProfile = dbService.getAdminProfile();

  const passwordRequirements = useMemo(() => [
    { label: 'Minimum 8 characters', met: formData.password.length >= 8 },
    { label: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One special character (@$!%*#?&)', met: /[@$!%*#?&]/.test(formData.password) },
    { label: 'One numeric digit', met: /\d/.test(formData.password) },
  ], [formData.password]);

  const isPasswordValid = passwordRequirements.every(req => req.met);

  const startSignUpRitual = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!isPasswordValid) {
        setError('Your chosen password does not satisfy our security aura.');
        return;
      }
      
      setIsSending(true);
      // Generate a unique 6-digit ritual code
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveRitualCode(mockCode);
      
      // Simulate the time it takes to "send" an email
      setTimeout(() => {
        setIsSending(false);
        setIsVerifying(true);
        // Show simulated notification after a small delay
        setTimeout(() => setShowNotification(true), 1000);
      }, 2500);
      return;
    }

    const result = onLogin(formData.name || 'Member', formData.email, formData.password, isSignUp);
    if (!result.success) {
      setError(result.message || 'Authentication failed');
    } else {
      resetAndClose();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode === activeRitualCode) {
      const result = onLogin(formData.name, formData.email, formData.password, true);
      if (result.success) {
        resetAndClose();
      } else {
        setError(result.message || 'Verification failed');
      }
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setError('Security Protocol: Ritual halted. Multiple discordant attempts detected.');
        // Access is strictly denied. User must restart or wait.
      } else {
        setError(`Discordant Ritual Code. Access Denied. (Attempt ${newAttempts}/3)`);
      }
    }
  };

  const resetAndClose = () => {
    setFormData({ name: '', email: '', password: '' });
    setIsVerifying(false);
    setIsSending(false);
    setVerificationCode('');
    setActiveRitualCode('');
    setError('');
    setFailedAttempts(0);
    setShowNotification(false);
    onClose();
  };

  const handleRestart = () => {
    setVerificationCode('');
    setIsVerifying(false);
    setIsSending(false);
    setError('');
    setFailedAttempts(0);
    setShowNotification(false);
  };

  return (
    <>
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-sm bg-stone-900 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-500">Maison Notification</p>
              <p className="text-sm font-light">From: {adminProfile.email}</p>
              <p className="text-sm font-bold mt-1">Your Ritual Code: <span className="text-amber-400 text-lg">{activeRitualCode}</span></p>
            </div>
            <button onClick={() => setShowNotification(false)} className="p-2 opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetAndClose}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              <button
                onClick={resetAndClose}
                className="absolute top-8 right-8 p-2 text-stone-400 hover:text-stone-900 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-10 sm:p-14 space-y-8 relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                  {isSending ? (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 space-y-8"
                    >
                      <div className="relative">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-24 h-24 rounded-[2.5rem] border-2 border-stone-100 border-t-amber-500"
                        />
                        <Mail className="absolute inset-0 m-auto w-8 h-8 text-amber-600 animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-serif">Sending Ritual Code...</h3>
                        <p className="text-stone-400 font-light text-sm">To: <span className="text-stone-900 font-bold">{formData.email}</span></p>
                        <p className="text-stone-400 font-light text-xs italic">Sent via {adminProfile.email}</p>
                      </div>
                    </motion.div>
                  ) : isVerifying ? (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10 text-center py-6"
                    >
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-amber-50 mb-2 shadow-inner">
                        <Inbox className="w-12 h-12 text-amber-600" />
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-3xl font-serif text-stone-900">Oracle Cross-Check</h2>
                        <p className="text-stone-500 font-light text-sm px-6 leading-relaxed">
                          The Oracle (<span className="text-stone-900 font-bold">{adminProfile.name}</span>) has dispatched a code to your sanctuary at:<br /> 
                          <span className="font-bold text-stone-900 italic underline decoration-amber-200">{formData.email}</span>.
                        </p>
                      </div>

                      <form onSubmit={handleVerifyCode} className="space-y-8">
                        <div className="space-y-3 text-left">
                          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 ml-4">Maison Ritual Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            disabled={failedAttempts >= 3}
                            placeholder="••••••"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            className={`w-full text-center tracking-[0.8em] py-6 rounded-2xl bg-stone-50 border outline-none focus:ring-2 transition-all text-2xl font-bold ${
                              error ? 'border-red-200 focus:ring-red-100 text-red-600' : 'border-stone-100 focus:ring-amber-200'
                            } ${failedAttempts >= 3 ? 'opacity-50 cursor-not-allowed border-red-500 bg-red-50' : ''}`}
                          />
                        </div>
                        
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 justify-center p-4 rounded-xl ${failedAttempts >= 3 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}
                          >
                            {failedAttempts >= 3 ? <Ban className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">{error}</p>
                          </motion.div>
                        )}

                        <div className="space-y-4">
                          {failedAttempts < 3 ? (
                            <button
                              type="submit"
                              className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                              Authenticate Ritual <ShieldCheck className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleRestart}
                              className="w-full bg-red-600 text-white py-6 rounded-full font-bold shadow-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                            >
                              Reset Ritual Cycle
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => { setIsVerifying(false); setError(''); setFailedAttempts(0); setShowNotification(false); }}
                            className="text-xs text-stone-400 hover:text-stone-900 underline underline-offset-4 transition-colors"
                          >
                            Use a different sanctuary address (email)
                          </button>
                        </div>
                      </form>
                      <div className="pt-6 border-t border-stone-50">
                        <p className="text-[10px] text-stone-300 uppercase tracking-[0.2em] italic">
                           Security Aura: Access strictly granted via unique ritual code.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="auth"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-10"
                    >
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-50 mb-2 border border-stone-100">
                          <Sparkles className="w-6 h-6 text-amber-600" />
                        </div>
                        <h2 className="text-4xl font-serif text-stone-900 leading-tight">
                          {isSignUp ? 'Join The Ritual' : 'Welcome Back'}
                        </h2>
                        <p className="text-stone-500 font-light text-sm">
                          {isSignUp ? 'Step into the world of botanical luxury.' : 'Reconnect with your skincare sanctuary.'}
                        </p>
                      </div>

                      <div className="flex p-1.5 bg-stone-50 rounded-2xl border border-stone-100">
                        <button
                          type="button"
                          onClick={() => { setIsSignUp(false); setError(''); }}
                          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${!isSignUp ? 'bg-white text-stone-900 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsSignUp(true); setError(''); }}
                          className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isSignUp ? 'bg-white text-stone-900 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                          Sign Up
                        </button>
                      </div>

                      <form onSubmit={startSignUpRitual} className="space-y-6">
                        {isSignUp && (
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-4">Full Legal Name</label>
                            <div className="relative">
                              <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                              <input
                                type="text"
                                required
                                placeholder="Elena Vane"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-4">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                            <input
                              type="email"
                              required
                              placeholder="aura@lumiere.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 ml-4">Secure Password</label>
                          <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full pl-14 pr-14 py-4.5 rounded-2xl bg-stone-50 border border-stone-100 outline-none focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-900 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                          
                          {isSignUp && (
                            <div className="mt-4 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 space-y-4">
                              <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-3.5 h-3.5" /> Security Protocol
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {passwordRequirements.map((req, i) => (
                                  <div key={i} className="flex items-center gap-3 text-[10px]">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${req.met ? 'bg-emerald-500 text-white shadow-sm' : 'bg-stone-200 text-stone-400'}`}>
                                      <Check className="w-3 h-3" />
                                    </div>
                                    <span className={`tracking-wide transition-colors ${req.met ? 'text-stone-900 font-bold' : 'text-stone-400 font-light'}`}>
                                      {req.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold uppercase text-center tracking-widest">{error}</p>}

                        <button
                          type="submit"
                          className="w-full bg-stone-900 text-white py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          {isSignUp ? 'Initiate Verification' : 'Enter Maison'} <ArrowRight className="w-5 h-5" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthModal;
