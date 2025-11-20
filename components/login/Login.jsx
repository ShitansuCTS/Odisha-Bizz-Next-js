"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import Loader from "@/components/loader/Loader";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";


export default function Login() {
  //   const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();


  useEffect(() => {
    const checkToken = async () => {
      await checkAuth(); // updates the store
      if (useAuthStore.getState().isAuthenticated) {
        router.replace("/admin/dashboard");
      }
    };
    checkToken();
  }, [router, checkAuth]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/login", form, { withCredentials: true });

      if (response.status === 200) {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
        // Update the store based on token in cookie
        await checkAuth();

        // Redirect after store updates
        if (useAuthStore.getState().isAuthenticated) {
          router.replace("/admin/dashboard");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) toast.error("Invalid email or password");
        else if (status === 400) toast.error("All fields are required");
        else toast.error("Login failed. Please try again.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading && <Loader />}

      <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-lg bg-white md:flex-row flex-col">

          {/* Left */}
          <div className="w-full md:w-1/2 p-10">
            <div className="flex items-center gap-2 mb-8">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-full h-10 object-contain animate-fade-in"
                loading="lazy"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Log in to your Account
            </h2>
            <p className="text-gray-500 mb-6">
              Welcome back! Select method to log in:
            </p>

            <div className="flex items-center justify-between gap-4 mb-6">
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm flex items-center justify-center gap-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={() => toast.error("Social Login not Enabled yet !")}
              >
                <img src="/images/Google__G__logo.png" className="w-4 h-4" />
                Google
              </Button>

              <Button
                variant="outline"
                className="flex-1 h-10 text-sm flex items-center justify-center gap-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={() => toast.error("Social Login not Enabled yet !")}
              >
                <img src="/images/facebook_icons.png" className="w-4 h-4" />
                Facebook
              </Button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-x-0 h-px bg-gray-200"></div>
              <span className="relative bg-white px-3 text-gray-400 text-sm">
                or continue with email
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="pl-9"
                  />

                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <Label>Remember me</Label>
                </div>

                <Link href="/admin/forgot-password" className="text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Log in
              </Button>

              <p className="text-center text-sm text-gray-500">
                Don’t have an account?{" "}
                <Link href="/admin/signup" className="text-blue-600 hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </div>

          {/* Right */}
          <div className="w-full md:w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-10 space-y-6">
            <motion.img
              src="/images/login.png"
              className="w-full h-80 object-contain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                y: { duration: 3, ease: "easeInOut", repeat: Infinity },
              }}
            />

            <div className="flex items-center justify-center space-x-6">
              <img src="/images/facebook_icons.png" className="w-10 h-10 bg-white rounded-full p-2" />
              <img src="/images/Google__G__logo.png" className="w-10 h-10 bg-white rounded-full p-2" />
              <img src="/images/github_icons.png" className="w-10 h-10 bg-white rounded-full p-2" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                Connect with every application.
              </h3>
              <p className="text-white/80 text-sm">
                Everything you need in an easily customizable dashboard.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
