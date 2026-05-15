import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "/src/Components/ui/button"; // adjust relative path
import Image1 from "/src/assets/Products/MCChair/IMG-1.jpg";
export default function PromoBanner() {
  return (
    <section className="relative max-w-7xl overflow-hidden drop-shadow-2xl shadow-xl text-black">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Relaxation 
                <span className="block">Meets Technology</span>
              </h1>
              
              <p className="text-xl lg:text-2xl font-medium opacity-90">
                Experience Spa-Like Comfort Anytime, Anywhere
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-wider">
                Designed to melt away stress
              </h2>
              
              <p className="text-sm lg:text-base opacity-85 leading-relaxed">
                Perfect for Home, Office, or Wellness Spaces
              </p>
            </div>

            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-green-600 hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full"
            >
              Shop Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Product Image Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={Image1}
                alt="Robotic Massager Pro - Ergonomic massage device for home, car and office use"
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full blur-3xl scale-150"></div>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-lg"></div>
      </div>
    </section>
  );
}
