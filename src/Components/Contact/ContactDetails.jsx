import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactDetails = () => {
  return (
    <section className="min-h-screen bg-white px-6 md:px-20 py-12 md:py-20 flex flex-col md:flex-row gap-10 justify-center items-start">
      {/* Left - Contact Info */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-2xl font-bold text-black">Contact</h2>

        {/* Head Office */}
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="text-orange-500" size={20} />
            <h3 className="font-semibold text-md md:text-lg ">Head office</h3>
          </div>
          <p className="text-gray-700 text-sm md:text-md">O2FITNESS HEALTH CARE</p>
          <p className="text-gray-600 mt-1 text-sm md:text-md">
            No:1/135, Vallishwaran Koil Street,
            <br />
            Manapakkam, Chennai - 600125
          </p>
          <div className="flex items-start gap-2  text-sm md:text-md">
            <Phone className="text-orange-500 mt-1" size={20} />
            <p className="text-gray-600 mt-1">86108 00315, 63809 07315</p>
          </div>
        </div>

        {/* Branch Office */}
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="text-orange-500" size={20} />
            <h3 className="font-semibold text-md md:text-lg">Branch office</h3>
          </div>
          <p className="text-gray-700 mt-1  text-sm md:text-md">O2FITNESS HEALTH CARE</p>
          <p className="text-gray-600 mt-1  text-sm md:text-md">
            No.49, Kadharkhan street, Near Thirumal blood lab, junction (opp)
            Suramangalam
          </p>
          <p className="text-gray-600 mt-1  text-sm md:text-md">SALEM - 636005</p>
          <div className="flex items-start gap-2 mt-1  text-sm md:text-md">
            <Phone className="text-orange-500 mt-1" size={20} />
            <p className="text-gray-600">
              86678 33328, 63809 07315
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2  text-sm md:text-md">
          <Mail className="text-orange-500" size={20} />
          <span className="text-gray-700">o2fitnesshealthcare@gmail.com</span>
        </div>

        {/* Website 
        <div className="flex items-center gap-2">
          <MapPin className="text-orange-500" size={20} />
          <a
            href="https://www.o2fitness.com"
            className="text-blue-600 underline"
          >
            www.o2fitness.com
          </a>
        </div>*/}
      </div>

      {/* Right - Form */}
      <div className="md:w-1/2 bg-gradient-to-b from-orange-500 to-orange-300 p-8 rounded-lg shadow-2xl drop-shadow-blue-500">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Connect with O2 Fitness
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 bg-white rounded-md  focus:outline-none"
          />
          <input
            type="text"
            placeholder="Your Mobile Number"
            className="w-full px-4 py-2 rounded-md bg-white focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email Id"
            className="w-full px-4 py-2 rounded-md bg-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Your City"
            className="w-full px-4 py-2 rounded-md bg-white focus:outline-none"
          />
          <textarea
            placeholder="Message"
            rows="4"
            className="w-full px-4 py-2 rounded-md bg-white focus:outline-none"
          ></textarea>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactDetails;
