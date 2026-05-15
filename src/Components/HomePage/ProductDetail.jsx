import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, incrementQty, decrementQty } from "../../redux/cartSlice";

import Image1 from "../../assets/Products/MCChair/IMG-1.jpg";
import Image2 from "../../assets/Products/MCChair/IMG-2.jpg";
import Image3 from "../../assets/Products/MCChair/IMG-3.jpg";
import Image4 from "../../assets/Products/MCChair/IMG-4.jpg";
import Image5 from "../../assets/Products/MCChair/IMG-5.jpg";
import Image6 from "../../assets/Products/MCChair/IMG-6.jpeg";
import Image7 from "../../assets/Products/MCChair/IMG-7.jpeg";
import Image8 from "../../assets/Products/MCChair/IMG-8.jpeg";
import Image9 from "../../assets/Products/MCChair/IMG-9.jpeg";
import Image10 from "../../assets/Products/MCChair/IMG-10.jpg";
import Image11 from "../../assets/Products/MCChair/IMG-11.jpg";
import Image12 from "../../assets/Products/MCChair/IMG-12.jpg";
import Image13 from "../../assets/Products/MCChair/IMG-13.jpg";
import Image14 from "../../assets/Products/MCChair/IMG-14.jpg";
import Image18 from "../../assets/Products/Leg/Img-18.jpeg";
import Image19 from "../../assets/Products/Neck/Img-19.jpeg";
import Image20 from "../../assets/Products/Neck/Img-20.jpeg";
import Image21 from "../../assets/Products/Neck/Img-21.jpeg";
import Image28 from "../../assets/Products/Foot/IMG-20.jpg";
import Image29 from "../../assets/Products/Foot/IMG-21.jpg";
import Image22 from "../../assets/Products/Foot/IMG-22.jpg";
import Image23 from "../../assets/Products/Foot/IMG-23.jpg";
import Image24 from "../../assets/Products/Foot/IMG-24.jpg";
import Image25 from "../../assets/Products/Foot/IMG-25.jpg";
import Image26 from "../../assets/Products/Foot/IMG-26.jpg";
import Image27 from "../../assets/Products/Foot/IMG-27.jpg";

