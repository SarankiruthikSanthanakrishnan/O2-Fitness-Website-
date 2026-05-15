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
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent md:to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4 sm:px-6 md:px-8">
        <motion.div
          className="max-w-3xl text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Subtitle */}
          <p className="uppercase tracking-widest text-xs sm:text-sm md:text-base text-orange-400 font-medium mb-3 sm:mb-4">
            {slide.subtitle}
          </p>

          {/* Title */}
          <h1
            className="font-bold mb-4 sm:mb-6 leading-tight
                       text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            className="text-gray-200 mx-auto leading-relaxed
                       text-xs sm:text-sm md:text-lg mb-6 sm:mb-8
                       max-w-sm sm:max-w-xl md:max-w-2xl"
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <Link to={slide.buttonLink || "/shop"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white
                         text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4
                         rounded-full shadow-lg hover:shadow-orange-300/50 hover:scale-105 transition"
            >
              {slide.buttonText || "Explore Now"}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
              currentSlide === index ? "bg-orange-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
