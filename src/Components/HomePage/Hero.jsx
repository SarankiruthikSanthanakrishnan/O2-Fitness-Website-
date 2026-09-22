import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "/src/Components/ui/button";
import { db } from "@/firebase/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔹 Fetch Sliders
  useEffect(() => {
    const q = query(collection(db, "sliders"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(data);
    });
    return () => unsubscribe();
  }, []);

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
      <section className="flex items-center justify-center h-[60vh] sm:h-[70vh] md:h-[90vh] bg-gray-100 text-gray-600">
        Loading slider...
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] overflow-hidden bg-gray-950">
      {/* Background Image with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slide.image})`,
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Refined Gradient Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-gray-900/20" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl text-center flex flex-col items-center">
          {/* Subtitle */}
          <motion.div
            key={`sub-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              {slide.subtitle || "Premium Wellness"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            key={`title-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white font-extrabold mb-6 leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tight"
          >
            {slide.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            key={`desc-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 mx-auto leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-8 sm:mb-10"
          >
            {slide.description}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            key={`btn-${slide.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to={slide.buttonLink || "/products"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm sm:text-base md:text-lg px-6 py-4 md:px-8 md:py-6 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-1 group"
              >
                {slide.buttonText || "Explore Collection"}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-orange-500" : "w-3 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
