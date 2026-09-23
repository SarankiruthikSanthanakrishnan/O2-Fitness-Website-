import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '/src/Components/ui/button';
import { db } from '@/firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  Leaf,
  Play,
  Flower2,
  Activity,
  Smile,
  Moon,
  User,
  Flame,
  Wind,
  ArrowRight,
} from 'lucide-react';

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
      <section className="flex items-center justify-center h-[60vh] sm:h-[70vh] md:h-[90vh] bg-[#FDFBF9]"></section>
    );
  }

  const slide = slides[currentSlide];

  // Function to highlight "O2" in orange
  const renderTitle = (title) => {
    if (!title) return null;
    const parts = title.split(/(O2)/gi);
    return parts.map((part, i) =>
      part.toUpperCase() === 'O2' ? (
        <span key={i} className="text-[#F25C05]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="relative w-full bg-[#F5F6F8] overflow-hidden min-h-[90vh] flex items-center font-sans pt-20 lg:pt-0">
      {/* 🔹 Force the browser to aggressively download ALL images instantly */}
      <div className="hidden" aria-hidden="true">
        {slides.map((s) => (
          <img
            key={`preload-${s.id}`}
            src={s.image}
            fetchPriority="high"
            alt=""
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Left Content (Text) */}
            <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF3E8] text-[#F25C05] text-sm font-medium mb-6">
                <Leaf className="w-4 h-4 fill-[#F25C05]" />
                {slide.subtitle ||
                  'Rejuvenate your body and mind with every session.'}
              </div>

              {/* Title */}
              <h1 className="text-[#1A1A1A] font-semibold mb-6 leading-[1.1] text-5xl sm:text-6xl lg:text-[72px] tracking-tight">
                {renderTitle(slide.title)}
              </h1>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-lg sm:text-xl max-w-2xl mb-10 text-justify font-light font-['Inter',sans-serif]">
                {slide.description ||
                  "At O2 Fitness Healthcare, we bring the spa experience to your home with premium massage chairs. Whether you're easing pain or reducing stress — we've got your back."}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link to={`/${slide.buttonLink || '/products'}`}>
                  <Button
                    size="lg"
                    className="bg-[#F25C05] hover:bg-[#D95000] text-white text-base font-semibold px-8 py-7 rounded-lg shadow-lg shadow-[#F25C05]/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 group"
                  >
                    {slide.buttonText || 'Explore Products'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* 4 Feature Badges */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#F25C05]">
                    <Flower2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    Better
                    <br />
                    <span className="font-normal text-gray-500">
                      Relaxation
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#F25C05]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    Relieves
                    <br />
                    <span className="font-normal text-gray-500">
                      Muscle Pain
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#F25C05]">
                    <Smile className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    Improves
                    <br />
                    <span className="font-normal text-gray-500">
                      Mental Health
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#F25C05]">
                    <Moon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    Enhances
                    <br />
                    <span className="font-normal text-gray-500">
                      Sleep Quality
                    </span>
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200 w-full">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    500+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Happy Customers
                  </div>
                </div>
                <div className="border-l pl-8 border-gray-200 hidden md:block">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    10+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Premium Models
                  </div>
                </div>
                <div className="md:hidden">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    10+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Premium Models
                  </div>
                </div>
                <div className="border-l md:pl-8 border-gray-200 pl-8 md:border-none border-l-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    5+
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Years of Trust
                  </div>
                </div>
                <div className="border-l pl-8 border-gray-200">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    24/7
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    Customer Support
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content (Image & Floating Elements) */}
            <div className="w-full lg:w-[45%] relative mt-10 lg:mt-0">
              <div className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                  {/* Arch background */}
                  <div className="absolute w-[80%] h-full bg-[#FFFFFF] rounded-t-[300px] bottom-0 z-0 shadow-sm border border-gray-100"></div>
                </div>

                {/* Main Image on a subtle pedestal/shadow */}
                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto object-contain max-h-[550px] scale-110 md:scale-125 origin-bottom"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
                      maskImage:
                        'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
                    }}
                  />
                </div>

                {/* Handwritten Text - Top Right */}
                <div className="absolute top-0 -right-4 md:-right-8 z-20 transform -rotate-6">
                  <span
                    className="text-3xl md:text-4xl text-gray-800 leading-tight block"
                    style={{
                      fontFamily: "'Caveat', 'Dancing Script', cursive, serif",
                      fontStyle: 'italic',
                    }}
                  >
                    A Healthier
                    <br />
                    <span className="text-[#F25C05]">Happier You</span>
                  </span>
                </div>

                {/* Circular Badge - Top Left */}
                <div className="absolute top-8 left-0 md:-left-12 z-20 w-36 h-36 bg-[#FDFBF9] rounded-full border-4 border-[#EEDFCE] shadow-xl flex flex-col items-center justify-center text-center p-2 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                  <span className="text-[11px] font-bold text-gray-600 tracking-[0.15em] mb-1">
                    O2 FITNESS
                  </span>
                  <span className="text-4xl font-serif text-gray-900 leading-none mb-1">
                    Z90
                  </span>
                  <div className="w-10 h-[2px] bg-[#F25C05] my-1.5"></div>
                  <span className="text-[9px] font-bold text-[#F25C05] tracking-widest leading-tight">
                    PREMIUM
                    <br />
                    MASSAGE CHAIR
                  </span>
                </div>

                {/* Floating Feature Badges - Left Side */}
                <div className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/3 flex flex-col gap-4 z-20">
                  <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md pr-5 p-2 rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-default">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Full Body
                      <br />
                      <span className="font-medium text-gray-500">Massage</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md pr-5 p-2 rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-default translate-x-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                      <Flame className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Heat
                      <br />
                      <span className="font-medium text-gray-500">Therapy</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md pr-5 p-2 rounded-full shadow-lg border border-gray-100 hover:scale-105 transition-transform cursor-default">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shadow-sm">
                      <Wind className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Zero Gravity
                      <br />
                      <span className="font-medium text-gray-500">Comfort</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-10 bg-[#F25C05]'
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
