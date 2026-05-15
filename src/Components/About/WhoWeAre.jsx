import React from "react";
import WhoWeAreImg from "../../assets/About/WeAre.png";

const WhoWeAre = () => {
  return (
    <section className="w-full py-10 px-4 md:px-20 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={WhoWeAreImg}
            alt="Who We Are Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left px-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-10 text-black">
            Who We Are
          </h2>
          <p className="text-gray-700 leading-loose text-md md:text-lg ">
            O2 Fitness Healthcare is a proudly Indian wellness brand dedicated
            to helping people live better through intelligent massage solutions.
            From advanced massage chairs to compact fitness equipment, we offer
            products that support physical relief, daily relaxation, and
            long-term wellness.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