const products = [
  {
    id: 1,
    title: "O2 Fitness Health Care RUBY A321-2,3D Model",
    type: "Massage Chair",
    para: "Experience personalized comfort with the RUBY A321-2, a smart 3D massage chair designed to target stress, fatigue, and muscle tension with precision and care.",
    rating: 4.5,
    reviews: 123,
    price: "₹1,70,000",
    original: "₹2,40,000",
    image: Image1,
    imagetitle: "RUBY A321-2, 3D Model",
    thumbnails: [Image1, Image2, Image3],
    description:
      "Experience personalized comfort with the RUBY A321-2, a smart 3D massage chair designed to target stress, fatigue, and muscle tension with precision and care.",
    features: [
      "3D Intelligent Massage Rollers for deep-tissue relief",
      "Full Body Airbag Compression for shoulders, waist, arms, and legs",
      "Zero Gravity Recline for total weightless relaxation",
      "Multiple Auto Modes with customizable manual settings",
      "Calf & Foot Massage with vibration and heat functions",
      "Space-Saving Design – ideal for compact spaces",
      "User-Friendly Remote Control for easy operation",
    ],
    whyChoose:
      "Designed to deliver comfort, precision, and value, this 3D model is perfect for those seeking an affordable, effective daily massage solution — all in one elegant unit.",
  },
  {
    id: 2,
    title: "O2 Fitness Health Care 200-O2 Business Class 3D Massage Chair",
    type: "Massage Chair",
    para: "Ultimate leg and foot relief with air compression and heat.",
    rating: 4.2,
    reviews: 85,
    price: "₹32,000",
    original: "₹42,000",
    image: Image4,
    imagetitle: "Foot Massager",
    thumbnails: [Image4, Image5],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
  },
  {
    id: 3,
    title: "O2 Fitness Health Care 90-02 Premium 5D Massage Chair",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image6,
    imagetitle: "Foot Massager",
    thumbnails: [Image6, Image7, Image8, Image9, Image10],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
  },
  {
    id: 4,
    title: "O2 Fitness Health Care 90-02 Premium 5D Massage Chair",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image11,
    imagetitle: "Foot Massager",
    thumbnails: [Image11, Image12],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
  },
  {
     id: 5,
    title: "O2 Fitness Health Care 90-02 Premium 5D Massage Chair",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image13,
    imagetitle: "Foot Massager",
    thumbnails: [Image13, Image14],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 6,
    title: "Home Gym Fitness (Advanced Model)",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image18,
    imagetitle: "Foot Massager",
    thumbnails: [Image18],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 7,
    title: "Home Gym Fitness (Advanced Model)",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image18,
    imagetitle: "Foot Massager",
    thumbnails: [Image18,],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 8,
    title: "O2 Neck Massager (Wireless)",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image19,
    imagetitle: "Foot Massager",
    thumbnails: [Image19, Image20, Image21],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 9,
    title: "Foot Massager : Leg massager",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image28,
    imagetitle: "Foot Massager",
    thumbnails: [Image28, Image29],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 10,
    title: "Foot Massager : Leg massager",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image22,
    imagetitle: "Foot Massager",
    thumbnails: [ Image22],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 11,
    title: "O2 Neck Massager (Wireless)",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image23,
    imagetitle: "Foot Massager",
    thumbnails: [ Image23, Image24, Image25],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
    {
     id: 12,
    title: "O2 Neck Massager (Wireless)",
    type: "Foot Massager",
    rating: 4.0,
    reviews: 80,
    price: "₹6,499",
    original: "₹14,999",
    image: Image26,
    imagetitle: "Foot Massager",
    thumbnails: [ Image26, Image27],
    description: "Perfect for tired feet and calves after a long day.",
    features: [
      "Air Compression Massage",
      "Heat Therapy",
      "Auto Shut-off",
      "Multiple Modes",
    ],
    whyChoose: "Affordable and compact massager for your home comfort.",
    },
  
];

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const product = products.find((item) => item.id === parseInt(id));

  if (!product)
    return <p className="text-center text-red-500">Product not found.</p>;

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const [mainImage, setMainImage] = useState(product.image);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product }));
  };

  const handleIncrement = () => {
    dispatch(incrementQty(product.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQty(product.id));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <img
            src={mainImage}
            alt="Main"
            className="w-full object-contain h-[400px] rounded-lg border"
            style={{
              borderImage: "linear-gradient(to right, orange, skyblue) 1",
            }}
          />
          <div className="flex gap-4 mt-4">
            {product.thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                onClick={() => setMainImage(thumb)}
                className={`w-24 h-24 cursor-pointer rounded-lg border-2 ${
                  mainImage === thumb ? "border-orange-600" : "border-gray-300"
                }`}
                alt={`Thumbnail ${index + 1}`}
              />
            ))}
          </div>

          {/* Why Choose Section */}
          <div className="mt-12 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-2">
              Why Choose RUBY A321-2?
            </h3>
            <p className="text-gray-700">{product.whyChoose}</p>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black hover:text-orange-600">
            {product.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-yellow-500">
            {"★".repeat(Math.floor(product.rating))}{" "}
            <span className="text-sm text-gray-600">({product.reviews})</span>
          </div>
          <h4 className="text-lg text-gray-600">{product.type}</h4>
          <p className="text-sm text-gray-500 mt-2 ">{product.para}</p>
          <div className="flex gap-4 mt-4 items-center">
            <span className="text-2xl font-bold text-orange-600">
              {product.price}
            </span>
            <span className="line-through text-gray-400">
              {product.original}
            </span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              Save 30%
            </span>
          </div>

          {/* Quantity and Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-3 mt-6">
              {quantity > 0 ? (
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={handleDecrement}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span className="font-medium text-sm">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Product Description
            </h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Key Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {product.features.map((feat, idx) => (
                <li key={idx}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-2">Related Products</h2>
        <p className="text-gray-600 mb-6">
          Discover other products that complement your wellness needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products
            .filter((p) => p.id !== product.id) // exclude current product
            .slice(0, 3) // show only 3
            .map((rel) => (
              <div
                key={rel.id}
                className="border rounded-lg p-4 shadow-sm text-center relative"
              >
                <div className="absolute top-2 right-3 bg-gradient-to-b from-orange-800 to-orange-400 text-transparent bg-clip-text font-semibold text-sm">
                  Sale
                </div>
                <img
                  src={rel.image}
                  alt={rel.title}
                  className="w-full h-44 object-contain mb-3 hover:scale-105 transition"
                />
                <h4 className="text-sm text-gray-600">{rel.type}</h4>
                <div className="text-orange-500 text-sm mb-1">
                  {"★".repeat(Math.floor(rel.rating))}{" "}
                  <span className="text-gray-500">({rel.reviews})</span>
                </div>
                <h3 className="text-md font-semibold text-gray-800 mb-2 leading-snug">
                  {rel.title}
                </h3>
                <div className="mb-2">
                  <span className="text-orange-600 font-bold">{rel.price}</span>{" "}
                  <span className="line-through text-gray-400 text-sm">
                    {rel.original}
                  </span>
                </div>
                <button
                  onClick={() => dispatch(addToCart(rel))}
                  className="bg-black text-white text-sm px-4 py-1 rounded hover:bg-gray-800"
                >
                  Add To Cart
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
