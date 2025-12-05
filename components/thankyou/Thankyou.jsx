"use client";

import { motion } from "framer-motion";
import { Check, Home, ListChecks, ArrowRight } from "lucide-react";
import Link from "next/link";

const Sparkles = () => {
    const sparkleArray = Array.from({ length: 18 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sparkleArray.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.4, 1, 0.4],
                        y: [0, -70],
                        x: [0, Math.random() * 60 - 30],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                    className="absolute w-1.5 h-1.5 bg-white/80 rounded-full shadow"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                ></motion.div>
            ))}
        </div>
    );
};

export default function PremiumConfirmation() {
    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">

            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-indigo-600 to-blue-500"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl"></div>

            <Sparkles />

            {/* CARD */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="
                    relative z-20 w-[90%] max-w-xl bg-white shadow-2xl rounded-3xl 
                    p-6 sm:p-8 
                    flex flex-col
                "
            >
                {/* SUCCESS ICON */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 130, damping: 12 }}
                    className="
                        mx-auto 
                        w-16 h-16 sm:w-24 sm:h-24 
                        bg-green-500 rounded-full 
                        flex items-center justify-center shadow-lg
                    "
                >
                    <Check className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                </motion.div>

                {/* TITLE */}
                <h2 className="
                    text-center 
                    text-sm sm:text-2xl 
                    font-bold mt-4 text-gray-900
                ">
                    Your Listing is Submitted 🎉
                </h2>

                {/* SUBTEXT */}
                <p className="
                    text-center 
                    text-gray-600 
                    text-xs sm:text-base 
                    mt-2
                ">
                    Review usually takes <b>24–48 hours</b>. Keep your phone open to receive updates.
                </p>

                {/* INFO BOX */}
                <div
                    className="
        mt-5 sm:mt-6 
        bg-gray-50 p-4 sm:p-5 
        rounded-xl border 
        text-xs sm:text-sm 
        text-gray-700
    "
                >
                    <div className="space-y-3">

                        {/* Feature Items */}
                        {[
                            "Verified Blue Tick",
                            "Smart Dashboard",
                            "Update Photos Anytime",
                            "Direct Leads & Reviews",
                            "Showcase Services & Pricing",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-2">
                                {/* Green Tick Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-circle-check-big mt-0.5 h-4 w-4 sm:h-5 sm:w-5 text-emerald-600"
                                >
                                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                    <path d="m9 11 3 3L22 4"></path>
                                </svg>

                                <span className="leading-tight">{item}</span>
                            </div>
                        ))}

                        {/* Separator */}
                        <div className="border-t border-gray-200 my-2"></div>

                    </div>
                </div>


                {/* Buttons */}
                <div className="mt-4 flex flex-col justify-center sm:flex-row gap-3">
                    <Link
                        href="/user/dashboard"
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition text-center"
                    >
                        <ListChecks className="w-4 h-4 inline-block mr-2" />
                        Manage Your Listing
                    </Link>

                    <Link
                        href="/"
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 transition text-center"
                    >
                        <Home className="w-4 h-4 inline-block mr-2" />
                        Back to Home
                    </Link>
                </div>


                {/* TIP */}
                <p className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4 text-center">
                    Tip: Register more branches after verification.
                </p>
            </motion.div>
        </div>
    );
}
