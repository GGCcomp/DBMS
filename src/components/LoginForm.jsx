"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { messaging, getToken } from "@/lib/firebase";
import "react-toastify/dist/ReactToastify.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = searchParams.get("login");
  const title = login
    ? `${login.charAt(0).toUpperCase() + login.slice(1)} Login`
    : "Login";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
    });

    if (!token) {
      toast.error("Unable to generate FCM token.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      fcmToken: token
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 px-10">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/3 p-8 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">
          {title}
        </h2>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center pt-4">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function SuspendedLoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
