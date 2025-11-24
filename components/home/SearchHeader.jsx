"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";


// 👉 LOCAL CATEGORY LIST
const categories = [
    { title: "Healthcare Services", slug: "healthcare-services" },
    { title: "Education & Learning", slug: "education-and-coaching" },
    { title: "Real Estate", slug: "real-estate-and-properties" },
    { title: "Hotels & Resorts", slug: "hotels-and-resorts" },
    { title: "Restaurants & Cafes", slug: "restaurants-and-cafes" },
    { title: "Travel & Tourism", slug: "travel-and-tourism-services" },
    { title: "Beauty & Wellness", slug: "salons-spas-and-wellness" },
];

export default function HomeSearchHeader() {

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [district, setDistrict] = useState("Bhubaneswar");

    const rotatingWords = [
        "Local Businesses",
        "Verified Services",
        "Top Vendors",
        "Shops & Stores",
        "Professionals",
        "Agencies",
        "Companies",
    ];


    const [index, setIndex] = useState(0);

    // 👉 FILTER SUGGESTIONS LOCALLY BASED ON QUERY
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const filtered = categories.filter((cat) =>
            cat.title.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
            setSuggestions(filtered);
        } else {
            setSuggestions([{ noMatch: true }]);
        }
    }, [query]);

    // 👉 ROTATING WORD ANIMATION
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // 👉 FORM SUBMIT (ONLY WORKS IF USER ENTERS EXACT CATEGORY)
    const handleSubmit = (e) => {
        e.preventDefault();
        const found = categories.find(
            (cat) => cat.title.toLowerCase() === query.toLowerCase()
        );

        if (found) {
            window.location.href = `/category/${found.slug}`;
        } else {
            toast.error("Please select a valid category!");
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-start justify-between py-4 md:pl-18 md:pt-6 gap-6 md:gap-0">

            {/* LEFT SIDE */}
            <div className="w-full md:w-auto">
                {/* HEADING */}
                <h1 className="pl-2 sm:pl-0 text-lg sm:text-xl md:text-3xl font-bold text-gray-800 flex flex-wrap gap-2 sm:gap-3 leading-snug">
                    Search across
                    <span className="text-blue-600 font-bold">1,000+</span>

                    <div className="relative inline-block min-w-40 sm:min-w-[220px] h-[1.6em] overflow-hidden pt-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute left-0 right-0 text-green-600 font-bold"
                            >
                                {rotatingWords[index]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </h1>


                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-3 flex w-full md:w-[650px] border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg"
                >
                    {/* DISTRICT SELECT */}
                    <div className="relative flex items-center w-1/3 border-r border-gray-200 bg-white">
                        <MdLocationOn className="absolute left-3 text-blue-600 text-xl" />

                        <Select value={district} onValueChange={setDistrict}>
                            <SelectTrigger className="w-full pl-10 border-none shadow-none focus:ring-0 focus:outline-none rounded-none bg-transparent py-2 sm:py-3 text-sm sm:text-base">
                                <SelectValue placeholder="Select District" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* SEARCH FIELD */}
                    <div className="relative flex items-center w-2/3">
                        <input
                            type="text"
                            placeholder="Search categories…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                            className="w-full py-2 sm:py-3 px-3 sm:px-4 pr-20 text-gray-700 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <button
                            type="submit"
                            className="absolute right-1 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-5 py-2 flex items-center gap-1 sm:gap-2 rounded-md text-sm sm:text-base shadow-sm hover:shadow-md"
                        >
                            <FiSearch className="text-base sm:text-lg" />
                            <span className="hidden sm:block">Search</span>
                        </button>
                    </div>
                </form>

                {/* DROPDOWN */}
                <div className="relative w-full">
                    {suggestions.length > 0 && (
                        <ul className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                            <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b bg-gray-50">
                                Suggestions
                            </div>

                            {suggestions.map((cat, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                        if (!cat.noMatch)
                                            window.location.href = `/category/${cat.slug}`;
                                    }}
                                    className={`flex items-center px-4 py-3 ${cat.noMatch
                                        ? "bg-red-50 text-red-500"
                                        : "hover:bg-gray-100 cursor-pointer"
                                        } text-sm transition-colors duration-150`}
                                >
                                    {cat.noMatch ? (
                                        <p>No matching category found</p>
                                    ) : (
                                        <>
                                            <div className="shrink-0 w-6 h-6 bg-green-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                                                ➜
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-semibold">{cat.title}</p>
                                                <p className="text-gray-400 text-xs">Category</p>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE DOWNLOAD BUTTONS */}
            <div className="flex flex-col items-center md:pr-18 lg:mt-10 w-full md:w-auto">
                <div className="flex gap-3 items-center mt-2 sm:mt-4">
                    <button
                        onClick={() => toast.error("Android App is coming soon!")}
                        className="transition-transform hover:scale-105"
                    >
                        <img src="/images/getapp_appstore.avif" alt="Get App" className="h-9 sm:h-10" />
                    </button>

                    <button
                        onClick={() => toast.error("iOS App coming soon!")}
                        className="transition-transform hover:scale-105"
                    >
                        <img src="/images/getapp_googleplay.avif" alt="Play Store" className="h-9 sm:h-10" />
                    </button>
                </div>
            </div>
        </div>
    );

}
