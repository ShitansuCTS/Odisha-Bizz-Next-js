'use client';

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const services = [
    {
        title: "Real Estate",
        description: "Building dreams, one property  at a property   time.",
        image: "/images/real-estate.jpg",
        link: "/real-estate",
    },
    {
        title: "Healthcare",
        description: "Caring for your health, every step of the way.",
        image: "/images/healthcare.jpg",
        link: "/healthcare",
    },
    {
        title: "Finance & Banking",
        description: "Smart solutions for your financial growth.",
        image: "/images/Finance_Banking.webp",
        link: "/finance",
    },
    {
        title: "Retail & E-commerce",
        description: "Bringing the best products to your doorstep.",
        image: "/images/Retail_E-commerce.jpg",
        link: "/retail",
    },
    {
        title: "Hospitality & Tourism",
        description: "Creating memorable experiences around the world.",
        image: "/images/Hospitality_Tourism.jpg",
        link: "/tourism",
    },
    {
        title: "Manufacturing & Industrial",
        description: "Powering progress through innovation and efficiency.",
        image: "/images/manufacturing.webp",
        link: "/manufacturing",
    },
    {
        title: "Energy & Utilities",
        description: "Sustaining the future with clean and smart energy.",
        image: "/images/Energy_Utilities.avif",
        link: "/energy",
    },
    {
        title: "Transportation & Logistics",
        description: "Delivering efficiency across every mile.",
        image: "/images/Transportation_Logistics.webp",
        slug: "transportation-and-logistics",
    },
    {
        title: "Media & Entertainment",
        description: "Inspiring creativity and connecting people worldwide.",
        image: "/images/Media-Entertainment.jpg",
        link: "/media",
    },
    {
        title: "Agriculture & Food",
        description: "Cultivating growth from farm to table.",
        image: "/images/Agriculture_Food.webp",
        link: "/agriculture",
    },
    {
        title: "Jewellery",
        description: "Crafting elegance that defines your style.",
        image: "/images/jewellery.webp",
        link: "/jewellery",
    },
    {
        title: "Education & Learning",
        description: "Empowering minds through innovative education.",
        image: "/images/Education-Learning.avif",
        link: "/education",
    },
    {
        title: "Technology & Innovation",
        description: "Innovating the future, one idea at a time.",
        image: "/images/Technology-Innovation.avif",
        link: "/technology",
    },
];

export default function Category() {
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
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: idx * 0.2,
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                        >
                            <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 flex flex-col h-full pt-0 pb-0">
                                <div className="relative w-full h-48 overflow-hidden bg-green-400">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <CardContent className="flex flex-col justify-between flex-1 p-6 pt-0">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-2">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Link
                                           href={`/category/${service.slug}`}
                                            className="flex items-center gap-2 bg-[#249732] hover:bg-green-600 text-white rounded-full px-5 py-2 shadow-md transition-all duration-300"
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
