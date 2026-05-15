import { Button } from "/src/components/ui/button";
import { ChevronRight } from "lucide-react";
import roboMassagerHero from "/src/assets/Products/MGChair.png";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-blue-500 text-black ">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                O2 Fitness
                <span className="block">Health Care</span>
              </h1>
              
              <p className="text-xl lg:text-2xl font-medium opacity-90">
                Zero Gravity
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold tracking-wider">
                Floating Experience
              </h2>
              
              <p className="text-sm lg:text-base opacity-85 leading-relaxed">
                Can be used @ Back, Shoulder, Lower Back, Legs, Hands
              </p>
            </div>

            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-success hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full"
            >
              Shop Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Product Image Section */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={roboMassagerHero} 
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
