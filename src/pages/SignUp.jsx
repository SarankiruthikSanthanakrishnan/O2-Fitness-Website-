import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setMessage("");
    try {
      // Create user with Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Send email verification
      await sendEmailVerification(userCred.user, {
        url: `${window.location.origin}/login?verified=true`,
        handleCodeInApp: false,
      });

      // Store user data in Firestore with default role
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: data.email,
        createdAt: new Date().toISOString(),
        uid: userCred.user.uid,
        role: "User", // ✅ Role added here
      });

      setMessage("Account created! Verification email sent.");
      reset();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store Google user in Firestore if not already present
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        provider: "google",
        createdAt: new Date().toISOString(),
        role: "User", // ✅ Role added here too
      });

      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input
            type="email"
            placeholder="Email"
            className={`w-full mb-3 px-4 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            className={`w-full mb-4 px-4 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-3 border border-gray-300 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        {message && <p className="text-center text-sm mt-4 text-green-500">{message}</p>}

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
