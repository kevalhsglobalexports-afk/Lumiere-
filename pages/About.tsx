
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Heart, Sparkles, Wind } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pb-32 overflow-hidden">
      {/* Immersive Header */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Wellness atmosphere"
          />
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-3xl space-y-8"
          >
            <span className="text-amber-400 font-bold uppercase tracking-[0.4em] text-xs">Our Heritage</span>
            <h1 className="text-6xl md:text-8xl font-serif leading-tight">The Art of <br /><span className="italic">Botanical Care</span></h1>
            <p className="text-xl text-stone-200 font-light max-w-2xl leading-relaxed">
              We started as a small apothecary in the heart of Provence, guided by a singular vision: 
              To capture the purest essence of nature and bottle it with scientific precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Leaf, 
              title: "Ethically Sourced", 
              text: "We partner directly with organic farmers who treat the soil with the same respect we treat your skin." 
            },
            { 
              icon: Droplets, 
              title: "Molecular Purity", 
              text: "Our extraction methods use cold-press technology to ensure every nutrient remains alive and active." 
            },
            { 
              icon: Heart, 
              title: "Conscious Luxury", 
              text: "Luxury shouldn't cost the earth. Every element of our packaging is 100% recyclable and plastic-neutral." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100 space-y-6"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif">{item.title}</h3>
              <p className="text-stone-500 font-light leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">Where Science Meets Soul</span>
            <h2 className="text-5xl font-serif mt-4">The Lumière Difference</h2>
            <p className="text-lg text-stone-600 font-light leading-relaxed mt-6">
              Unlike mass-market brands, we don't use fillers or synthetic fragrances. 
              Our formulas are concentrated elixirs. Every drop of our Hair Oil, every pump 
              of our Serum, is a result of years of clinical research and artisanal patience.
            </p>
            <div className="pt-10 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <p className="font-medium text-stone-800">Dermatologist Tested & Approved</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-amber-600" />
                </div>
                <p className="font-medium text-stone-800">100% Carbon Neutral Operations</p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover"
              alt="Artisanal process"
            />
          </motion.div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="bg-stone-50 py-32">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <h2 className="text-5xl font-serif italic">"Beauty is not a mask you wear, it's the radiance you cultivate."</h2>
          <div className="w-24 h-px bg-amber-300 mx-auto" />
          <p className="text-stone-500 tracking-[0.3em] uppercase text-xs font-bold">Founder - Dr. Elena Vane</p>
        </div>
      </section>
    </div>
  );
};

export default About;
