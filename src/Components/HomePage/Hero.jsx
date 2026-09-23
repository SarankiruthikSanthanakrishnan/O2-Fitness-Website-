import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '/src/Components/ui/button';
import { db } from '@/firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔹 Fetch Sliders
  useEffect(() => {
    const q = query(collection(db, 'sliders'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(data);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Preload All Slide Images in Background
  useEffect(() => {
    if (slides.length > 0) {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    }
  }, [slides]);

  // 🔹 Auto-slide every 6s
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (slides.length === 0) {
    return (
      <section className="flex items-center justify-center h-[60vh] sm:h-[70vh] md:h-[90vh] bg-slate-50"></section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full bg-slate-50 overflow-hidden min-h-[70vh] flex items-center">
      {/* 🔹 Force the browser to aggressively download ALL images instantly */}
      <div className="hidden" aria-hidden="true">
        {slides.map((s) => (
          <img key={`preload-${s.id}`} src={s.image} fetchPriority="high" alt="" />
        ))}
      </div>

      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-orange-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-10 pb-24 lg:pt-12 lg:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Left Content (Text) */}
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <div className="mb-6">
                <span className="px-3 py-1.5 rounded-md bg-white border border-gray-200 text-orange-600 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                  {slide.subtitle || 'Premium Wellness'}
                </span>
              </div>

              <h1 className="text-gray-900 font-extrabold mb-6 leading-[1.15] text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                {slide.title}
              </h1>

              <p className="text-gray-600 leading-relaxed text-lg sm:text-xl max-w-xl mb-8">
                {slide.description}
              </p>

              <Link to={slide.buttonLink || '/products'}>
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-base md:text-lg px-8 py-6 rounded-md shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2 group"
                >
                  {slide.buttonText || 'Explore Collection'}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Right Content (Image) */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-2">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-auto object-cover rounded-xl"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-sm transition-all duration-300 ${
                currentSlide === index
                  ? 'w-8 bg-orange-600'
                  : 'w-4 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
