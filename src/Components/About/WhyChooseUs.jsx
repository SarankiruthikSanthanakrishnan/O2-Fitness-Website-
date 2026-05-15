import React from 'react'
import QuestionMarkImage from '../../assets/About/QuestionMark.jpg'

const WhyChooseUs = () => {
  const features = [
    { text: "Free Door Delivery", color: "right", bg: "bg-orange-500" },
    { text: "Premium 3D/4D/5D Massage Technology", color: "right", bg: "bg-orange-500" },
    { text: "1-Year Guarantee + 2-Year Warranty", color: "left", bg: "bg-blue-500" },
    { text: "Designed for Total Body Relief", color: "left",bg: "bg-blue-500" },
    { text: "Pan-India Support", color: "left", bg: "[background-color:PeachPuff]" },
    { text: "Trusted by 10,000+ Customers", color: "right", bg: "[background-color:PeachPuff]" },
  ];
  return (
    <section className="w-full bg-white py-12 px-4 md:px-20">
      {/* Title & Paragraph */}
      <div className="md:text-left text-center mb-12 max-w-5xl">
        <h2 className="text-2xl md:text-4xl font-bold text-black mb-4">Why Choose Us</h2>
        <p className="text-gray-700 md:text-lg text-sm leading-loose">
          At O2 Fitness Healthcare, we combine advanced massage technology with reliable service to bring wellness into your daily routine. 
          From premium 3D and 4D massage chairs to compact leg massagers and fitness accessories, every product is designed with care, 
          comfort, and effectiveness in mind. We offer free doorstep delivery, dedicated customer support, and a strong warranty — 
          so you can experience relaxation without worry. With thousands of satisfied customers across India, we are proud to be a 
          trusted name in wellness and recovery.
        </p>
      </div>

      {/* Main Content */}
     <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="relative w-full h-12">
            {/* Colored Background Strip */}
            <div
              className={`absolute top-0 h-full w-full rounded-lg shadow-xl ${feature.color === "left" ? "left-0" : "right-0"} ${feature.bg}`}
            ></div>

            {/* White Pill on Top */}
            <div
              className={`absolute top-0 ${
                feature.color === "left" ? "left-[11%]" : "right-[10%]"
              } w-[90%] h-full bg-white rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold shadow-md text-black z-10`}
            >
              {feature.text}
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  )
}

export default WhyChooseUs