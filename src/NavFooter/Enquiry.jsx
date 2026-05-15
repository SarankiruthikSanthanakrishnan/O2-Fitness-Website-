import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';

const Enquiry = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    enquiry: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl relative overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Enquiry Now
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                We'd love to hear from you
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-600 text-sm sm:text-base text-center mb-6 sm:mb-8">
            Whether you're interested in a product, need a demo, or have questions, 
            we'll respond within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                <User className="w-4 h-4 mr-2 text-orange-500" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 
                         transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-orange-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 
                         transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Mobile Field */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-orange-500" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 
                         transition-all duration-200 text-sm sm:text-base"
              />
            </div>

            {/* Message Field */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
                Your Message
              </label>
              <textarea
                name="enquiry"
                value={formData.enquiry}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your inquiry..."
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 
                         transition-all duration-200 resize-none text-sm sm:text-base"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                       text-white font-semibold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl 
                       transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                       text-sm sm:text-base flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Send Message
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
      </div>
    </div>
  );
};

export default Enquiry;