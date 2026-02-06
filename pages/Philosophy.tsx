import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Heart, Sparkles, Wind, Shield } from 'lucide-react';

const Philosophy: React.FC = () => {
  return (
    <div className="pb-32 overflow-hidden bg-[#faf9f6]">
      {/* Immersive Header */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Nature's purity - Aesthetic botanical detail"
          />
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-4xl space-y-8"
          >
            <span className="text-amber-400 font-bold uppercase tracking-[0.5em] text-xs">Our Living Ethos</span>
            <h1 className="text-6xl md:text-9xl font-serif leading-tight">The Art of <br /><span className="italic">Radiant Truth</span></h1>
            <p className="text-xl md:text-2xl text-stone-200 font-light max-w-2xl leading-relaxed">
              Lumière is not a brand; it is a philosophy of presence. We believe that true beauty is the outward reflection of inner cellular harmony.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        <div className="grid lg:grid-cols-3 gap-10">
          {[
            { 
              icon: Leaf, 
              title: "Radical Purity", 
              text: "Every ingredient is selected for its bio-identical nature. We don't use substitutes; we use the source." 
            },
            { 
              icon: Sparkles, 
              title: "Conscious Luxury", 
              text: "Luxury is the luxury of knowing exactly what touches your skin. Total transparency from seed to soul." 
            },
            { 
              icon: Shield, 
              title: "Scientific Soul", 
              text: "Clinically proven efficacy powered by the intelligence of the natural world. No compromises, only results." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-14 rounded-[4rem] shadow-2xl border border-stone-100 space-y-8 group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-serif">{item.title}</h3>
              <p className="text-stone-500 font-light leading-relaxed text-lg">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 grid lg:grid-cols-2 gap-32 items-center">
        <div className="space-y-12">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">Where Intention Meets Matter</span>
            <h2 className="text-5xl md:text-7xl font-serif">The Lumière Difference</h2>
            <p className="text-xl text-stone-600 font-light leading-relaxed">
              Mass-market beauty is often built on masks—temporary solutions that hide rather than heal. Our formulas are concentrated elixirs that speak the same language as your skin cells.
            </p>
            <div className="pt-12 space-y-10">
              <div className="flex items-start gap-8">
                <div className="w-12 h-12 rounded-full border border-amber-200 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Molecular Preservation</h4>
                  <p className="text-stone-500 font-light">Our cold-synthesis labs ensure that the "living aura" of botanical extracts remains intact for maximum bio-availability.</p>
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div className="w-12 h-12 rounded-full border border-amber-200 flex items-center justify-center shrink-0">
                  <Wind className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Atmospheric Integrity</h4>
                  <p className="text-stone-500 font-light">We formulate for the modern world—protecting your skin barrier against blue light, pollutants, and environmental stress.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="aspect-[4/5] rounded-[5rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1598440445580-0a2569c762ed?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Artisanal glass dropper - Scientific precision"
            />
          </motion.div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>
      </section>

      {/* Founder Quote */}
      <section className="bg-stone-900 py-40 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Sparkles className="absolute top-10 left-10 w-64 h-64" />
          <Sparkles className="absolute bottom-10 right-10 w-64 h-64" />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center space-y-16 relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif italic leading-tight">
            "We do not create beauty; we simply provide the light for your skin to reveal its own truth."
          </h2>
          <div className="space-y-4">
            <div className="w-32 h-px bg-amber-500 mx-auto" />
            <p className="text-amber-500 tracking-[0.5em] uppercase text-xs font-bold">The Oracle Council</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Philosophy;
