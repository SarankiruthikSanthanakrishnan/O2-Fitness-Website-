import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const MapSection = () => {
  return (
    <div className="relative w-full h-[450px]">
      {/* Google Map */}
      <iframe
        title="O2Fitness Location"
        className="absolute top-0 left-0 w-full h-full"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4783.235132465597!2d80.19093269999999!3d13.0147981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267a5ec8ee683%3A0x4410b71bfe556665!2sO2fitnesshealthcare!5e1!3m2!1sen!2sin!4v1758281808439!5m2!1sen!2sin" 
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapSection;
