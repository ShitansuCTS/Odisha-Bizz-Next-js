"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/api/forgot-password", { email });
            toast.success("Reset link sent! Check your email.");
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f9f9fc]">
            {/* LEFT SIDE - Illustration */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                <motion.img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/forgot-password-illustration-svg-download-png-3551744.png"
                    alt="Forgot password illustration"
                    className="w-full h-full object-contain"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ y: [-10, 10] }}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                />
            </div>

            {/* RIGHT SIDE - Form */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center px-8 md:px-16 py-10">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <img src="/images/logo.png" alt="Logo" className="w-32 h-auto object-contain" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your Password</h2>
                    <p className="text-gray-500 mb-6">
                        Enter your email below, and we’ll send you a link to reset your password.
                    </p>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-1 relative">
                            <label htmlFor="email" className="text-gray-600 text-sm">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 rounded-md border-gray-300 focus-visible:ring-[#b6985a]"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 hover:bg-indigo-600 text-white text-md py-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            <Send className="w-5 h-5" />
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                    </form>

                    <div className="mt-6 text-center">
                        <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
                            <Link
                                href="/admin/login"
                                className="inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#b6985a] transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
