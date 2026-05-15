import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import { ArrowLeft, ArrowRight } from "lucide-react";

const db = getFirestore(app);

const PrevArrow = ({ onClick }) => (
  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
    <button
      onClick={onClick}
      className="bg-white rounded-full shadow p-2 hover:text-orange-500"
    >
      <ArrowLeft size={20} />
    </button>
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
    <button
      onClick={onClick}
      className="bg-white rounded-full shadow p-2 hover:text-orange-500"
    >
      <ArrowRight size={20} />
    </button>
  </div>
);

const ProductRange = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(data.filter((c) => !c.isHidden));
    });
    return () => unsub();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full max-w-full overflow-hidden px-4 md:px-8">
      <div className="text-center py-10 md:py-16">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Shop by Category</h1>
        <p className="px-2 md:px-40 leading-loose mt-2 text-gray-600 text-sm md:text-base">
          Explore our wide range of categories and find the perfect products
          tailored to your lifestyle and needs.
        </p>
      </div>

      <div className="relative mb-10 mx-4 md:mx-8">
        <Slider {...settings}>
          {/* Shop All Option */}
        

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <div key={cat.id} className="px-2 md:px-4">
              <div
                className="w-32 h-32   rounded-full overflow-hidden justify-center flex flex-col items-center cursor-pointer p-4"
                onClick={() => navigate(`/products?category=${cat.id}`)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full md:w-40 md:h-40 object-contain rounded-full border-none focus:outline-none"
                />
                <p className="mt-2 text-center font-medium text-sm md:text-base">
                  {cat.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductRange;
