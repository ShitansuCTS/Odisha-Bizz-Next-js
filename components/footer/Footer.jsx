'use client'

import React from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa6";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b2c71] text-white relative">
      {/* Top green subscription bar */}
      <div className="bg-[#249732] text-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-center md:text-left font-medium">
            Subscribe and be notified about new locations
          </span>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-2 rounded-full bg-white text-[#249732] placeholder:text-[#249732] border border-white focus:outline-none focus:ring-2 focus:ring-white w-64 md:w-72"
            />
            <button className="bg-white text-[#249732] rounded-full px-4 py-2 hover:bg-gray-100 transition-all duration-1000 transform hover:-translate-y-1 font-bold cursor-pointer shadow-md">
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-4 gap-8">
        {/* 1️⃣ Logo + Description */}
        <div className="flex flex-col gap-4 items-start">
          <img
            src="/images/logo.png"
            alt="Odisha Bizz"
            className="h-12 object-contain"
            loading="lazy"
          />
          <p className="text-white text-sm leading-relaxed text-justify">
            <span className="font-semibold text-white">Odisha Bizz</span> is
            your one-stop platform to explore, connect, and list businesses and
            properties across Odisha. Discover the right opportunities for your
            growth and visibility in just a few clicks.
          </p>
        </div>

        {/* 4️⃣ Contact Info */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-white mb-2">Quick Links</h4>
          <Link href="/" className="hover:text-[#249732] transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#249732] transition">
            About
          </Link>
          <Link href="/categories" className="hover:text-[#249732] transition">
            Our Categories
          </Link>
          <Link href="/category/privacy-policy" className="hover:text-[#249732] transition">
            Privacy Policy
          </Link>
          <Link href="/category/terms-and-conditions" className="hover:text-[#249732] transition">
            Terms & Conditions
          </Link>
          <Link href="/contact" className="hover:text-[#249732] transition">
            Contact Us
          </Link>


        </div>

        {/* 2️⃣ & 3️⃣ Categories (split into two columns) */}
        <div className="grid grid-cols-2 gap-6 md:col-span-2">
          {/* Left Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white mb-2">Categories</h4>
            <Link href="/category/real-estate-and-properties" className="hover:text-[#249732] transition">
              Real Estate
            </Link>
            <Link href="/category/healthcare-services" className="hover:text-[#249732] transition">
              Healthcare
            </Link>
            <Link href="/category/travel-and-tourism-services" className="hover:text-[#249732] transition">
              Travel & Tourism
            </Link>
            <Link href="/category/hotels-and-resorts" className="hover:text-[#249732] transition">
              Hotels & Resorts
            </Link>
            <Link href="/category/restaurants-and-cafes" className="hover:text-[#249732] transition">
              Restaurants and Cafes
            </Link>
            <Link href="/category/education-and-coaching" className="hover:text-[#249732] transition">
              Education & Coaching
            </Link>
          </div>

          {/* Right Categories */}
          <div className="flex flex-col gap-3 mt-6 md:mt-0">
            <h4 className="font-semibold text-white mb-2 invisible">
              Categories
            </h4>{" "}
            {/* alignment fix */}

            <Link href="#" className="hover:text-[#249732] transition">
              Agriculture & Food
            </Link>

            <Link href="#" className="hover:text-[#249732] transition">
              Education & Learning
            </Link>

            <Link href="#" className="hover:text-[#249732] transition">
              Media & Entertainment
            </Link>

            <Link href="/category/salons-spas-and-wellness" className="hover:text-[#249732] transition">
              Salons, Spas, & Wellness
            </Link>

            <Link href="#" className="hover:text-[#249732] transition">
              Technology & Innovation
            </Link>
            <Link href="#" className="hover:text-[#249732] transition">
              Transportation & Logistics
            </Link>

          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-[#081d53] text-gray-300 text-sm py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <span>
            &copy; Copyright 2026 Odisha Bizz. All Rights Reserved || Powered
            By{" "}
            <strong>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#249732] transition-colors duration-300 font-semibold"
              >
                Odisha Bizz
              </a>
            </strong>
          </span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white border border-white/5 ml-1.5 hover:text-[#249732] transition-colors duration-300"
            >
              <FaFacebookF className="text-base" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white border border-white/5 ml-1.5 hover:text-[#249732] transition-colors duration-300"
            >
              <FaXTwitter className="text-base" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white border border-white/5 ml-1.5 hover:text-[#249732] transition-colors duration-300"
            >
              <FaInstagram className="text-base" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white border border-white/5 ml-1.5 hover:text-[#249732] transition-colors duration-300"
            >
              <FaLinkedin className="text-base" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
