'use client';

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

const services = [
    {
        title: "Hotels & Resorts",
        description: "Experience luxury and comfort while creating unforgettable memories.",
        image: "/images/hotel-and-resort.webp",
        slug: "hotels-and-resorts",
    },
    {
        title: "Healthcare",
        description: "Trusted healthcare services dedicated to your well-being.",
        image: "/images/healthcare.jpg",
        slug: "healthcare-services",
    },
    {
        title: "Restaurants & Cafes",
        description: "Savor delicious meals and relaxing ambiance at top eateries.",
        image: "/images/restaurant-and-cafe.webp",
        slug: "restaurants-and-cafes",
    },
    {
        title: "Travel & Tourism Services",
        description: "Discover and explore amazing destinations with ease.",
        image: "/images/travel-and-tourism.webp",
        slug: "travel-and-tourism-services",
    },
    {
        title: "Real Estate",
        description: "Find, showcase, and manage properties seamlessly.",
        image: "/images/real-estate.jpg",
        slug: "real-estate-and-properties",
    },
    {
        title: "Education & Coaching",
        description: "Find trusted institutes and coaching centers near you.",
        image: "/images/Education-Learning.avif",
        slug: "education-and-coaching",
    },
    {
        title: "Salons, Spas & Wellness",
        description: "Discover top salons, spas, and wellness spots.",
        image: "/images/spa.webp",
        slug: "salons-spas-and-wellness",
    },




];

export default function Category() {


    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("/api/category");
                if (res.data.success) {
                    setCategories(res.data.categories);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-60 sm:h-[300px] lg:h-[360px] flex items-center justify-center overflow-hidden">
                <img
                    src="/images/Finance_Banking.webp"
                    alt="Background Image"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 text-center text-white px-4"
                >
                    <p className="text-sm sm:text-base text-gray-300 mb-2 tracking-wide">
                        Empowering businesses with technology & innovation
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-lg">
                        Our Category
                    </h1>
                </motion.div>
            </section>
            <div className="w-full py-16 px-6 bg-linear-to-b from-white flex justify-center">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl w-full">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat._id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: idx * 0.1,
                                duration: 0.5,
                            }}
                        >
                            <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 flex flex-col h-full">

                                {/* IMAGE */}
                                <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={cat.imageUrl || "/placeholder.jpg"}
                                        alt={cat.name}
                                        className="w-full h-full object-cover hover:scale-105 transition"
                                    />
                                </div>

                                {/* CONTENT */}
                                <CardContent className="flex flex-col justify-between flex-1 p-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {cat.name}
                                        </h3>

                                        {/* Optional description (if you add later in schema) */}
                                        <p className="text-gray-600 text-sm">
                                            Explore top businesses under {cat.name}
                                        </p>
                                    </div>

                                    {/* LINK */}
                                    <div className="mt-6 flex justify-end">
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="flex items-center gap-2 bg-[#249732] hover:bg-green-600 text-white rounded-full px-5 py-2 shadow-md transition-all"
                                        >
                                            More <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
