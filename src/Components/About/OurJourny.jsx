import React from 'react';

const milestones = [
  {
    id: 1,
    number: "01",
    color: "orange",
    textAbove: "Brand founded",
    textBelow: "in Chennai"
  },
  {
    id: 2,
    number: "02", 
    color: "blue",
    textAbove: "Crossed 10,000+",
    textBelow: "chairs sold"
  },
  {
    id: 3,
    number: "03",
    color: "orange", 
    textAbove: "Expanded to",
    textBelow: "Salem"
  },
  {
    id: 4,
    number: "04",
    color: "blue",
    textAbove: "Launched smart",
    textBelow: "fitness accessories"
  }
];

const OurJourny = () => {
  return (
    <div className="w-full bg-white ">
      {/* Title Section */}
      <div className="text-center px-4 md:px-10 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold">Our Journey</h1>
        <p className="text-gray-700 mt-4 leading-loose py-5 md:text-lg text-sm">
          O2 Fitness Healthcare began with a simple goal — to bring wellness closer to people’s lives.
          What started as a small initiative in Chennai has now grown into a trusted brand serving
          thousands across India. Over the years, we’ve introduced smart massage chairs, leg massagers,
          and fitness tools designed to relieve pain, reduce stress, and improve everyday comfort.
          With each milestone, we’ve stayed committed to innovation, customer care, and making wellness
          accessible to every home, clinic, and office. Our journey is still unfolding — and we’re
          proud to grow with the people we serve.
        </p>
      </div>

      {/* Timeline Section */}
      <div className=" bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Timeline container */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            
            {/* Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex flex-col items-center ">
                  {/* Text above */}
                  {index % 2 === 0 && (
                    <div className="text-center mb-16">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {milestone.textAbove}
                      </div>
                      <div className="text-sm text-gray-600">
                        {milestone.textBelow}
                      </div>
                    </div>
                  )}
                  
                  {/* Number box */}
                  <div className={`
                    w-12 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm z-10 
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    ${milestone.color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}
                  `}>
                    {milestone.number}
                  </div>
                  
                  {/* Text below */}
                  {index % 2 === 1 && (
                    <div className="text-center mt-20">
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {milestone.textAbove}
                      </div>
                      <div className="text-sm text-gray-600">
                        {milestone.textBelow}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurJourny;
