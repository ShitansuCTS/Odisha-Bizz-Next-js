"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const cities = [
    { name: "Chennai", image: "/images/cities/chennai.webp" },
    { name: "Mumbai", image: "/images/cities/mumbai.webp" },
    { name: "Pune", image: "/images/cities/pune.webp" },
    { name: "Ahemdabad", image: "/images/cities/ahemdabad.webp" },
    { name: "Delhi", image: "/images/cities/delhi.webp" },
    { name: "Jaipur", image: "/images/cities/jaipur.webp" },
    { name: "Kolkata", image: "/images/cities/kolkata.webp" },
    { name: "Hyderabad", image: "/images/cities/hyderabad.webp" },
    { name: "Agra", image: "/images/cities/agra.webp" },
    { name: "Lucknow", image: "/images/cities/lucknow.webp" },

];

export default function Cities() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const [sliderRef, slider] = useKeenSlider({
        loop: false,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        slides: {
            perView: 1.5,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 480px)": { slides: { perView: 2, spacing: 16 } },
            "(min-width: 768px)": { slides: { perView: 3, spacing: 20 } },
            "(min-width: 1024px)": { slides: { perView: 4, spacing: 24 } },
            "(min-width: 1280px)": { slides: { perView: 5, spacing: 24 } },
        },
    });

    return (
        <div className="w-full py-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
                Our Upcoming Cities
            </h2>
            <p className="text-center text-gray-600 mb-8">
                Expanding our presence to serve you in more cities soon.
            </p>


            <div className="max-w-7xl mx-auto px-4 relative">
                {/* Slider */}
                <div ref={sliderRef} className="keen-slider">
                    {cities.map((city, index) => (
                        <div key={index} className="keen-slider__slide">
                            <Card className="shadow-lg transition duration-300 overflow-hidden  p-0 rounded-sm">
                                <div className="relative w-full rounded-sm">
                                    <img
                                        src={city.image}
                                        alt={city.name}
                                        className="w-full h-auto object-contain rounded-sm"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/60 to-transparent p-2 text-white font-semibold text-sm text-center">
                                        {city.name}
                                    </div>
                                </div>



                            </Card>
                        </div>
                    ))}
                </div>



                {/* DOTS */}
                <div className="flex justify-center mt-6 gap-3">
                    {cities.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => slider.current?.moveToIdx(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${currentSlide === idx
                                ? "bg-green-600 scale-125"
                                : "bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
