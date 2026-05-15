import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Button } from "/src/Components/ui/button";
import Logo from "../assets/HomeImage/Logo.png";
import Enquiry from "./Enquiry";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase/firebaseConfig";

const db = getFirestore(app);

const TopHeader = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showEnquiry, setShowEnquiry] = useState(false);

  // ✅ Get cart from Redux
  const cart = useSelector((state) => state.cart?.items || []);
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // ✅ Fetch products from Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  // ✅ Filter search results
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      return;
    }
    const results = products.filter((p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results.slice(0, 6));
  }, [searchTerm, products]);

  // ✅ Navigate to Product Page
  const handleNavigateProduct = (product) => {
    setSearchTerm("");
    setFiltered([]);
    const slug =
      product.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "product";
    navigate(`/products/${slug}`);
  };

  // ✅ Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length > 0) {
      handleNavigateProduct(filtered[0]);
    }
  };

  return (
    <div className="w-full border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative">

        {/* 🔹 Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={Logo} alt="Logo" className="h-20 w-auto" />
        </Link>

        {/* 🔹 Search Bar */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search products"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 🔹 Search Suggestions */}
          {filtered.length > 0 && (
            <div className="absolute z-50 top-12 left-0 w-full bg-white shadow-lg rounded-md max-h-80 overflow-y-auto">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleNavigateProduct(product)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={
                      Array.isArray(product.images)
                        ? product.images[0]
                        : product.images || "/placeholder.png"
                    }
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-md font-medium text-gray-800 line-clamp-1">
                      {product.title}
                    </p>
                    {/* Price Removed */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Cart + Enquiry */}
        <div className="flex items-center gap-6">
          {/* 🔹 Cart Removed */}

          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg"
            onClick={() => setShowEnquiry(true)}
          >
            Enquiry Now
          </Button>
        </div>
      </div>

      {/* 🔹 Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="rounded-xl shadow-2xl max-w-xl w-full p-6 relative bg-white">
            <button
              className="absolute top-2 right-4 text-black text-2xl font-bold"
              onClick={() => setShowEnquiry(false)}
            >
              &times;
            </button>
            <Enquiry onClose={() => setShowEnquiry(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopHeader;
