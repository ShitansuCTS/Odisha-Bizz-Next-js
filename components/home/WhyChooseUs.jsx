"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShieldCheck, Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        title: "Trusted & Secure",
        desc: "We prioritize your safety and security in every solution we deliver.",
        icon: <ShieldCheck className="w-6 h-6 text-[#219830]" />,
    },
    {
        title: "Expert Team",
        desc: "Our team consists of skilled professionals with years of experience.",
        icon: <Users className="w-6 h-6 text-[#012a7a]" />,
    },
    {
        title: "Top Quality",
        desc: "We maintain the highest standards to ensure top-quality products.",
        icon: <Star className="w-6 h-6 text-[#219830]" />,
    },
    {
        title: "Proven Results",
        desc: "Our clients achieve measurable growth and success with our solutions.",
        icon: <TrendingUp className="w-6 h-6 text-[#012a7a]" />,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-10 px-6 md:px-12 lg:px-24 bg-white">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug">
                    Why Choose Us
                </h2>
                <p className="text-gray-600 mt-3 text-base md:text-lg">
                    Discover the reasons why clients trust us to deliver exceptional value and results.
                </p>
            </div>

            {/* Features Grid with Staggered Animation */}
            <motion.div
                className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} delay={index * 0.2} />
                ))}
            </motion.div>
        </section>
    );
}

// FeatureCard Component
function FeatureCard({ title, desc, icon, delay }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Card
                className={`bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center h-full border border-gray-200 transition-transform duration-300 ${hovered ? "shadow-xl" : ""
                    }`}
            >
                <div
                    className={`mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 transition-all duration-300 ${hovered ? "scale-110" : "scale-100"
                        }`}
                >
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{desc}</p>
            </Card>
        </motion.div>
    );
}
