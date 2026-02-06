
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ThreeDShowcaseProps {
  image: string;
  name: string;
}

const ThreeDShowcase: React.FC<ThreeDShowcaseProps> = ({ image, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for X and Y rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Parallax shifts for internal layers
  const bottleX = useTransform(mouseX, [-0.5, 0.5], [15, -15]);
  const bottleY = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["-50%", "50%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] perspective-container cursor-none flex items-center justify-center group"
      style={{ perspective: "1500px" }}
    >
      {/* Background Aura Layer */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-white/10 blur-3xl rounded-full"
        style={{
          x: useTransform(mouseX, [-0.5, 0.5], [30, -30]),
          y: useTransform(mouseY, [-0.5, 0.5], [30, -30]),
          scale: 0.8
        }}
      />

      {/* Main 3D Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-[85%] h-[85%] rounded-[4rem] bg-white/20 backdrop-blur-sm border border-white/40 shadow-2xl overflow-hidden"
      >
        {/* Subtle Dynamic Shine Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-20 pointer-events-none"
          style={{ x: shineX, skewX: -20 }}
        />

        {/* Product Image Layer (Middle Plane) */}
        <motion.div 
          className="absolute inset-0 z-10 p-12"
          style={{
            x: bottleX,
            y: bottleY,
            transformZ: "50px"
          }}
        >
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
          />
        </motion.div>

        {/* Floating Text Layer (Top Plane) */}
        <motion.div 
          className="absolute bottom-12 left-0 right-0 text-center z-30"
          style={{ transformZ: "100px" }}
        >
          <h4 className="text-stone-900 font-serif text-3xl italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {name}
          </h4>
        </motion.div>
      </motion.div>

      {/* 3D Dynamic Shadow (Bottom Plane) */}
      <motion.div 
        className="absolute -bottom-10 w-1/2 h-8 bg-black/10 blur-xl rounded-[100%]"
        style={{
          rotateX: "80deg",
          x: useTransform(mouseX, [-0.5, 0.5], [-20, 20]),
          opacity: useTransform(mouseY, [-0.5, 0.5], [0.1, 0.3]),
          scale: useTransform(mouseY, [-0.5, 0.5], [1, 1.2])
        }}
      />
    </div>
  );
};

export default ThreeDShowcase;
