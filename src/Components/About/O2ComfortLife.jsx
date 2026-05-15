import React, { useState, useEffect } from "react";
import Relax from "../../assets/About/O2Comfort.jpg";
import Enquiry from "../../NavFooter/Enquiry";

const O2ComfortLife = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpen = () => setPopupOpen(true);
  const handleClose = () => setPopupOpen(false);

  useEffect(() => {
    document.body.style.overflow = popupOpen ? "hidden" : "auto";
  }, [popupOpen]);

  return (
    <section className="relative w-full h-[55vh] sm:h-[40vh] md:h-screen overflow-hidden text-white">
      <img src={Relax} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-6 md:px-20 md:py-16 gap-10">
        <div className="md:w-full p-10">
          <h2 className="text-lg md:text-5xl font-bold leading-normal text-white">
            Want to experience O2 comfort in real life?
          </h2>

          <p className="md:text-xl text-sm font-normal text-gray-200 mt-2 md:leading-loose">
            Whether you're curious about how our massage chairs feel or want to find the right model for your needs, we're here
            to help. Visit one of our showrooms, or book a free demo at your location. Experience the comfort, care, and advanced
            features of O2 products — before you decide.
          </p>

          <div className="flex gap-5 mt-3 font-semibold">
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg"
              onClick={handleOpen}
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Popup */}
      {popupOpen && <Enquiry onClose={handleClose} />}
    </section>
  );
};

export default O2ComfortLife;
