import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
  }),
};

const WhyChoose = () => {
  const cards = [
    {
      title: "Advanced Technology",
      text: "Experience 3D, 4D, and 6D massage systems, Zero Gravity, heat therapy, and AI body scan features.",
    },
    {
      title: "Free Delivery & Service",
      text: "Enjoy doorstep delivery and after-sales service in major cities at no extra cost.",
    },
    {
      title: "1-Year Guarantee + 5-Year Warranty",
      text: "Buy with confidence knowing your comfort is protected long after your purchase.",
    },
    {
      title: "Free Door Delivery Across India",
      text: "Enjoy fast and reliable delivery at no extra cost.",
    },
  ];

  return (
    <div className="bg-white w-full max-w-full overflow-hidden">
      {/* Title + Subtitle + Paragraph */}
      <motion.div
        className="px-4 py-12 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="text-2xl md:text-4xl font-bold mb-2"
            variants={fadeUp}
            custom={0}
          >
            Why Choose O2 Fitness Healthcare
          </motion.h1>
          <motion.h3
            className="text-sm font-medium text-gray-800 mb-6 mt-5"
            variants={fadeUp}
            custom={0.2}
          >
            Expertly engineered wellness solutions backed by trust, technology, and care.
          </motion.h3>
          <motion.p
            className="text-sm md:text-base text-gray-700 leading-loose mb-1"
            variants={fadeUp}
            custom={0.4}
          >
            At O2 Fitness Healthcare, we go beyond just selling products — we deliver wellness
            experiences. Our massage chairs and fitness solutions are crafted using intelligent
            technology, quality materials, and decades of industry insight. With nationwide service,
            free delivery, and a customer-first approach, we're committed to helping you feel better,
            move better, and live better — every single day.
          </motion.p>
        </div>
      </motion.div>

      {/* Feature Cards Section */}
      <div className="px-4 pb-12 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Gradient Border Wrapper */}
          <motion.div
            className="p-[2px] rounded-lg bg-gradient-to-r from-orange-400 to-blue-400"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Inner White Card Container */}
            <div className="bg-white rounded-lg shadow-xl flex flex-col lg:flex-row items-stretch justify-between relative">
              {cards.map((card, index) => (
                <React.Fragment key={index}>
                  {/* Card */}
                  <motion.div
                    className="flex-1 px-4 md:px-6 py-6 text-left"
                    variants={fadeUp}
                    custom={index * 0.3}
                  >
                    <h4 className="text-base md:text-lg font-bold mb-2">{card.title}</h4>
                    <p className="text-xs md:text-sm text-gray-700">{card.text}</p>
                  </motion.div>

                  {/* Divider (skip after last card) */}
                  {index !== cards.length - 1 && (
                    <motion.div
                      className="w-full h-[1px] lg:w-[2px] lg:h-auto bg-gradient-to-r lg:bg-gradient-to-b from-orange-400 via-gray-300 to-blue-400 opacity-80"
                      variants={fadeUp}
                      custom={index * 0.3 + 0.15}
                    ></motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
