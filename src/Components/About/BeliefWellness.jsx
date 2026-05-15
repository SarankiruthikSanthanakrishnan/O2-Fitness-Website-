import React from "react";

const BeliefWellness = () => {
  const bewellness = [
    {
      title: 'Mission',
      gradient: 'from-orange-500 to-yellow-400',
      triangleColor: '#f97316', // Orange
      content:
        'At O2 Fitness Healthcare, our mission is to make wellness a part of everyday life by offering smart, reliable, and affordable massage and fitness solutions. We aim to empower people of all ages to take control of their physical well-being through technology-driven products that deliver real relief and comfort.',
    },
    {
      title: 'Vision',
      gradient: 'from-blue-500 to-cyan-400',
      triangleColor: '#3b82f6', // Blue
      content:
        'At O2 Fitness Healthcare, our vision is to make wellness a part of everyday life by offering smart, reliable, and affordable massage and fitness solutions. We aim to empower people of all ages to take control of their physical well-being through technology-driven products that deliver real relief and comfort.',
    },
    {
      title: 'Core Value',
      gradient: 'from-sky-500 to-blue-400',
      triangleColor: '#0ea5e9', // Sky
      content:
        'At O2 Fitness Healthcare, our mission is to make wellness a part of everyday life by offering smart, reliable, and affordable massage and fitness solutions. We aim to empower people of all ages to take control of their physical well-being through technology-driven products that deliver real relief and comfort.',
    },
  ];

  return (
    <div className="px-4 md:px-20 py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-14">
        Built on Belief, Driven by Wellness
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bewellness.map((item, index) => (
          <div key={index} className="relative">
            {/* Title with triangle */}
            <div className="relative -top-5 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
              <div
                className={`absolute px-6 py-1 rounded-t-md text-white font-semibold bg-gradient-to-r ${item.gradient}`}
              >
                {item.title}
              </div>
              <div
                className="absolute top-8 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent"
                style={{
                  borderTopColor: item.triangleColor,
                }}
              ></div>
            </div>

            {/* Card Body */}
            <div
              className="bg-white rounded-md shadow-2xl p-6 relative border-l-2 border-r-2"
              style={{
                borderLeftColor: item.triangleColor,
                borderRightColor: "#3b82f6", // Blue right border fixed
                borderBottomWidth: "2px",
                borderBottomStyle: "solid",
                borderBottomColor: "transparent", // transparent to show gradient bottom
              }}
            >
              {/* Bottom gradient border */}
              <div
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  borderRadius: "0 0 0.375rem 0.375rem", // same as rounded-md bottom corners
                  background: `linear-gradient(to right, #f97316, #3b82f6)`, // orange to blue gradient
                }}
              ></div>

              <p className="text-gray-700 text-sm leading-relaxed relative z-10">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeliefWellness;
