import React from "react";
import Logo from "../assets/HomeImage/Logo.png";
import EMC from "../assets/HomeImage/EMC.png";
import FDA from "../assets/HomeImage/FDA.webp";
import IQC from "../assets/HomeImage/IQC.png";
import PB from "../assets/HomeImage/PB.jpg";
import ROHS from "../assets/HomeImage/ROHS.png";
import TM from "../assets/HomeImage/Trademark.jpg";
import UL from "../assets/HomeImage/UL.jpg";
import MII from "../assets/HomeImage/MII.png";

import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const certifications = [
    { src: UL, alt: "UL" },
    { src: ROHS, alt: "ROHS" },
    { src: PB, alt: "PB" },
    { src: FDA, alt: "FDA" },
    { src: IQC, alt: "IQC" },
    { src: TM, alt: "TM" },
    { src: EMC, alt: "EMC" },
    { src: MII, alt: "Make In India" },
  ];

  return (
    <>
      {/* ====== Certifications Section (Above Footer) ====== */}
      <section className="bg-white py-6">
        <h2 className="text-center mb-2 font-bold text-2xl uppercase">Certifications</h2>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 px-4">
          {certifications.map((cert, index) => (
            <img
              key={index}
              src={cert.src}
              alt={cert.alt}
              className="h-20 object-contain opacity-80 hover:opacity-100 transition"
            />
          ))}
        </div>
      </section>

      {/* ====== Main Footer Section ====== */}
      <footer className="bg-gradient-to-r from-[#f7f3ef] to-[#e8f1f2] text-gray-800 px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top: Company Logo */}
          <div className="flex justify-start">
            <img src={Logo} alt="Company Logo" className="w-40" />
          </div>

          {/* Bottom: 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Contact Info */}
            <div className="text-sm space-y-3">
              <p>
                <strong>Email:</strong> o2fitnesshealthcare@gmail.com
              </p>
              <p>
                <strong>Phone:</strong> 6380907315, 9750059375, 8667833328,
                8668144412, 8610800315.
              </p>
              <div>
                <p>
                  <strong>Address:</strong>
                </p>
                <p>
                  <strong>Head Office:</strong>
                  <br />
                  O2FITNESS HEALTH CARE
                  <br />
                  No:1/135, Vallishwaran Koil Street,
                  <br />
                  Manapakkam, Chennai - 600125
                  <br />
                  Ph: 86108 00315, 63809 07315
                </p>
                <p className="mt-2">
                  <strong>Branch Office:</strong>
                  <br />
                  No.49, Kadharkhan Street, Near Thirumal Blood Lab, Junction(Opp)
                  <br />
                  Suramangalam, SALEM - 636005
                  <br />
                  Ph: 8667833328, 6380907315
                </p>
              </div>
            </div>

            {/* Middle: Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-orange-500">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-orange-500">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-orange-500">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-orange-500">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/warranty" className="hover:text-orange-500">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Social Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <p className="text-sm mb-4">
                Connect with us on social media for updates, offers, and more.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/o2fitnesshealthcare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/6380307315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://youtube.com/@o2fitnesshealthcare450?si=7MUr2IvugyJz9zRE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <hr className="mt-5 text-gray-400" />
        <div className="text-center mt-2 text-sm">
          <span className="font-medium">O2 Fitness Health Care</span> - Copyright © 2025.{" "}
          Designed & Developed by{" "}
          <span className="font-medium">Dream2Way Solutions</span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
