import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, ShieldCheck, CreditCard, Check, ShoppingBag, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const cart = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const formatRazorpayError = (error = {}) => {
    const parts = [
      error.code,
      error.reason,
      error.description,
      error.source,
      error.step,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" | ") : "Unknown Razorpay error";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(form.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.postalCode) newErrors.postalCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getNumericPrice = (priceValue) => {
    if (!priceValue) return 0;
    if (typeof priceValue === "number") return priceValue;
    return parseInt(priceValue.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + getNumericPrice(item.price) * (item.quantity || 1),
      0
    );
    return { subtotal, total: subtotal };
  };

  const { subtotal, total } = calculateTotal();

  const generateOrderNumber = async () => {
    const counterRef = doc(db, "counters", "orderCounter");

    return await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let newOrderNum = 1;

      if (counterDoc.exists()) {
        newOrderNum = (counterDoc.data().lastOrderNumber || 0) + 1;
        transaction.update(counterRef, { lastOrderNumber: newOrderNum });
      } else {
        transaction.set(counterRef, { lastOrderNumber: newOrderNum });
      }

      return `O2-${String(newOrderNum).padStart(3, "0")}`;
    });
  };

  // 🔹 Razorpay Payment Handler
  const handlePayment = async (orderNumber, total, orderId, razorpayOrderId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      order_id: razorpayOrderId, // ⭐ Important
      name: "O2 FITNESS HEALTH CARE",
      description: `Order ${orderNumber}`,
      handler: async function (response) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await updateDoc(orderRef, {
            paymentStatus: "paid",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            status: "Confirmed",
          });

          // Set order success view
          setOrderDetails({
             orderNumber,
             total,
             items: [...cart]
          });
          setOrderPlaced(true);
          dispatch(clearCart());
          toast.success(`Payment successful! Order ${orderNumber} placed.`);
        } catch {
          toast.error("Payment succeeded, but order update failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      const razorpayError = response?.error || {};
      console.error("Razorpay payment failed:", razorpayError);

      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paymentStatus: "failed",
        status: "Pending",
        razorpayErrorCode: razorpayError.code || "",
        razorpayErrorReason: razorpayError.reason || "",
        razorpayErrorDescription: razorpayError.description || "",
        razorpayErrorSource: razorpayError.source || "",
        razorpayErrorStep: razorpayError.step || "",
        razorpayErrorMetadata: razorpayError.metadata || {},
      });

      toast.error(`Payment failed: ${formatRazorpayError(razorpayError)}`);
    });

    rzp.open();
  };

  // 🟧 Create order first → then payment
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const orderNumber = await generateOrderNumber();

      const orderData = {
        orderNumber,
        customer: {
          name: `${form.firstName} ${form.lastName}`,
          phone: form.mobileNumber,
          email: form.email,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        items: cart,
        totalAmount: total,
        totalItems: cart.length,
        paymentStatus: "not_paid",
        shipping: "Free Shipping",
        status: "Pending",
        createdAt: Timestamp.now(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // ⭐ Call Cloud Function to create Razorpay Order
      console.log("Using Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID); // 🔍 Debug Log
      console.log("Sending to Razorpay:", { total, orderNumber, totalInPaise: total * 100 });

      const response = await fetch("https://us-central1-o2fitness-5b77f.cloudfunctions.net/createRazorpayOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total, orderNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloud Function Error:", errorData);
        let errorMsg = errorData.error || "Cloud Function failed";
        if (errorData.code) {
          errorMsg += ` (${errorData.code})`;
        }
        if (errorData.details) {
          errorMsg += ` - ${JSON.stringify(errorData.details)}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (!data.order || !data.order.id) {
        throw new Error("Failed to create Razorpay order");
      }
      const razorpayOrderId = data.order.id;

      // ⭐ Save the razorpayOrderId to Firestore BEFORE opening the payment popup
      // This ensures that our Webhook can find the order using razorpayOrderId even if the user drops off
      await updateDoc(doc(db, "orders", orderRef.id), {
        razorpayOrderId: razorpayOrderId
      });

      handlePayment(orderNumber, total, orderRef.id, razorpayOrderId);
    } catch (error) {
      console.error("Unable to create order:", error);
      toast.error(error?.message || "Unable to create order. Try again.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 flex items-center justify-center px-4">
        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
           {/* Success Header with Burst */}
           <div className="px-6 py-10 md:px-10 text-center relative overflow-hidden bg-white">
               {/* Confetti Burst */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                 {Array.from({ length: 24 }).map((_, i) => (
                   <motion.div
                     key={i}
                     className={`absolute w-2 h-2 rounded-full ${['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'][i % 5]}`}
                     initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                     animate={{
                       opacity: 0,
                       scale: [0, 1.2],
                       x: Math.cos((i * 15 * Math.PI) / 180) * 150,
                       y: Math.sin((i * 15 * Math.PI) / 180) * 150,
                     }}
                     transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                   />
                 ))}
               </div>

               {/* Animated Checkmark */}
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
                 className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm relative z-10"
               >
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
               </motion.div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10 tracking-tight">Order Confirmed</h2>
               <p className="text-gray-500 text-sm relative z-10 max-w-xs mx-auto">Thank you for your purchase. We've received your order and are processing it now.</p>
           </div>
           
           {/* Order Details */}
           <div className="px-6 pb-6 md:px-10 md:pb-10 bg-white relative z-10">
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 mb-6">
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                       <span className="text-gray-500">Order number</span>
                       <span className="font-semibold text-gray-900">{orderDetails?.orderNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-gray-500">Date</span>
                       <span className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-gray-500">Payment</span>
                       <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">Successful</span>
                    </div>
                 </div>
                 
                 <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-blue-600">₹{(orderDetails?.total || 0).toLocaleString()}</span>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <h3 className="text-sm font-semibold text-gray-900 flex justify-between items-center">
                   Items Ordered
                   <span className="text-gray-500 font-normal">{orderDetails?.items?.length || 0} items</span>
                 </h3>
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {orderDetails?.items?.map((item, idx) => (
                       <div key={item?.id || idx} className="flex gap-3 items-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg p-1.5 flex items-center justify-center shrink-0 border border-gray-100">
                            <img src={item?.image || "/placeholder.jpg"} alt={item?.title || "Item"} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-medium text-gray-900 text-sm truncate">{item?.title || "Product"}</p>
                             <p className="text-gray-500 text-xs mt-0.5">Qty: {item?.quantity || 1}</p>
                          </div>
                          <div className="font-medium text-gray-900 text-sm shrink-0">₹{getNumericPrice(item?.price || 0).toLocaleString()}</div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                 <button onClick={() => navigate("/")} className="flex-1 flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none">
                   Return to Home
                 </button>
                 <button onClick={() => navigate("/products")} className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none">
                   Continue Shopping
                 </button>
              </div>
           </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* 🏠 Shipping Address */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Details
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input name="firstName" placeholder="First Name" onChange={handleChange} className={`block w-full rounded-xl border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input name="lastName" placeholder="Last Name" onChange={handleChange} className={`block w-full rounded-xl border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                    <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} className={`block w-full rounded-xl border ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.mobileNumber && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.mobileNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <input name="address" placeholder="Street Address" onChange={handleChange} className={`block w-full rounded-xl border ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                  {errors.address && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input name="city" placeholder="City" onChange={handleChange} className={`block w-full rounded-xl border ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.city && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pin Code</label>
                    <input name="postalCode" placeholder="Pin Code" onChange={handleChange} className={`block w-full rounded-xl border ${errors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} px-4 py-3 text-sm transition-colors bg-gray-50/50 focus:bg-white outline-none focus:ring-2 focus:ring-offset-0`} />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🛍️ Order Summary */}
          <div className="w-full lg:w-[400px] xl:w-[450px]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="mb-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-2">
                      <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-sm">₹{getNumericPrice(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-6">
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
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay & Place Order
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                <ShieldCheck size={18} className="text-green-500" />
                Payments secured by Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
