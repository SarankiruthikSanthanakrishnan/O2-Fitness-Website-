import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { ChevronRight } from "lucide-react"; // Optional: Custom arrow icon
import Say1 from "/src/assets/About/CusSay1.jpg";
import Say2 from "/src/assets/About/CusSay2.jpg";
import Say3 from "/src/assets/About/CusSay2.jpg";

const testimonials = [
  {
    name: "Aarthi V., Chennai",
    review:
      "The O2 massage chair has become part of my daily routine. It helps me relax after long hours at work and has improved my back pain tremendously!",
    image: Say1,
    rating: 5,
  },
  {
    name: "Kumar M., Chennai",
    review:
      "Excellent service and high-quality product. The leg massager works wonders after my evening walk!",
    image: Say2,
    rating: 4,
  },
  {
    name: "VJ, Chennai",
    review:
      "Excellent service and high-quality product. The leg massager works wonders after my evening walk!",
    image: Say3,
    rating: 4,
  },
];

const CustomerSay = () => {
  return (
    <section className="py-12 px-4 sm:px-6 md:px-16 bg-white">
      {/* Section Heading */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900  md:text-left text-center">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 mt-2 leading-loose md:text-lg text-sm">
          At O2 Fitness Healthcare, customer satisfaction is at the heart of
          everything we do. From product quality to service support, we’re proud
          to have earned the trust of thousands across India. Here’s what a few
          of our happy customers have to say about their experience with us.
        </p>
      </div>

      {/* Testimonial Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{ nextEl: ".next-arrow" }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          speed={800}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="p-[1px] rounded-xl bg-gradient-to-r from-orange-400 to-blue-500 h-full">
                <div className="bg-white rounded-xl p-6 h-full flex flex-col min-h-[180px]">
                  {/* Quote Section */}
                  <p className="text-gray-800 italic text-sm md:text-base leading-relaxed flex-1">
                    <span className="text-2xl font-bold text-slate-700">“</span>
                    {t.review}
                    <span className="text-2xl font-bold text-slate-700">”</span>
                  </p>

                  {/* User Section */}
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <div className="flex text-orange-500 text-xs mt-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Right Arrow */}
        <div className="next-arrow absolute top-1/2 right-2 transform -translate-y-1/2 bg-white border shadow p-2 rounded-full cursor-pointer z-10">
          <ChevronRight className="text-gray-700 w-5 h-5" />
        </div>
      </div>
    </section>
  );
};

export default CustomerSay;
