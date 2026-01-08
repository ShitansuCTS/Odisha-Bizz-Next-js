"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useResultStore } from "@/store/useResultStore";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import {
    Phone,
    Mail,
    MapPin
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaGlobe,
    FaWhatsapp,
    FaStar,
} from "react-icons/fa6";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";

import Loader from "@/components/loader/Loader";
import Link from "next/link";
import Slider from "../slider/Slider";

export default function CategoryListingPage({ categorySlug }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 🔥 Category-wise slider images
    const sliderImageMap = {
        "healthcare-services": [
            "/images/healthcare.jpg",
            "/images/health-2.jpg",
            "/images/health-3.jpg",
        ],
        "real-estate-and-properties": [
            "/images/realesat-2.webp",
            "/images/realesat-3.webp",
            "/images/real-estate.jpg",
        ],
        "salons-spas-and-wellness": [
            "/images/spa.webp",
            "/images/spa-2.webp",
            "/images/spa-3.webp",
        ],
        "restaurants-and-cafes": [
            "/images/cafe-2.webp",
            "/images/cafe-3.webp",
            "/images/restaurant-and-cafe.webp",
        ],
        "education-and-coaching": [
            "/images/Education-Learning.avif",
            "/images/education-2.webp",
            "/images/education-3.webp",
        ],
        "travel-and-tourism-services": [
            "/images/travel-2.webp",
            "/images/travel-3.webp",
            "/images/travel-and-tourism.webp",
        ],
        "hotels-and-resorts": [
            "/images/hotel-and-resort.webp",
            "/images/hotel-2.webp",
            "/images/hotel-3.webp",
        ],
        // add more categories as needed
    };


    const { mainListings, related, otherListings, loading, fetchResults } = useResultStore();
    // ✅ Default district set to Khordha
    const [district, setDistrict] = useState("Khordha");
    const [selectedDistrict, setSelectedDistrict] = useState("Khordha");
    const sliderImages = sliderImageMap[categorySlug] || [];



    useEffect(() => {
        if (!categorySlug || !district) return;

        // fetch only – do NOT modify URL
        fetchResults(district, categorySlug);

    }, [district, categorySlug]);




    const badgeColors = [
        "from-indigo-500 to-blue-500",
        "from-pink-500 to-red-400",
        "from-green-600 to-teal-400",
        "from-yellow-400 to-orange-400",
        "from-purple-600 to-rose-400",
        "from-fuchsia-500 to-cyan-400",
    ];

    const getBadgeColor = (cat) => {
        let idx =
            cat && cat.length > 0
                ? cat
                    .split("")
                    .map((c) => c.charCodeAt(0))
                    .reduce((a, b) => a + b, 0) % badgeColors.length
                : 0;
        return badgeColors[idx];
    };






    return (
        <>
            {loading && <Loader />}
            <Slider images={sliderImages} />
            {/* HEADER */}
            <div className="px-6 md:px-16 bg-gray-100 shadow-md py-3 flex items-center justify-between">
                {/* <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                    Top 10{" "}
                    <span className="text-green-600"> {categorySlug ? categorySlug.replace(/-/g, " ") : ""}</span>{" "}
                    in <span className="text-blue-600">Bhubaneswar</span>
                </h2> */}
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                    Top 10{" "}
                    <span className="text-green-600">
                        {categorySlug
                            ? categorySlug
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())
                            : ""}
                    </span>{" "}
                    in <span className="text-blue-900">Bhubaneswar</span>
                </h2>



                {/* <div className="flex gap-2">
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                        <SelectTrigger className="w-40 h-10">
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts.map((d) => (
                                <SelectItem key={d} value={d}>
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={() => setDistrict(selectedDistrict)}>Your District</Button>
                </div> */}
            </div>

            {/* MAIN + SIDEBAR */}
            <div className="flex flex-col md:flex-row gap-10 py-4 px-2 md:px-14 w-full bg-gray-100 min-h-screen">
                {/* LEFT SIDE LISTINGS */}
                <section className="flex-1 flex flex-col gap-8">
                    {mainListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-gray-200">
                            <Image
                                src="/images/data-not-found.png"
                                alt="No products"
                                loading="lazy"
                                width={160}
                                height={160}
                                className="w-40 h-40 mb-4 opacity-80"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">
                                No Listing Found
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Try checking another category or come back later.
                            </p>
                        </div>
                    ) : (
                        mainListings.map((item, idx) => (
                            <Card
                                key={idx}
                                className="rounded-xs border border-muted bg-white shadow-sm p-5 flex flex-col transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-4 w-full">

                                    {/* Image */}
                                    <div className="w-full md:w-44 h-40 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        {item.imageUrl ? (
                                            <Image
                                                height={40}
                                                width={100}
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 w-full">

                                        {/* Badge */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Badge
                                                        className={`capitalize px-3 py-0.5 text-xs mb-2 text-white border-0 shadow-md cursor-pointer ${getBadgeColor(
                                                            item.category
                                                        )}`}
                                                    >
                                                        {item.category}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Category: {item.category}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        {/* Title & Verified Badge */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">

                                            <div className="flex items-center gap-2 w-full">
                                                {/* Index */}
                                                <span className="text-lg font-bold text-black">{idx + 1}.</span>

                                                {/* Title + Verified badge */}
                                                <h2 className="flex items-center gap-1 font-semibold text-neutral-900 
                   text-lg sm:text-2xl flex-1">
                                                    {/* Title text */}
                                                    <span className="wrap-break-words sm:whitespace-normal">
                                                        {item.title}
                                                    </span>

                                                    {/* Verified badge */}
                                                    {item.status === "pending" && (
                                                        <span className="shrink-0 flex items-center justify-center w-5 h-5  rounded-full ml-1">
                                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" class="text-blue-600" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M10.007 2.10377C8.60544 1.65006 7.08181 2.28116 6.41156 3.59306L5.60578 5.17023C5.51004 5.35763 5.35763 5.51004 5.17023 5.60578L3.59306 6.41156C2.28116 7.08181 1.65006 8.60544 2.10377 10.007L2.64923 11.692C2.71404 11.8922 2.71404 12.1078 2.64923 12.308L2.10377 13.993C1.65006 15.3946 2.28116 16.9182 3.59306 17.5885L5.17023 18.3942C5.35763 18.49 5.51004 18.6424 5.60578 18.8298L6.41156 20.407C7.08181 21.7189 8.60544 22.35 10.007 21.8963L11.692 21.3508C11.8922 21.286 12.1078 21.286 12.308 21.3508L13.993 21.8963C15.3946 22.35 16.9182 21.7189 17.5885 20.407L18.3942 18.8298C18.49 18.6424 18.6424 18.49 18.8298 18.3942L20.407 17.5885C21.7189 16.9182 22.35 15.3946 21.8963 13.993L21.3508 12.308C21.286 12.1078 21.286 11.8922 21.3508 11.692L21.8963 10.007C22.35 8.60544 21.7189 7.08181 20.407 6.41156L18.8298 5.60578C18.6424 5.51004 18.49 5.35763 18.3942 5.17023L17.5885 3.59306C16.9182 2.28116 15.3946 1.65006 13.993 2.10377L12.308 2.64923C12.1078 2.71403 11.8922 2.71404 11.692 2.64923L10.007 2.10377ZM6.75977 11.7573L8.17399 10.343L11.0024 13.1715L16.6593 7.51465L18.0735 8.92886L11.0024 15.9999L6.75977 11.7573Z"></path></svg>
                                                        </span>
                                                    )}
                                                </h2>
                                            </div>

                                            {/* Rating */}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="hidden sm:flex items-center gap-2 bg-[#007A0C] text-white px-2.5 py-0.5 rounded-full text-sm font-medium shadow-sm cursor-default w-fit">
                                                            <FaStar className="text-white" />
                                                            <span>{(Math.random() * (5 - 3.5) + 3.5).toFixed(1)}</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Average user rating</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                        </div>
                                        <Separator className="mb-2" />
                                        <p className="text-muted-foreground text-sm text-justify">
                                            {item.description}
                                        </p>
                                        {/* Contact */}
                                        <div className="mt-4 flex flex-col gap-3 text-sm">
                                            {item.phone && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-neutral-600 break-all">{item.phone}</span>
                                                </div>
                                            )}

                                            {item.email && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-neutral-600 break-all">{item.email}</span>
                                                </div>
                                            )}

                                            {item.address && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-neutral-600">
                                                        {item.address.district}, {item.address.state} -{" "}
                                                        {item.address.pincode}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Social + WhatsApp */}
                                <div className="flex items-center justify-between mt-4 w-full gap-3 flex-wrap sm:flex-nowrap">

                                    {/* Social Icons */}
                                    <div className="flex flex-row items-center gap-2 sm:gap-3 md:ml-48">

                                        {[
                                            { icon: FaFacebookF, color: "bg-blue-600", url: item.socialMedia?.facebook, label: "Facebook" },
                                            { icon: FaInstagram, color: "bg-gradient-to-tr from-pink-500 to-orange-400", url: item.socialMedia?.instagram, label: "Instagram" },
                                            { icon: FaTwitter, color: "bg-sky-500", url: item.socialMedia?.twitter, label: "Twitter" },
                                            { icon: FaLinkedinIn, color: "bg-blue-700", url: item.socialMedia?.linkedin, label: "LinkedIn" },
                                            { icon: FaGlobe, color: "bg-gray-700", url: item.socialMedia?.website, label: "Website" },
                                        ].map(
                                            (soc, i) =>
                                                soc.url && (
                                                    <TooltipProvider key={i}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <a
                                                                    href={soc.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`
                                        ${soc.color}
                                        text-white rounded-full shadow-md flex items-center justify-center
                                        
                                        /* Mobile small */
                                        w-6 h-6 text-[10px]

                                        /* Desktop normal */
                                        sm:w-6 sm:h-6 sm:text-sm

                                        transition-all hover:brightness-125 hover:scale-105
                                    `}
                                                                >
                                                                    <soc.icon />
                                                                </a>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{soc.label}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )
                                        )}

                                    </div>

                                    {/* WhatsApp Button */}
                                    {item.phone && (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="
                bg-[#007A0C] hover:bg-green-900 text-white font-semibold shadow-md flex items-center gap-1

                /* Mobile small size */
                px-2 py-1 text-xs h-7

                /* Desktop normal size */
                sm:px-5 sm:py-2 sm:text-sm sm:h-auto
            "
                                        >
                                            <a
                                                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <motion.span
                                                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="inline-flex"
                                                >
                                                    <FaWhatsapp className="text-white text-base sm:text-lg" />
                                                </motion.span>
                                                <span className="hidden sm:inline ml-1">WhatsApp</span>
                                            </a>
                                        </Button>
                                    )}
                                </div>

                            </Card>


                        ))
                    )}
                </section>

                {/* RIGHT SIDE — RELATED */}
                <aside className="w-full md:w-72 mt-8 md:mt-0 md:sticky md:top-20 h-max">
                    <div className="flex flex-col gap-6">

                        {/* Other Categories */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-neutral-800">
                                    Other Categories
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                    {otherListings.length}
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {otherListings.length === 0 ? (
                                    <p className="p-4 text-sm text-gray-500">No other categories found.</p>
                                ) : (
                                    otherListings.slice(0, 4).map((item) => (
                                        <Link
                                            href={`/category/${item.categorySlug}`}
                                            key={item.categorySlug}
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition rounded-lg"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-800">
                                                    {item.category.replace(/\b\w/g, (c) => c.toUpperCase())}
                                                </span>
                                            </div>

                                            <span className="text-xs bg-blue-900 text-white px-2 py-1 rounded-full">
                                                {item.count} Listings
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Sponsored */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-2">
                            <h4 className="text-lg font-semibold text-neutral-800  mb-2 px-2">
                                Sponsored
                            </h4>
                            <a
                                href="https://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-xl"
                            >
                                <img
                                    src="/images/sponsored-img.webp"
                                    alt="Advertisement"
                                    className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-300"
                                />
                            </a>
                        </div>
                    </div>
                </aside>

            </div>
        </>
    );
}
