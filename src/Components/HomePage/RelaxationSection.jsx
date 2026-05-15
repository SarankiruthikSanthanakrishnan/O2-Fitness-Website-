import React, { useState } from "react";
import Relax from "../../assets/HomeImage/Relax.jpg";
import Enquiry from "../../NavFooter/Enquiry";
import { motion } from "framer-motion";

const RelaxationSection = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const handleOpen = () => setPopupOpen(true);
  const handleClose = () => setPopupOpen(false);

  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden text-white">
      <img src={Relax} alt="Relax" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <motion.div
        className="relative z-10 text-center max-w-3xl px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          Discover <span className="text-orange-400">Luxury & Wellness</span> with O2 Fitness 
        </h2>
        <p className="text-lg md:text-xl mb-6 text-gray-200">
          Experience intelligent massage technology designed for your relaxation.
        </p>
        <motion.button
          onClick={handleOpen}
          whileHover={{ scale: 1.08 }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:shadow-orange-400/40 transition text-lg font-semibold"
        >
          Enquire Now
        </motion.button>
      </motion.div>

      {popupOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6"
          >
            <Enquiry onClose={handleClose} />
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default RelaxationSection;
