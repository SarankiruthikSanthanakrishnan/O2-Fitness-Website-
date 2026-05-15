import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, incrementQty, decrementQty } from "../../redux/cartSlice";

// Replace these with actual neck massager images
import Image18 from "../../assets/Products/Neck/Img-19.jpeg";

const NeckProducts = [
  {
    id: 8,
    title: "O2 Neck Massager (Wireless)",
    image: Image18,
    oldPrice: "₹2,65,000",
    price: "₹2,08,500",
    rating: "4.8",
    reviews: "1,204",
    tag: "Massage Chair",
  },
];

const NeckMassager = () => {
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
    <div className="px-10 py-8 bg-white">
      <h2 className="text-4xl font-bold text-center mb-6 mt-5">
        Neck Massager
      </h2>
      <p className="text-center text-gray-800 mb-6 max-w-5xl mx-auto">
        Discover the best neck massagers designed to relieve tension and promote
        relaxation. Perfect for home and office use.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
        {NeckProducts.map((product) => {
          const qty = getQuantity(product.id);

          return (
            <div
              key={product.id}
              className="border rounded-lg shadow-sm p-4 relative bg-white text-center border-gray-300"
              onClick={() => handleNavigate(product.id)}
            >
              <span className="absolute top-2 right-2 text-transparent bg-clip-text bg-gradient-to-b from-orange-800 to-orange-400 font-semibold">
                Sale
              </span>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3 hover:scale-110 transition"
              />
              <h3 className="text-sm text-gray-600">{product.tag}</h3>
              <div className="text-sm text-yellow-500 mb-1">
                ★ {product.rating}
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviews})
                </span>
              </div>
              <h2 className="text-md font-semibold text-gray-800 mb-1">
                {product.title}
              </h2>
              <div className="mb-2">
                <span className="text-orange-600 font-bold text-sm">
                  {product.price}
                </span>{" "}
                <span className="text-gray-400 line-through text-xs">
                  {product.oldPrice}
                </span>
              </div>

              {qty > 0 ? (
                <div className="flex justify-center items-center space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrement(product.id);
                    }}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span className="font-medium">{qty}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrement(product.id);
                    }}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className="mt-2 bg-black text-white py-1 px-4 text-sm rounded hover:bg-gray-800 hover:scale-110 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Buy Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeckMassager;
