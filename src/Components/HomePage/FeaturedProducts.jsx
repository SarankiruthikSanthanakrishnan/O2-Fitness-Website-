import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { ProductCard } from "../ProductCard";

const db = getFirestore(app);

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("subCategory", "==", "Featured Products")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  const handleAddToCart = (product) => dispatch(addToCart(product));

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (_, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1536,
        settings: { slidesToShow: 4, slidesToScroll: 1 },
      },
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <div className="w-full bg-slate-50/50 py-16">
      <div className="w-full px-4 md:px-8 xl:px-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-800">
          Featured Products
        </h2>
        <p className="text-center text-gray-600 mb-10 text-sm md:text-base max-w-2xl mx-auto">
          Discover our best-selling massage chairs and wellness devices — trusted
          by thousands across India.
        </p>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No Featured Products found.</p>
        ) : (
          <div className="px-2 sm:px-4">
            <Slider {...settings} className="featured-slider">
              {products.map((product) => (
                <div key={product.id} className="p-2 md:p-4">
                  <div className="flex justify-center h-full">
                    <ProductCard
                      product={product}
                      viewMode="grid"
                      size="medium"
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </div>
                </div>
              ))}
            </Slider>

            {/* Pagination */}
            <div className="mt-8 text-center text-gray-500 font-semibold text-sm tracking-widest">
              {`0${(currentSlide % products.length) + 1}`} <span className="mx-2 text-gray-300">|</span> 0{products.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
