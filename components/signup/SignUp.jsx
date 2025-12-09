"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/loader/Loader";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Signup() {
    const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [unmetRules, setUnmetRules] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const passwordRules = [
        { id: 1, label: "At least 1 uppercase letter", regex: /[A-Z]/ },
        { id: 2, label: "At least 1 lowercase letter", regex: /[a-z]/ },
        { id: 3, label: "At least 1 special character", regex: /[@$!%*?&]/ },
        { id: 4, label: "At least 1 number", regex: /\d/ },
        { id: 5, label: "At least 8 characters", regex: /^.{8,}$/ },
    ];



    useEffect(() => {
        const unmet = passwordRules.filter((rule) => !rule.regex.test(form.password));
        setUnmetRules(unmet);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            form.name &&
            emailRegex.test(form.email) &&
            unmet.length === 0 &&
            form.password === form.confirmPassword &&
            form.terms
        ) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [form]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid) {
            toast.warn("Please fill all fields correctly");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post('/api/signup', form);

            if (response.status === 201) {
                toast.success("Signup successful!");
                router.push("/admin/login");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("User already exists!");
            } else {
                toast.error("Signup failed, try again.");
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

                    {/* Left Section */}
                    <div className="w-full md:w-1/2 p-4 md:p-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Link href="/">
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="w-full h-10 object-contain animate-fade-in"
                                    loading="lazy"
                                />
                            </Link>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h2>

                        <span className="text-gray-400 text-sm">Sign up to explore powerful features.</span>

                        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>

                            {/* Name */}
                            <div className="space-y-1">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        onFocus={() => setPasswordTouched(true)}
                                        placeholder="Password"
                                        required
                                        className="pl-9"
                                    />
                                    <span className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </span>

                                    {/* Unmet password rule */}
                                    {passwordTouched &&
                                        (() => {
                                            const firstUnmet = passwordRules.find((r) => !r.regex.test(form.password));
                                            return firstUnmet ? (
                                                <p className="text-sm text-red-500 mt-1">{firstUnmet.label}</p>
                                            ) : null;
                                        })()}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        required
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    id="terms"
                                    checked={form.terms}
                                    onCheckedChange={(checked) => setForm({ ...form, terms: checked })}
                                />
                                <Label htmlFor="terms" className="text-gray-600">
                                    I agree to the{" "}
                                    <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
                                </Label>
                            </div>


                            {/* Submit Button */}
                            <Button
                                disabled={!isValid}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Create Account
                            </Button>

                        </form>

                        <p className="text-center text-sm text-gray-500">
                            Already have account !{" "}
                            <Link href="/admin/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex w-full md:w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-10 space-y-6">
                        <motion.img
                            src="/images/signup.png"
                            className="w-full h-80 object-contain"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: [0, -10, 0] }}
                            transition={{ y: { duration: 3, repeat: Infinity } }}
                        />

                        <div className="flex items-center justify-center space-x-6">
                            <img src="/images/facebook_icons.png" className="w-10 h-10 bg-white rounded-full p-2" />
                            <img src="/images/Google__G__logo.png" className="w-10 h-10 bg-white rounded-full p-2" />
                            <img src="/images/github_icons.png" className="w-10 h-10 bg-white rounded-full p-2" />
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">Connect with every application</h3>
                            <p className="text-white/80 text-sm">Easy, powerful dashboard tools.</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
