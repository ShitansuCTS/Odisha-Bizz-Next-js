"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    title: "Connect With Odisha’s Top Professionals",
    subtitle: "Find trusted experts and services across every industry.",
    btnText: "Get Best Quotes",
    img: "/images/real-estate.jpg",
  },
  {
    title: "Grow Your Business Across Odisha",
    subtitle: "Partner with verified vendors and expand smarter.",
    btnText: "Explore Opportunities",
    img: "/images/Finance_Banking.webp",
  },
  {
    title: "Discover Odisha’s Leading Services",
    subtitle: "Explore businesses, products, and solutions near you.",
    btnText: "Start Exploring",
    img: "/images/Education-Learning.avif",
  },
];


const categories = [
  {
    title: "Education & Coaching",
    description: "Find trusted institutes and coaching centers near you.",
    img: "/images/Education-Learning.avif",
    slug: "education-and-coaching",
  },
  {
    title: "Salons, Spas & Wellness",
    description: "Discover top salons, spas, and wellness spots.",
    img: "/images/spa.webp",
    slug: "salons-spas-and-wellness",
  },
  {
    title: "Travel & Tourism Services",
    description: "Hospitals, Clinics & Doctors",
    img: "/images/travel-and-tourism.webp",
    slug: "healthcare",
  },
  {
    title: "Restaurants & Cafes",
    description: "Builders, Agents & Property Services",
    img: "/images/restaurant-and-cafe.webp",
    slug: "restaurants-and-cafes",
  },
];

export default function HomeBanner() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Auto slide
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:pl-18 md:pr-18 md:pb-7">
      {/* LEFT: Slider */}
      <div className="relative w-full md:w-2/3 h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
        {slides.map((slide, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: current === idx ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-8 md:p-12 text-white">
              <p className="text-lg md:text-xl opacity-90 mb-1 font-medium">
                {slide.subtitle}
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
                {slide.title}
              </h2>
              <Link href="/contact">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md w-fit shadow-md transition">
                  {slide.btnText}
                </button>
              </Link>

            </div>
          </motion.div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${current === i ? "bg-white" : "bg-gray-400/60"
                }`}
            />
          ))}
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setPlaying(!playing)}
          className="absolute bottom-3 right-3 bg-black/40 p-2 rounded-full text-white"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>

      {/* RIGHT: Clickable Cards */}
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {categories.map((cat, i) => (
          <Link key={i} href={`/category/${cat.slug}`} className="block">
            <motion.div
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative h-[180px] md:h-[182px] rounded-2xl overflow-hidden shadow-md cursor-pointer group"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              />

              {/* Overlay Content */}
              <div className="relative z-10 p-5 flex flex-col justify-between h-full text-white">
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1">{cat.title}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">{cat.desc}</p>
                </div>
                <div className="mt-4 flex items-center text-sm font-semibold text-yellow-300 group-hover:text-yellow-400 transition">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>

              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
