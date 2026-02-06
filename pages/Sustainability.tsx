
import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, TreePine, Wind, ShieldCheck, Sun, Heart } from 'lucide-react';

const Sustainability: React.FC = () => {
  return (
    <div className="pb-32 overflow-hidden">
      <section className="relative h-[60vh] flex items-center justify-center bg-stone-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Mountains and trees"
        />
        <div className="relative text-center space-y-6 px-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-stone-600 font-bold uppercase tracking-[0.4em] text-xs"
          >
            Future Forward
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-serif"
          >
            Pure <span className="italic">Promise</span>
          </motion.h1>
          <p className="text-stone-700 font-light max-w-lg mx-auto leading-relaxed">
            Our commitment to the Earth is as deep as our commitment to your radiance. 
            Luxury that regenerates rather than depletes.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-32 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
          { icon: Recycle, title: "Circular Design", text: "Every Lumière bottle is made from 100% PCR (Post-Consumer Recycled) glass and aluminum. No new plastic enters our supply chain." },
          { icon: TreePine, title: "Regenerative Sourcing", text: "We work with biodynamic farms that focus on soil health and biodiversity. For every harvest, we plant three new saplings." },
          { icon: Wind, title: "Carbon Negative", text: "Our operations are powered by wind and solar. We offset 120% of our carbon footprint through accredited ocean cleanup projects." },
          { icon: Sun, title: "Clean Alchemy", text: "Zero synthetics, zero microplastics. Our formulas are 100% biodegradable, ensuring that what washes off into the ocean is harmless." },
          { icon: ShieldCheck, title: "Vegan Certified", text: "Cruelty-free since day one. We never test on animals, and we only partner with suppliers who share this ethical core." },
          { icon: Heart, title: "Social Impact", text: "5% of every purchase goes to the Global Water Initiative, providing clean water rituals to communities in need." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[3rem] bg-white border border-stone-100 hover:shadow-xl transition-all space-y-6"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif">{item.title}</h3>
            <p className="text-stone-500 font-light leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-stone-900 text-white rounded-[4rem] p-12 md:p-24 text-center space-y-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full scale-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full scale-125" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif">Our 2030 Vision</h2>
          <p className="text-stone-400 font-light max-w-2xl mx-auto text-lg leading-relaxed">
            By 2030, Lumière Essence will be a fully closed-loop ecosystem. 
            From lab-grown botanical alternatives to waterless manufacturing, 
            we are redefining what it means to be a beauty brand in the 21st century.
          </p>
          <button className="bg-white text-stone-900 px-10 py-5 rounded-full font-bold hover:bg-stone-200 transition-all">
            Read The Full Report
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;
