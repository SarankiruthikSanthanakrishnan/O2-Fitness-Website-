import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import { Button } from '/src/Components/ui/button';
import Logo from '../assets/HomeImage/O2Logo.png';
import Enquiry from './Enquiry';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';

const db = getFirestore(app);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search & Products State
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // UI State
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Fetch products
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  // Filter products for search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFiltered([]);
      return;
    }
    const results = products.filter((p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results.slice(0, 6));
  }, [searchTerm, products]);

  // Navigate to product
  const handleNavigateProduct = (product) => {
    setSearchTerm('');
    setFiltered([]);
    setIsMobileMenuOpen(false);
    const slug =
      product.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'product';
    navigate(`/products/${slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleNavigateProduct(filtered[0]);
    }
  };

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-2.5 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex-shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img
            src={Logo}
            alt="O2 Fitness Logo"
            className="h-12 md:h-14 w-auto"
          />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-orange-500 relative group font-semibold text-[15px] xl:text-base tracking-wide"
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1.5 w-full h-0.5 bg-gradient-to-r from-orange-500 to-blue-400 transition-transform origin-left duration-300 rounded ${
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search & Enquiry Button */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {/* Search Bar */}
          <div className="relative w-64 xl:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 rounded-full border border-orange-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* Search Suggestions */}
            {filtered.length > 0 && (
              <div className="absolute z-50 top-12 left-0 w-full bg-white shadow-xl border border-gray-100 rounded-lg max-h-80 overflow-y-auto">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleNavigateProduct(product)}
                    className="flex items-center gap-3 p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images || '/placeholder.png'
                      }
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {product.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            className="bg-[#F25C05] hover:bg-[#D95000] text-white text-sm font-semibold px-6 py-2 h-[40px] rounded-full shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            onClick={() => setShowEnquiry(true)}
          >
            Enquiry Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-gray-700 hover:text-orange-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col py-4 px-4 gap-4 z-50">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {filtered.length > 0 && (
              <div className="absolute z-50 top-14 left-0 w-full bg-white shadow-lg border border-gray-100 rounded-lg max-h-60 overflow-y-auto">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleNavigateProduct(product)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images || '/placeholder.png'
                      }
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {product.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-2 mt-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-semibold px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <Button
            className="w-full mt-2 bg-[#F25C05] hover:bg-[#D95000] text-white text-base font-semibold py-6 rounded-xl shadow-lg shadow-orange-500/20"
            onClick={() => {
              setShowEnquiry(true);
              setIsMobileMenuOpen(false);
            }}
          >
            Enquiry Now
          </Button>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl max-w-xl w-full p-6 relative bg-white">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 rounded-full p-1"
              onClick={() => setShowEnquiry(false)}
            >
              <X size={20} />
            </button>
            <Enquiry onClose={() => setShowEnquiry(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
