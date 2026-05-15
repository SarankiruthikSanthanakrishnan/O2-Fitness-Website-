import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, incrementQty, decrementQty } from "../../redux/cartSlice";


import Image20 from "../../assets/Products/Foot/IMG-20.jpg";
import Image22 from "../../assets/Products/Foot/IMG-22.jpg";
import Image23 from "../../assets/Products/Foot/IMG-23.jpg";
import Image26 from "../../assets/Products/Foot/IMG-26.jpg";


const LegProducts = [
  {
    id: 9,
    title: "Foot Massager : Leg massager",
    image: Image20,
    oldPrice: "₹2,65,000",
    price: "₹2,08,500",
    rating: "4.8",
    reviews: "1,204",
    tag: "Massage Chair",
  },
  {
    id: 10,
    title: "Home Gym Fitness (Advanced Model)",
    image: Image22,
    oldPrice: "₹3,15,000",
    price: "₹2,75,000",
    rating: "4.9",
    reviews: "987",
    tag: "Massage Chair",
  },
  {
    id: 11,
    title: "Home Gym Fitness (Advanced Model)",
    image: Image23,
    oldPrice: "₹3,15,000",
    price: "₹2,75,000",
    rating: "4.9",
    reviews: "987",
    tag: "Massage Chair",
  },
  {
    id: 12,
    title: "Home Gym Fitness (Advanced Model)",
    image: Image26,
    oldPrice: "₹3,15,000",
    price: "₹2,75,000",
    rating: "4.9",
    reviews: "987",
    tag: "Massage Chair",
  },
  
];

const LegFootMassager = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  const handleNavigate = (id) => navigate(`/product/${id}`);
  const handleAddToCart = (product) => dispatch(addToCart(product));
  const handleIncrement = (id) => dispatch(incrementQty(id));
  const handleDecrement = (id) => dispatch(decrementQty(id));

  return (
    <div className="px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-6 mt-5">
        Leg Massager
      </h2>
      <p className="text-center text-gray-800 mb-6 max-w-5xl mx-auto">
        Let our massage chairs do the work. From zero gravity to heated rollers,
        explore advanced features that soothe your body and calm your mind.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
        {LegProducts.map((product) => {
          const qty = getQuantity(product.id);

          return (
            <div
              key={product.id}
              className="border rounded-lg shadow-sm p-4 relative flex flex-col items-center bg-white"
              onClick={() => handleNavigate(product.id)}
            >
              <span className="absolute top-2 right-2 text-transparent bg-clip-text bg-gradient-to-b from-orange-800 to-orange-400 font-semibold">
                Sale
              </span>
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-40 object-contain mb-4 cursor-pointer transition-transform duration-300 
                ${
                  product.id === 5
                    ? "transform rotate-12 scale-110"
                    : "hover:scale-110"
                }`}
              />
              <h1 className="text-gray-500 text-sm">{product.tag}</h1>

              <div className="flex items-center justify-center gap-1 text-yellow-500 mt-1">
                ★ {product.rating}
                <span className="text-xs text-gray-500">
                  ({product.reviews})
                </span>
              </div>

              <h3 className="text-sm font-medium text-center">
                {product.title}
              </h3>
              <div className="text-sm text-gray-600 mt-2 line-through">
                {product.oldPrice}
              </div>
              <div className="text-lg font-bold text-orange-500">
                {product.price}
              </div>

              {qty > 0 ? (
                <div className="flex gap-2 items-center mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement(product.id);
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span className="text-sm font-medium">{qty}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement(product.id);
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="mt-3 bg-black text-white py-1 px-4 rounded hover:bg-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Buy Now
                </button>
              )}

              <button
                className="mt-2 text-sm underline text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(product.id);
                }}
              ></button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LegFootMassager;
