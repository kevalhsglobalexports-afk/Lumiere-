
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Lock } from 'lucide-react';
import { dbService } from '../services/db';
import { Inquiry } from '../types';
import { motion } from 'framer-motion';

interface ContactProps {
  user: { name: string; email: string; isAdmin?: boolean } | null;
}

const Contact: React.FC<ContactProps> = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      ...formData,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'new'
    };

    dbService.addInquiry(newInquiry);
    setSubmitted(true);
    setFormData({ ...formData, message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl font-serif mb-6">Let's Connect</h1>
            <p className="text-stone-500 text-lg font-light leading-relaxed">
              Whether you have a question about our products, want skin advice, or just want to say hello—we're here for you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Email Us</h4>
                <p className="text-stone-500 font-light">concierge@lumiere.essence</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Call Us</h4>
                <p className="text-stone-500 font-light">+1 (888) LUMIÈRE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-stone-100 relative overflow-hidden">
          {!user ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 bg-stone-50/50 rounded-[2.5rem]"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif">Maison Entrance Required</h3>
              <p className="text-stone-500 font-light max-w-xs mx-auto">
                To ensure a personal and secure conversation, please login to your Maison account before sending a message.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-amber-600 transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          ) : submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif">Message Sent!</h3>
              <p className="text-stone-500 font-light">Our beauty concierge will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 pl-2">Name</label>
                  <input 
                    type="text" 
                    disabled
                    value={formData.name}
                    className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 pl-2">Email</label>
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 pl-2">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all appearance-none cursor-pointer"
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Press & Media</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 pl-2">Message</label>
                <textarea 
                  rows={5} 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
