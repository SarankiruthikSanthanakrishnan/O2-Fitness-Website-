import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center items-center relative">
        {/* Desktop Menu - Centered */}
        <ul className="hidden md:flex gap-8 text-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path; // 2️⃣ Compare path

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-700 hover:text-orange-500 relative group"
                >
                  <span className="pb-1 text-lg font-semibold relative">
                    {link.name}
                    <span
                      className={`
                        absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-orange-500 to-blue-400 
                        transition-transform origin-left duration-300 rounded
                        ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                      `}
                    ></span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Toggle - Right aligned */}
        <button
          className="md:hidden absolute right-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - Centered */}
      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-6 py-6 bg-white shadow-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-lg font-semibold ${
                    isActive ? "text-orange-500 border-b-2 border-orange-500 pb-1" : "text-gray-700 hover:text-orange-500 hover:border-b-2 hover:border-orange-500 pb-1"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default NavLinks;
