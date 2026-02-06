
import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Star, Quote, X, Play, 
  Droplets, Beaker, Sprout, Loader2
} from 'lucide-react';
import { PRODUCTS } from '../constants';
import { dbService } from '../services/db';
import { RitualVideo, BrandSettings } from '../types';
import Bottle3D from '../components/Bottle3D';

const RevealOnScroll: React.FC<{ children: React.ReactNode, delay?: number, is3D?: boolean }> = ({ children, delay = 0, is3D = false }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: is3D ? 20 : 0 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: is3D ? 20 : 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      style={{ perspective: is3D ? "1000px" : "none" }}
    >
      {children}
    </motion.div>
  );
};

interface HomeProps {
  user: { name: string; email: string; isAdmin?: boolean } | null;
  formatPrice: (usdPrice: number) => string;
}

const Home: React.FC<HomeProps> = ({ user, formatPrice }) => {
  const featured = PRODUCTS.slice(0, 3);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [ritualVideo, setRitualVideo] = useState<RitualVideo>(dbService.getRitualVideo());
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(dbService.getBrandSettings());
  
  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  useEffect(() => {
    setRitualVideo(dbService.getRitualVideo());
    setBrandSettings(dbService.getBrandSettings());
  }, []);

  return (
    <div className="space-y-32 pb-32 overflow-hidden bg-[#faf9f6]">
      {/* 1. HERO SECTION - With Responsive 3D Product Object */}
      <section className="relative min-h-screen lg:h-[110vh] flex items-center overflow-hidden bg-stone-50 pt-20 lg:pt-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-100 to-white" />
          <motion.div 
            style={{ opacity: opacityHero }}
            className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-[120px]"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 items-center gap-8 lg:gap-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10 order-2 lg:order-1 text-center lg:text-left"
          >
            <div className="space-y-4">
              {user && (
                <span className="inline-block text-amber-600 font-bold uppercase tracking-[0.5em] text-[10px]">
                  Welcome back, {user.name.split(' ')[0]}
                </span>
              )}
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-stone-900 leading-[1.1] tracking-tighter">
                {brandSettings.heroTitle.split(' ').slice(0, 2).join(' ')} <br />
                <span className="italic text-amber-600/90 font-light">
                  {brandSettings.heroTitle.split(' ').slice(2).join(' ')}
                </span>
              </h1>
              <p className="text-stone-500 text-base md:text-lg lg:text-xl font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {brandSettings.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
              <Link to="/shop" className="bg-stone-900 text-white px-10 lg:px-14 py-5 lg:py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 hover:scale-105 transition-all flex items-center gap-3 group w-full sm:w-auto">
                Explore Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => setIsVideoOpen(true)} className="text-stone-900 font-semibold flex items-center gap-3 hover:text-amber-600 transition-colors py-4 px-6 group">
                <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full border border-stone-200 flex items-center justify-center bg-white group-hover:bg-amber-50 transition-all shadow-sm">
                  <Play className="w-4 h-4 fill-stone-900 group-hover:fill-amber-600" />
                </div>
                The Ritual Film
              </button>
            </div>
          </motion.div>

          {/* Interactive 3D Product Mesh - Now Visible on All Screen Sizes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[700px] w-full"
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-amber-300 animate-spin" />
              </div>
            }>
              <Bottle3D />
            </Suspense>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-stone-300 text-[10px] font-bold uppercase tracking-[0.8em] hidden lg:block"
        >
          Scroll to Reveal
        </motion.div>
      </section>

      {/* 2. THE GENESIS SECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <RevealOnScroll>
            <div className="space-y-10">
              <span className="text-amber-600 font-bold uppercase tracking-[0.4em] text-xs">Our Heritage</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-tight">Science Meets <span className="italic">Soul</span>.</h2>
              <div className="space-y-6">
                <p className="text-lg text-stone-600 font-light leading-relaxed max-w-lg">
                  Born from a lineage of Provencal herbalists and refined by modern molecular biologists, Lumière is a testament to the power of nature's intelligence.
                </p>
                <p className="text-stone-500 font-light leading-relaxed max-w-md">
                  We don't just extract botanicals; we listen to them. Using cold-press synthesis, we ensure medical-grade efficacy without sacrificing organic purity.
                </p>
              </div>
            </div>
          </RevealOnScroll>
          <div className="relative">
            <RevealOnScroll delay={0.2}>
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1590156221170-cc551ef8f0c5?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  alt="Lumière Essence Dropper" 
                />
              </div>
            </RevealOnScroll>
            <div className="absolute -top-12 -right-12 w-72 h-72 bg-amber-100 rounded-full -z-0 blur-3xl opacity-40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE RITUALS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <RevealOnScroll>
            <div className="space-y-4 text-left">
              <span className="text-stone-400 font-bold uppercase tracking-[0.4em] text-xs">The Apothecary</span>
              <h2 className="text-5xl md:text-7xl font-serif">Signature Rituals</h2>
            </div>
          </RevealOnScroll>
          <Link to="/shop" className="text-stone-900 font-bold uppercase tracking-widest text-xs px-10 py-4 rounded-full border border-stone-200 hover:bg-stone-900 hover:text-white transition-all shadow-sm">
            Discover All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featured.map((product, idx) => (
            <RevealOnScroll key={product.id} delay={idx * 0.1}>
              <Link to={`/product/${product.id}`} className="group block bg-white p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 border border-stone-50">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-10 bg-stone-50">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={product.name} />
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-serif text-stone-900 group-hover:text-amber-700 transition-colors">{product.name}</h3>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <span className="text-2xl font-light text-stone-900">{formatPrice(product.price)}</span>
                    <div className="w-14 h-14 bg-stone-900 rounded-full flex items-center justify-center text-white group-hover:bg-amber-600 transition-all shadow-lg">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* 4. MOLECULAR PRECISION */}
      <section className="bg-stone-900 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <RevealOnScroll>
            <span className="text-amber-500 font-bold uppercase tracking-[0.5em] text-xs">Botanical Mastery</span>
            <h2 className="text-5xl md:text-7xl font-serif text-white mt-4 mb-24">Molecular Precision</h2>
          </RevealOnScroll>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Beaker, title: "Lab Verified", text: "Every batch undergoes clinical testing for purity and potency." },
              { icon: Sprout, title: "Living Actives", text: "Ingredients harvested at the peak of their seasonal aura." },
              { icon: Droplets, title: "Hy-Purity™ Base", text: "Using structured volcanic water for deeper absorption." }
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div className="space-y-6 group">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-amber-500 transition-all">
                    <item.icon className="w-10 h-10 text-amber-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif text-white">{item.title}</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed px-6">{item.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-4xl mx-auto px-4 text-center py-20">
        <RevealOnScroll>
          <div className="space-y-16">
            <Quote className="w-20 h-20 text-amber-100 mx-auto opacity-50" />
            <h3 className="text-4xl md:text-5xl font-serif italic leading-tight text-stone-800">
              "Lumière has completely redefined my morning routine. It's no longer just skincare; it's a moment of connection with my inner radiance."
            </h3>
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-2xl scale-110">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" alt="Aura Vance" />
              </div>
              <div>
                <p className="font-bold text-stone-900 uppercase tracking-[0.4em] text-[10px]">Aura Vance</p>
                <p className="text-stone-400 text-[10px] font-medium tracking-widest mt-1">Member since 2021</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. JOIN THE CIRCLE */}
      <section className="max-w-7xl mx-auto px-4">
        <RevealOnScroll>
          <div className="bg-stone-50 rounded-[5rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden group border border-stone-100">
             <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12">
                <Sparkles className="w-64 h-64 text-amber-900" />
             </div>
             <div className="space-y-6 relative z-10">
               <h2 className="text-5xl md:text-8xl font-serif tracking-tighter">Join The Circle</h2>
               <p className="text-stone-600 max-w-lg mx-auto font-light leading-relaxed text-lg">
                 Enter your sanctuary address to receive seasonal guides and early access.
               </p>
             </div>
             <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
               <input 
                 type="email" 
                 placeholder="aura@lumiere.essence" 
                 className="flex-1 px-10 py-6 rounded-full border border-stone-200 outline-none focus:ring-4 focus:ring-amber-200/50 transition-all bg-white text-stone-900 shadow-sm" 
               />
               <button className="bg-stone-900 text-white px-12 py-6 rounded-full font-bold shadow-2xl hover:bg-amber-600 transition-all active:scale-95">
                 Join Ritual
               </button>
             </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVideoOpen(false)} className="absolute inset-0 bg-stone-900/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl aspect-video bg-black rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/10 group">
              <button onClick={() => setIsVideoOpen(false)} className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20">
                <X className="w-6 h-6" />
              </button>
              <iframe 
                className="w-full h-full"
                src={ritualVideo.url}
                title={ritualVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
