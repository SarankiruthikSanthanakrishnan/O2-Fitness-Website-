import React, { useState } from "react";
import Refresh from "../../assets/Products/Referesh.jpg";
import Enquiry from "../../NavFooter/Enquiry";

const RefreshMind = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const handleOpen = () => setPopupOpen(true);
  const handleClose = () => setPopupOpen(false);

  return (
    <section className="relative w-full min-h-screen text-white overflow-hidden">
      <img
        src={Refresh}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      {/* Gray overlay */}
      <div className="absolute inset-0 bg-black/20 bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-6 md:px-20 py-16 gap-10">
        {/* Left Text */}
        <div className="md:w-full">
          <h2 className="text-4xl md:text-5xl font-bold leading-normal text-black">
            Revive Your Body, <br />
            Refresh Your Mind
          </h2>

          <div className="md:w-1/2">
            <p className="text-xl font-normal text-gray-200 mt-5 leading-loose">
              Experience the ultimate in wellness with our expertly designed
              massage and fitness products. Comfort, care, and
              recovery—at your fingertips.
            </p>

            <div className="flex gap-5 mt-3 font-semibold">
              <button
                onClick={handleOpen}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Popup */}
      {popupOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="rounded-xl shadow-2xl max-w-xl w-full p-6 relative">
            <Enquiry onClose={handleClose} />
          </div>
        </div>
      )}
    </section>
  );
};

export default RefreshMind;
