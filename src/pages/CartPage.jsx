import { useSelector, useDispatch } from "react-redux";
import { incrementQty, decrementQty, removeFromCart, clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "/src/Components/ui/button";
import { Trash2, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
          {cart.length > 0 && (
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-10">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet. Let's get you started!</p>
            <Link to="/products" className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items Section */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1 text-center"></div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center relative transition-colors hover:bg-gray-50/30 group"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex items-start gap-5 w-full">
                        <div className="w-24 h-24 bg-white rounded-xl p-2 border border-gray-100 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.title || "Product"}
                            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex flex-col pt-1 pr-8 md:pr-0">
                          <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">{item.title || "Unnamed Product"}</h3>
                          <p className="text-sm font-medium text-gray-500">
                            ₹{getNumericPrice(item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-3 flex justify-start md:justify-center w-full md:w-auto mt-4 md:mt-0">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                          <button
                            onClick={() => dispatch(decrementQty(item.id))}
                            className="w-10 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-12 text-center text-sm font-semibold text-gray-900 border-x border-gray-100 h-full flex items-center justify-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => dispatch(incrementQty(item.id))}
                            className="w-10 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 flex md:justify-end w-full md:w-auto justify-between items-center mt-3 md:mt-0">
                        <span className="md:hidden text-sm font-medium text-gray-500">Total:</span>
                        <span className="font-bold text-gray-900 text-base md:text-lg">
                          ₹{(getNumericPrice(item.price) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <div className="col-span-1 flex justify-end absolute top-4 right-4 md:static md:w-full md:justify-center">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-100"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <Link to="/products" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <ArrowLeft size={16} className="mr-2" />
                  Continue Shopping
                </Link>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center px-4 py-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-900 text-base">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="font-medium">Shipping estimate</span>
                    <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">Free</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div>
                       <span className="block text-base font-bold text-gray-900">Total</span>
                       <span className="text-xs text-gray-500 mt-0.5 block">Including taxes</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                   <ShieldCheck size={18} className="text-green-500" />
                   Secure Checkout Guarantee
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
