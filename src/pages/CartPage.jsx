import { useSelector, useDispatch } from "react-redux";
import { incrementQty, decrementQty, removeFromCart, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "/src/Components/ui/button";
import { Trash2, ShoppingBag } from "lucide-react";
export default function CartPage() {
  const cart = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Safe numeric conversion function
  const getNumericPrice = (price) => {
    if (price == null) return 0; // handles undefined or null
    const cleaned = price.toString().replace(/[₹,]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const subtotal = Array.isArray(cart)
    ? cart.reduce(
      (sum, item) => sum + getNumericPrice(item.price) * (item.quantity || 1),
      0
    )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg">Your cart is empty 🛒</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4"
              >
                {/* Remove */}
                <button
                  className="text-gray-400 hover:text-red-500 text-lg"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <Trash2 size={20} />
                </button>

                {/* Image */}
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title || "Product"}
                  className="w-20 h-20 rounded  object-contain"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title || "Unnamed Product"}</h3>
                  <p className="text-sm text-gray-500">
                    Price: ₹{getNumericPrice(item.price).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => dispatch(decrementQty(item.id))}
                        className="px-3 py-1 text-lg font-bold text-red-800"
                      >
                        −
                      </button>
                      <span className="px-4">{item.quantity || 1}</span>
                      <button
                        onClick={() => dispatch(incrementQty(item.id))}
                        className="px-3 py-1 text-lg text-green-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                    {/* Subtotal */}
                    <span className="font-bold text-orange-600">
                      ₹{(getNumericPrice(item.price) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                variant="destructive"
                onClick={() => dispatch(clearCart())}
                className="sm:ml-auto"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Cart Totals</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
