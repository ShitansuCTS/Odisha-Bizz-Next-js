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

export default function CategoryListingPage({ categorySlug }) {
    const router = useRouter();
    const searchParams = useSearchParams();



    const { mainListings, related, loading, fetchResults } = useResultStore();
    // ✅ Default district set to Khordha
    const [district, setDistrict] = useState("Khordha");
    const [selectedDistrict, setSelectedDistrict] = useState("Khordha");


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

            {/* HEADER */}
            <div className="px-6 md:px-16 bg-gray-100 shadow-md py-3 flex items-center justify-between">
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                    Top 10{" "}
                    <span className="text-green-600"> {categorySlug ? categorySlug.replace(/-/g, " ") : ""}</span>{" "}
                    in <span className="text-blue-600">Bhubaneswar</span>
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
            <div className="flex flex-col md:flex-row gap-10 py-4 px-6 md:px-14 w-full bg-gray-100 min-h-screen">
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
                                                className="w-full h-full object-cover"
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

                                        {/* Title & Rating */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">

                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-black">{idx + 1}.</span>
                                                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 wrap-break-words">
                                                    {item.title}
                                                </h2>
                                            </div>

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
                {/* Sidebar */}
                <aside className="w-full md:w-72 mt-8 md:mt-0">
                    <div className="md:sticky md:top-18 flex flex-col gap-6">
                        {/* Related */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-neutral-800">
                                    Related Categories
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                    {related.length}
                                </span>
                            </div>

                            <ul className="flex flex-col divide-y divide-gray-100 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                {related.length === 0 ? (
                                    <li className="px-4 py-3 text-muted-foreground text-sm">
                                        No related categories found.
                                    </li>
                                ) : (
                                    related.map((cat, idx) => (
                                        <li key={idx}>
                                            <Link
                                                to={`/category?district=${district}&category=${encodeURIComponent(
                                                    cat
                                                )}`}
                                                className="block px-4 py-2.5 text-neutral-700 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-all"
                                            >
                                                {cat}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Sponsored */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-2">
                            <h4 className="text-sm text-neutral-600 font-medium mb-2 px-2">
                                Sponsored
                            </h4>
                            <a
                                href="https://www.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-xl"
                            >
                                <img
                                    src="https://akam.cdn.jdmagicbox.com/images/icontent/analytics/Google_ads_banner_300x250_17_06_2025.png"
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
