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
    if (!form.email) newErrors.email = "Email is required";
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

          dispatch(clearCart());
          toast.success(`Payment successful! Order ${orderNumber} placed.`);
          navigate("/");
        } catch {
          toast.error("Payment succeeded, but order update failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function (response) {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paymentStatus: "failed",
        status: "Pending",
      });

      toast.error("Payment failed! You can retry later.");
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
        throw new Error(errorData.error || "Cloud Function failed");
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
      console.error(error);
      toast.error("Unable to create order. Try again.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6 md:flex md:gap-10">
      {/* 🏠 Shipping Address */}
      <div className="md:w-1/2 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input name="firstName" placeholder="First Name" onChange={handleChange} className="border rounded p-2 w-full" />
            {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border rounded p-2 w-full" />
            {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
          </div>
        </div>

        <div className="mt-4">
          <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} className="w-full border rounded p-2" />
          {errors.mobileNumber && <p className="text-red-600 text-sm">{errors.mobileNumber}</p>}
        </div>

        <div className="mt-4">
          <input name="email" placeholder="Email Address" onChange={handleChange} className="w-full border rounded p-2" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div className="mt-4">
          <input name="address" placeholder="Street Address" onChange={handleChange} className="w-full border rounded p-2" />
          {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <input name="city" placeholder="City" onChange={handleChange} className="border rounded p-2 w-full" />
            {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
          </div>
          <div>
            <input name="postalCode" placeholder="Postal Code" onChange={handleChange} className="border rounded p-2 w-full" />
            {errors.postalCode && <p className="text-red-600 text-sm">{errors.postalCode}</p>}
          </div>
        </div>
      </div>

      {/* 🛍️ Order Summary */}
      <div className="md:w-1/2 bg-gray-50 p-6 rounded shadow mt-10 md:mt-0">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Order Summary</h2>

        <div className="text-sm mb-4">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between border-b pb-2 mt-2"><span>Shipping</span><span className="text-green-600 font-medium">Free Shipping</span></div>
          <div className="flex justify-between font-bold mt-2"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>

        <div className="mt-6 border-t pt-4 space-y-4 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="text-sm">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-red-600">₹{getNumericPrice(item.price).toLocaleString()} × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handlePlaceOrder} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 font-semibold rounded transition">
          Pay & Place Order
        </button>
      </div>
    </div>
  );
}
