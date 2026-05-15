import React from "react";
import Banner from "../../assets/About/AboutBanner.png";

const About02Fit = () => {
  return (
    <section className="relative w-full h-[45vh] sm:h-[40vh] md:h-screen overflow-hidden text-white">
      <img src={Banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />

      {/* Overlay 
      <div className="absolute inset-0 bg-black/0 z-20"></div> */}

      {/* Centered Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
        <div className="bg-white/30 md:backdrop-blur-md rounded-2xl text-sm text-white shadow-xl w-[95%] max-w-3xl p-6 sm:p-10 overflow-y-auto max-h-[90vh]">
  <h1 className="text-lg md:text-2xl font-bold text-orange-500 mb-4 text-center">
    About O2 Fitness Healthcare
  </h1>
  <p className="md:text-xl text-md font-semibold mb-3 text-center">
    Delivering wellness, innovation, and trust through smart massage
    technology — across every corner of India
  </p>
  <p className="text-xs md:text-base leading-relaxed text-center">
    O2 Fitness Healthcare was started with one goal — to make daily wellness
    easy and affordable for everyone. We offer smart massage chairs and
    fitness products that help reduce stress, relieve pain, and improve
    comfort. With trusted service, quality products, and free delivery across
    India, we’re here to bring relaxation and care into everyday life.
  </p>
</div>
      </div>
    </section>
  );
};

export default About02Fit;
