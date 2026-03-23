"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const womenServices = [
    { name: "Hotels & Resorts", icon: "/icons/review.png", slug: "/category/hotels-and-resorts" },
    { name: "Healthcare", icon: "/icons/healthcare.png", slug: "/category/healthcare-services" },
    { name: "Spa & Wellness", icon: "/icons/spa.png", slug: "/category/salons-spas-and-wellness" },
    { name: "Car Showroom", icon: "/icons/showroom.png", slug: "/category/car-showrooms" },
    { name: "Electronics & Mobile Stores", icon: "/icons/electronics.png" },
    { name: "Sweets & Snacks", icon: "/icons/candy.png", slug: "/category/sweets-and-snacks" },
    { name: "Digital Marketing agency ", icon: "/icons/digital-advertising.png", slug: "/category/digital-marketing-agency" },
    { name: "Interior designers ", icon: "/icons/couch.png", slug: "/category/interior-designers" },
];

const menServices = [
    { name: "Education & Coaching", icon: "/icons/education.png", slug: "/category/education-and-coaching" },
    { name: "Real Estate", icon: "/icons/real-estate.png", slug: "/category/real-estate-and-properties" },
    { name: "Travel & Tourism", icon: "/icons/travel.png", slug: "/category/travel-and-tourism-services" },
    { name: "Tiles And Granite Showrooms ", icon: "/icons/tile.png", slug: "tiles-and-granite-showrooms" },
    { name: "Photography & Videography", icon: "/icons/photography.png", slug: "/category/photography" },
    { name: "Event Planning & Decoration", icon: "/icons/event.png", slug: "/category/event-companies" },
    { name: "Restaurants & Cafes", icon: "/icons/restaurant.png", slug: "/category/restaurants-and-cafes" },
    { name: "Construction companies", icon: "/icons/construction.png", slug: "/category/construction-companies" }
];

export default function Collage() {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const updateScreen = () => setIsMobile(window.innerWidth < 768);
        updateScreen();
        window.addEventListener("resize", updateScreen);
        return () => window.removeEventListener("resize", updateScreen);
    }, []);

    const renderItem = (item, index) => {
        const content = (
            <div
                className="flex flex-col items-center text-center hover:scale-105 transition cursor-pointer"
            >
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 mb-2">
                    <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain"
                    />
                </div>
                <p className="text-sm font-medium">{item.name}</p>
            </div>
        );

        // If item has URL → wrap with Link
        if (item.slug) {
            return (
                <Link key={index} href={item.slug}>
                    {content}
                </Link>
            );
        }

        // Without URL → return normal div
        return (
            <div key={index}>
                {content}
            </div>
        );
    };

    return (
        <div className="w-full px-4 md:px-20 md:py-20 py-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-10">

                {/* Left Section - Trending */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Trending Now</h2>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                        {(isMobile ? womenServices.slice(0, 6) : womenServices.slice(0, 8))
                            .map((item, index) => renderItem(item, index))}
                    </div>
                </div>

                <div className="hidden md:block w-full bg-gray-300"></div>

                {/* Right Section - Popular */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Popular Picks</h2>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                        {(isMobile ? menServices.slice(0, 6) : menServices.slice(0, 8))
                            .map((item, index) => renderItem(item, index))}
                    </div>
                </div>

            </div>
        </div>
    );
}
