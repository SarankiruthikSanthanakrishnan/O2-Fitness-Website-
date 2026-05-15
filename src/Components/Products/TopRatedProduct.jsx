import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, incrementQty, decrementQty } from "@/redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import CategoryProductTab from "./CategoryTabs/CategoryProductTab";

const categoryComponents = {
  "Massage Chairs": null, // You can still use separate components if needed
  "Leg & Foot Massager": null,
  "Neck Massager": null,
  "Fitness Massagers": null,
};

const TopRatedProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  // ✅ Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleNavigate = (id) => navigate(`/products/${id}`);
  const handleAddToCart = (product) => dispatch(addToCart(product));
  const handleIncrement = (id) => dispatch(incrementQty(id));
  const handleDecrement = (id) => dispatch(decrementQty(id));

  const getQuantity = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  // ✅ Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const SelectedComponent = categoryComponents[selectedCategory];

  return (
    <div className="px-10 py-8 bg-white">
      <CategoryProductTab
        selectedTab={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      <div className="my-4">{SelectedComponent && <SelectedComponent />}</div>

      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold mb-6 mt-5">
          {selectedCategory === "All" ? "Top Rated Products" : selectedCategory}
        </h2>
        {selectedCategory === "All" && (
          <p className="text-gray-700 mb-6 max-w-5xl mx-auto">
            Trusted by thousands of happy customers, these top-rated products
            are known for their performance, durability, and customer
            satisfaction.
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const quantity = getQuantity(product.id);
            return (
              <div
                key={product.id}
                className="border rounded-lg shadow-sm p-4 relative bg-white text-center border-gray-300"
              >
                <div className="absolute top-2 right-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-b from-orange-800 to-orange-400">
                  Sale
                </div>

                <div
                  onClick={() => handleNavigate(product.id)}
                  className="cursor-pointer"
                >
                  <img
                    src={product.images}
                    alt={product.title}
                    className="w-full h-40 object-contain mb-3 hover:scale-110 transition"
                  />
                  <h2 className="text-md font-semibold text-gray-800 mb-1">
                    {product.title}
                  </h2>
                  <span className="text-gray-900 text-sm">
                    {product.category}
                  </span>
                </div>

                <h3 className="text-sm text-gray-600">{product.tag}</h3>
                <div className="text-sm text-yellow-500 mb-1">
                  ★★★★★ 4.8{" "}
                  <span className="text-xs text-gray-500">(50+ reviews)</span>
                </div>
                <div className="mb-2">
                  <span className="text-orange-600 font-bold text-sm">
                    ₹{product.price}
                  </span>{" "}
                  <span className="text-gray-400 line-through text-xs">
                    ₹{product.originalPrice}
                  </span>
                </div>

                {quantity > 0 ? (
                  <div className="flex justify-center items-center space-x-2 mt-2">
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      –
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="mt-2 bg-black text-white py-1 px-4 text-sm rounded hover:bg-gray-800 hover:scale-110 transition"
                    onClick={() => handleAddToCart(product)}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="col-span-3 text-gray-500">
            No products available in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default TopRatedProduct;
