import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '/src/Components/ui/button';
import { db } from '@/firebase/firebaseConfig';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  Leaf,
  Play,
  PlayCircle,
  Flower2,
  Activity,
  Smile,
  Moon,
  Bed,
  User,
  Flame,
  Wind,
  ArrowRight,
  Shield,
  ShieldCheck,
  Gem,
  Settings,
  Brain,
  Users,
  Star,
  HeadphonesIcon,
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

  // 🔹 Use 3 premium images
  const premiumImages = [
    '/premium-chair-black.png',
    '/premium-chair-silver.png',
    '/premium-chair-white.png',
  ];
  const premiumImagesMobile = [
    '/premium-chair-black-mobile.png',
    '/premium-chair-silver-mobile.png',
    '/premium-chair-white-mobile.png',
  ];
  const currentImage = premiumImages[currentSlide % premiumImages.length];
  const currentImageMobile =
    premiumImagesMobile[currentSlide % premiumImagesMobile.length];

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

  const renderFloatingElements = (isDesktop = false) => (
    <>
      {/* Handwritten Text */}
      <div
        className={`absolute z-20 transform -rotate-[10deg] ${isDesktop ? 'top-[12%] right-[10%] xl:right-[15%]' : 'top-[74%] left-4 xs:left-8'}`}
      >
        <div
          className="text-[22px] md:text-4xl lg:text-[35px] text-[#2C3E50] leading-[0.9] flex flex-col items-start"
          style={{ fontFamily: "'Courgette', cursive" }}
        >
          <span className="ml-2">Wellness</span>
          <div className="relative">
            <span>Lives Here</span>
            <svg
              className="absolute -bottom-1.5 left-2 w-[80%] h-3"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M5 8 Q 50 12 95 2"
                stroke="#F25C05"
                strokeWidth="3"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Circular Badge */}
      <div
        className={`absolute z-20 rounded-full border border-[#FFF3E8] shadow-[0_8px_30px_rgb(0,0,0,0.15)] flex flex-col items-center justify-center text-center p-1.5 md:p-2 transition-transform duration-500 hover:scale-105 bg-gradient-to-br from-[#FDF1CB] via-[#E2B76D] to-[#FDF1CB] ${isDesktop ? 'top-[22%] right-[38%] xl:right-[42%] w-32 h-32 xl:w-40 xl:h-40' : 'top-[55%] left-6 xs:left-8 w-[90px] h-[90px]'}`}
      >
        <div className="w-full h-full rounded-full border border-[#C58B35] flex flex-col items-center justify-center pt-1.5">
          <span className="text-[7px] md:text-[9px] font-serif text-[#4A3715] tracking-[0.15em] mb-0.5">
            O2 CHAIRS
          </span>
          <span className="text-[34px] md:text-5xl font-serif font-bold text-black leading-none mb-1 shadow-sm">
            Z90
          </span>
          <div className="w-8 h-[1px] bg-[#C58B35] mb-1"></div>
          <span className="text-[5px] md:text-[6px] font-bold text-[#4A3715] tracking-[0.15em] leading-[1.2]">
            PREMIUM
            <br />
            MASSAGE CHAIR
          </span>
          <div className="w-6 md:w-8 h-[2px] bg-[#F25C05] mt-1.5"></div>
        </div>
      </div>

      {/* Floating Features - Left Side of Chair */}
      <div
        className={`absolute z-20 flex-col gap-6 scale-90 md:scale-100 hidden sm:flex ${isDesktop ? 'top-[55%] right-[42%] xl:right-[46%] -translate-y-1/2' : 'top-[50%] md:top-[50%] -left-4 md:-left-8 lg:-left-12 xl:-left-8 -translate-y-1/2'}`}
      >
        <div className="flex items-center gap-3.5 hover:translate-x-1 transition-transform cursor-default">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-[0_8px_24px_rgba(180,140,110,0.3)]">
            <User className="w-[22px] h-[22px]" strokeWidth={2} />
          </div>
          <span className="text-[13px] font-semibold text-[#0B1E36] leading-tight">
            Full Body
            <br />
            <span className="font-medium text-[#465C7B]">Massage</span>
          </span>
        </div>
        <div className="flex items-center gap-3.5 hover:translate-x-1 transition-transform cursor-default">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-[0_8px_24px_rgba(180,140,110,0.3)]">
            <Flame className="w-[22px] h-[22px]" strokeWidth={2} />
          </div>
          <span className="text-[13px] font-semibold text-[#0B1E36] leading-tight">
            Heat
            <br />
            <span className="font-medium text-[#465C7B]">Therapy</span>
          </span>
        </div>
        <div className="flex items-center gap-3.5 hover:translate-x-1 transition-transform cursor-default">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shadow-[0_8px_24px_rgba(180,140,110,0.3)]">
            <Wind className="w-[22px] h-[22px]" strokeWidth={2} />
          </div>
          <span className="text-[13px] font-semibold text-[#0B1E36] leading-tight">
            Zero Gravity
            <br />
            <span className="font-medium text-[#465C7B]">Comfort</span>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <section className="relative w-full bg-[#FDFBF9] lg:bg-[#F5F6F8] overflow-hidden lg:min-h-0 block font-sans pb-4 lg:pb-0">
      {/*  Force the browser to aggressively download ALL images instantly */}
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

      {/* Mobile Full Width Background Image that dictates height */}
      <div className="relative w-full block lg:hidden z-0 pointer-events-none">
        {premiumImagesMobile.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Hero Background Mobile"
            className={`w-full h-auto transition-opacity duration-1000 ease-in-out ${
              idx === 0 ? 'relative' : 'absolute top-0 left-0'
            } ${currentImageMobile === img ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Floating Elements OVERLAY for Mobile - Anchored to Image */}
        <div className="absolute inset-0 pointer-events-auto z-20 overflow-hidden">
          {renderFloatingElements(false)}
        </div>
      </div>

      {/* Desktop Full Width Background Image that dictates height */}
      <div className="relative w-full hidden lg:block z-0 pointer-events-none">
        {premiumImages.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt="Hero Background Desktop"
            className={`w-full h-auto transition-opacity duration-1000 ease-in-out ${
              idx === 0 ? 'relative' : 'absolute top-0 left-0'
            } ${currentImage === img ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}

        {/* Floating Elements OVERLAY for Desktop - Anchored to Image */}
        <div className="absolute inset-0 pointer-events-auto z-20">
          {renderFloatingElements(true)}
        </div>

        {/* Gradient overlay to make text readable on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F6F8] via-[#F5F6F8]/80 to-transparent w-[60%] pointer-events-none"></div>
      </div>

      {/* Center Brightness Glow (reduced) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/40 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto pl-2 pr-4 sm:px-6 lg:px-8 w-full absolute inset-0 z-10 pt-6 lg:pt-0 pb-8 lg:py-0 lg:flex lg:items-center lg:justify-center">
        <div className="grid w-full h-full lg:h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-8"
              style={{ gridArea: '1 / 1' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              {/* Left Content (Text) */}
              <div className="w-[55%] xs:w-[50%] lg:w-[55%] flex flex-col items-start text-left">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-[#FFF3E8] text-[#F25C05] text-[9px] lg:text-xs font-semibold mb-1.5 lg:mb-3 whitespace-nowrap">
                  <Leaf className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 fill-[#F25C05]" />
                  {slide.subtitle ||
                    'Rejuvenate your body and mind with every session.'}
                </div>

                {/* Title */}
                <h1 className="text-[#1A1A1A] font-bold mb-1.5 lg:mb-3 leading-[1.1] text-2xl sm:text-3xl max-w-[85%] lg:text-[56px] text-left xl:text-[64px] tracking-tight">
                  {renderTitle(slide.title) ||
                    'Discover Luxury & Wellness with O2 Massage Chairs'}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-justify leading-[1.4] text-[11px] xs:text-[12px] lg:text-sm xl:text-base max-w-[80%] mb-3  font-normal font-['Inter',sans-serif]">
                  {slide.description ||
                    "At O2 Fitness Healthcare, we bring the spa experience to your home with premium massage chairs. Whether you're easing pain or reducing stress — we've got your back."}
                </p>

                {/* Buttons */}
                <div className="flex flex-nowrap items-center gap-1.5 lg:gap-4 mb-3 lg:mb-5 order-3 lg:order-none w-[calc(100%+20px)] sm:w-auto">
                  <Link to={`/${slide.buttonLink || 'products'}`}>
                    <Button className="bg-[#F25C05] hover:bg-[#D95000] text-white text-[9px] xs:text-[10px] lg:text-sm font-semibold px-2 py-1.5 lg:px-5 lg:py-4 rounded-md lg:rounded-lg shadow-lg shadow-[#F25C05]/20 transition-all hover:-translate-y-0.5 flex items-center gap-1">
                      {slide.buttonText || 'Explore Collection'}
                      <ArrowRight className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent text-[#1A1A1A] hover:text-[#F25C05] border-none text-[9px] xs:text-[10px] lg:text-sm font-bold px-1 py-1 lg:px-5 lg:py-4 shadow-none transition-all hover:-translate-y-0.5 flex items-center gap-1 shrink-0"
                  >
                    <PlayCircle className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-current" />
                    <span>Watch Video</span>
                  </Button>
                </div>

                {/* Feature Badges (Mobile Grid & Desktop Flex) */}
                <div className="w-full order-2 lg:order-none mt-1 lg:mt-20 mb-3 lg:mb-6">
                  {/* Desktop Version */}
                  <div className="hidden lg:flex flex-wrap items-center gap-y-4 gap-x-4 xl:gap-x-6 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                        <Flower2 className="w-4 h-4 text-[#F25C05]" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 leading-tight">
                        Better
                        <br />
                        Relaxation
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden xl:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                        <Activity className="w-4 h-4 text-[#F25C05]" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 leading-tight">
                        Relieves
                        <br />
                        Muscle Pain
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden xl:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                        <Smile className="w-4 h-4 text-[#F25C05]" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 leading-tight">
                        Improves
                        <br />
                        Mental Health
                      </span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden xl:block"></div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFF3E8] flex items-center justify-center">
                        <Bed className="w-4 h-4 text-[#F25C05]" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-800 leading-tight">
                        Enhances
                        <br />
                        Sleep Quality
                      </span>
                    </div>
                  </div>

                  {/* Mobile Version (Grid exactly like screenshot) */}
                  <div className="grid grid-cols-4 gap-1 lg:hidden w-[calc(100%+16px)] -ml-2 text-center">
                    <div className="flex flex-col items-center gap-1 px-0.5">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full border border-[#F25C05]/30 bg-transparent flex items-center justify-center mb-1">
                        <Flower2 className="w-3 h-3 text-[#F25C05]" />
                      </div>
                      <span className="text-[6.5px] xs:text-[7px] font-semibold text-gray-800 leading-tight">
                        Full Body
                        <br />
                        Massage
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-0.5 border-l border-gray-200/60">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full border border-[#F25C05]/30 bg-transparent flex items-center justify-center mb-1">
                        <Flame className="w-3 h-3 text-[#F25C05]" />
                      </div>
                      <span className="text-[6.5px] xs:text-[7px] font-semibold text-gray-800 leading-tight">
                        Heat
                        <br />
                        Therapy
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-0.5 border-l border-gray-200/60">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full border border-[#F25C05]/30 bg-transparent flex items-center justify-center mb-1">
                        <User className="w-3 h-3 text-[#F25C05]" />
                      </div>
                      <span className="text-[6.5px] xs:text-[7px] font-semibold text-gray-800 leading-tight">
                        Zero Gravity
                        <br />
                        Comfort
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-0.5 border-l border-gray-200/60">
                      <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full border border-[#F25C05]/30 bg-transparent flex items-center justify-center mb-1">
                        <Bed className="w-3 h-3 text-[#F25C05]" />
                      </div>
                      <span className="text-[6.5px] xs:text-[7px] font-semibold text-gray-800 leading-tight">
                        Better
                        <br />
                        Sleep
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row (Desktop Only - inside text content flow) */}
                <div className="hidden lg:flex relative bg-transparent rounded-none p-0 items-center justify-start gap-6 xl:gap-8 w-full max-w-3xl pt-6 border-t border-gray-200/80 shadow-none z-30">
                  <div className="flex flex-col items-center lg:items-start flex-1 text-center lg:text-left">
                    <Users className="w-5 h-5 text-[#2B3B4E] mb-1 lg:hidden" />
                    <div className="text-[15px] sm:text-lg lg:text-[22px] font-bold text-gray-900 mb-0.5">
                      500+
                    </div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-semibold lg:font-medium leading-tight">
                      Happy
                      <br className="lg:hidden" /> Customers
                    </div>
                  </div>
                  <div className="w-px h-8 lg:h-10 bg-gray-200/80"></div>
                  <div className="flex flex-col items-center lg:items-start flex-1 text-center lg:text-left">
                    <Star className="w-5 h-5 text-[#2B3B4E] mb-1 lg:hidden" />
                    <div className="text-[15px] sm:text-lg lg:text-[22px] font-bold text-gray-900 mb-0.5">
                      10+
                    </div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-semibold lg:font-medium leading-tight">
                      Premium
                      <br className="lg:hidden" /> Models
                    </div>
                  </div>
                  <div className="w-px h-8 lg:h-10 bg-gray-200/80"></div>
                  <div className="flex flex-col items-center lg:items-start flex-1 text-center lg:text-left">
                    <ShieldCheck className="w-5 h-5 text-[#2B3B4E] mb-1 lg:hidden" />
                    <div className="text-[15px] sm:text-lg lg:text-[22px] font-bold text-gray-900 mb-0.5">
                      5+
                    </div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-semibold lg:font-medium leading-tight">
                      Years of
                      <br className="lg:hidden" /> Trust
                    </div>
                  </div>
                  <div className="w-px h-8 lg:h-10 bg-gray-200/80"></div>
                  <div className="flex flex-col items-center lg:items-start flex-1 text-center lg:text-left">
                    <HeadphonesIcon className="w-5 h-5 text-[#2B3B4E] mb-1 lg:hidden" />
                    <div className="text-[15px] sm:text-lg lg:text-[22px] font-bold text-gray-900 mb-0.5">
                      24/7
                    </div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] text-gray-500 font-semibold lg:font-medium leading-tight">
                      Customer
                      <br className="lg:hidden" /> Support
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content (Desktop Only - maintains balanced flex layout) */}
              <div className="hidden lg:block w-[45%] relative mt-6 lg:mt-0">
                <div className="w-full h-[400px] xl:h-[450px]"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats Row (Mobile Only - floating card at the very bottom) */}
        <div className="flex lg:hidden absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 items-center justify-between w-[calc(100%-32px)] sm:w-[calc(100%-48px)] mx-auto border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-30">
          <div className="flex flex-col items-center flex-1 text-center">
            <Users className="w-5 h-5 text-[#2B3B4E] mb-1" />
            <div className="text-[15px] sm:text-lg font-bold text-gray-900 mb-0.5">
              500+
            </div>
            <div className="text-[8px] sm:text-[9px] text-gray-500 font-semibold leading-tight">
              Happy
              <br /> Customers
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200/80"></div>
          <div className="flex flex-col items-center flex-1 text-center">
            <Star className="w-5 h-5 text-[#2B3B4E] mb-1" />
            <div className="text-[15px] sm:text-lg font-bold text-gray-900 mb-0.5">
              10+
            </div>
            <div className="text-[8px] sm:text-[9px] text-gray-500 font-semibold leading-tight">
              Premium
              <br /> Models
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200/80"></div>
          <div className="flex flex-col items-center flex-1 text-center">
            <ShieldCheck className="w-5 h-5 text-[#2B3B4E] mb-1" />
            <div className="text-[15px] sm:text-lg font-bold text-gray-900 mb-0.5">
              5+
            </div>
            <div className="text-[8px] sm:text-[9px] text-gray-500 font-semibold leading-tight">
              Years of
              <br /> Trust
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200/80"></div>
          <div className="flex flex-col items-center flex-1 text-center">
            <HeadphonesIcon className="w-5 h-5 text-[#2B3B4E] mb-1" />
            <div className="text-[15px] sm:text-lg font-bold text-gray-900 mb-0.5">
              24/7
            </div>
            <div className="text-[8px] sm:text-[9px] text-gray-500 font-semibold leading-tight">
              Customer
              <br /> Support
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="hidden lg:flex absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2 z-20">
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
