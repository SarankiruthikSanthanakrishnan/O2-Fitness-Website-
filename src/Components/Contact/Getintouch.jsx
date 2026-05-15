import React, { useState, useEffect } from "react";
import Relax from "../../assets/ConatctImg/GetIn.jpg";
import Enquiry from "../../NavFooter/Enquiry"; // Make sure the path is correct

const Getintouch = () => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleOpen = () => setPopupOpen(true);
  const handleClose = () => setPopupOpen(false);

  useEffect(() => {
    document.body.style.overflow = popupOpen ? "hidden" : "auto";
  }, [popupOpen]);

  return (
    <section className="relative w-full h-[55vh] sm:h-[40vh] md:h-screen overflow-hidden text-white">
      <img
        src={Relax}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gray overlay */}
      <div className="absolute inset-0 bg-black/30 bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-6 md:px-20 md:py-16 gap-10">
        <div className="md:w-full p-10 md:space-y-9 space-y-2">
          <h2 className="text-2xl md:text-5xl font-bold leading-normal text-orange-500">
            Get in Touch with O2 Fitness Healthcare
          </h2>
          <p className="md:text-2xl text-md font-bold">
            We’re here to answer your questions, help you choose the right <br />
            product, or assist with any service request.
          </p>
        

          <div className="md:space-y-9">
            <p className="md:text-xl text-xs font-normal text-gray-200 mt-5 md:leading-loose">
              Whether you're looking for product support, a showroom visit, or a
              custom wellness solution, our team is just a message away. Reach
              out to us via the contact form, WhatsApp, or phone — and we’ll
              respond promptly.
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
      </div>

      {/* Enquiry Popup */}
      {popupOpen && <Enquiry onClose={handleClose} />}
    </section>
  );
};

export default Getintouch;
