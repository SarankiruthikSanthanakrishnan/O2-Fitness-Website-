import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { doc, getDoc } from "firebase/firestore";

// ✅ Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      setMessage("✅ Email verified. You can now log in.");
    }
  }, [location]);

  const onSubmit = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      // ✅ Step 1: Firebase authentication
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCred.user;
      const uid = user.uid;

      // ✅ Step 2: Fetch Firestore user document
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // ✅ Step 3: Check admin role and active status
        if (userData.role === "admin" && userData.status === "active") {
          setMessage("✅ Login successful! Redirecting...");
          localStorage.setItem("isAdmin", "true");
          setTimeout(() => navigate("/admindashboard"), 1000);
        } else {
          setMessage("⚠️ Access denied. Only admin users can log in.");
        }
      } else {
        setMessage("❌ No Firestore record found for this user.");
      }
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        setMessage("❌ Invalid email or password.");
      } else if (error.code === "auth/wrong-password") {
        setMessage("❌ Incorrect password. Please try again.");
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-5 text-center text-orange-600">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Admin Email"
            {...register("email")}
            className="w-full mb-2 px-4 py-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-3 px-4 py-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-3">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-600 text-white py-2 mt-3 rounded font-semibold transition ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-orange-700 cursor-pointer"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">
          Only authorized <span className="font-semibold">admin</span> users can
          access the dashboard.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
