"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Info, ArrowRight, Target, Eye } from "lucide-react";
import Image from "next/image";

const About = () => {
  const router = useRouter();

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-60 sm:h-[300px] lg:h-[360px] flex items-center justify-center overflow-hidden">
        <img
          src="/images/real-estate.jpg"
          alt="Background Image"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
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
            About Us
          </h1>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="w-full py-10 bg-background md:px-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <Image
              src="/images/about-1st.jpg"
              loading="lazy"
              alt="Odisha Biz team working"
              className="rounded-xl shadow-lg w-full object-cover"
              width={300}
              height={300}
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 space-y-6">
            {/* <Badge
              variant="secondary"
              className="uppercase tracking-wider font-semibold text-sm px-4 py-2 rounded-full bg-indigo-500 text-white shadow-md block sm:inline-block sm:mx-0 mx-auto text-center hover:bg-indigo-700 hover:text-white transition-colors duration-300"
            >
              About Odisha Biz
            </Badge> */}

            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold leading-tight text-center md:text-left  text-gray-900">
              Showcase & Manage Your Properties Effortlessly
            </h2>

            <p className="text-muted-foreground leading-relaxed text-justify">
              Odisha Biz is a dynamic digital platform designed to connect
              people with trusted local businesses, services, and opportunities
              across Odisha. Built with the vision of simplifying business
              discovery, we empower users to explore verified vendors, compare
              services, and make informed decisions—all in one place.
              <br />
              Whether you are searching for reliable service providers or
              looking to grow your business visibility, Odisha Biz serves as
              your gateway to a smarter, more connected local ecosystem. From
              real estate and healthcare to travel, education, and lifestyle
              services, we bring every essential category together to make
              discovery seamless and efficient.
            </p>

            <div>
              <h3 className="font-semibold text-lg mb-4">
                Why Choose Odisha Biz
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Verified and trusted business listings ",
                  "Easy discovery across multiple industries ",
                  "Seamless connection with service providers ",
                  "Growth opportunities for businesses ",
                  "User-friendly and scalable platform ",
                  "Reach a wider audience effortlessly",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#249732]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/listing/create")}
                className="flex-1 bg-[#249732] hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-md rounded-sm"
              >
                <Info className="w-4 h-4" />
                List Your Property
              </Button>
              <Button
                onClick={() => router.push("/contact")}
                className="flex-1 bg-[#012a7a] hover:bg-[#001846] text-white flex items-center justify-center gap-2 shadow-md rounded-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-10 bg-background md:px-20">
        <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left: Content */}
          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center md:text-left">
              Our Mission
            </h2>

            <p className="text-muted-foreground leading-relaxed text-justify">
              Our mission is to bridge the gap between businesses and customers
              by creating a transparent, reliable, and growth-driven platform.
              We aim to help businesses expand their reach while enabling users
              to access trusted services quickly and effortlessly.
            </p>
          </div>

          {/* Right: Image */}
          <div className="w-full md:w-1/2">
            <Image
              src="/images/mission.jpeg"
              alt="Our Mission"
              className="rounded-xl shadow-lg w-full h-[260px] sm:h-[320px] md:h-[360px] object-cover"
              width={500}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="w-full py-10 bg-gray-50 md:px-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <Image
              src="/images/vission.jpeg"
              alt="Our Vision"
              className="rounded-xl shadow-lg w-full h-[260px] sm:h-[320px] md:h-[360px] object-cover"
              width={500}
              height={400}
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center md:text-left">
              Our Vision
            </h2>

            <p className="text-muted-foreground leading-relaxed text-justify">
              We envision becoming Odisha’s most trusted and comprehensive
              business directory—empowering local enterprises, boosting digital
              presence, and driving economic growth through meaningful
              connections.
            </p>
          </div>
        </div>
      </section>

      {/* Faq section starts here */}
      <section className="w-full py-12 bg-background md:px-20">
        <div className="container mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Everything you need to know about Odisha Biz
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT SIDE (1–5) */}
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="q1">
                <AccordionTrigger>What is Odisha Biz?</AccordionTrigger>
                <AccordionContent>
                  Odisha Biz is a leading{" "}
                  <strong>business listing platform in Odisha</strong>
                  that helps users discover trusted local services, businesses,
                  and professionals across multiple industries in one place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2">
                <AccordionTrigger>
                  How can I list my business on Odisha Biz?
                </AccordionTrigger>
                <AccordionContent>
                  You can easily <strong>list your business in Odisha</strong>{" "}
                  by signing up on the platform, adding your business details,
                  services, and contact information to start attracting
                  potential customers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3">
                <AccordionTrigger>
                  Is Odisha Biz free for business owners?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, Odisha Biz offers both free and{" "}
                  <strong>premium business listing options</strong>, allowing
                  businesses to choose the best plan based on their growth needs
                  and visibility goals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4">
                <AccordionTrigger>
                  How does Odisha Biz help my business grow?
                </AccordionTrigger>
                <AccordionContent>
                  Odisha Biz improves your{" "}
                  <strong>online visibility in Odisha</strong>, helps you reach
                  targeted local customers, and increases leads through a
                  trusted <strong>local business directory platform.</strong>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5">
                <AccordionTrigger>
                  Can I find verified service providers on Odisha Biz?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, Odisha Biz features{" "}
                  <strong>
                    verified and trusted service providers in Odisha
                  </strong>
                  , making it easier for users to connect with reliable
                  businesses.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* RIGHT SIDE (6–10) */}
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="q6">
                <AccordionTrigger>
                  What types of businesses are listed on Odisha Biz?
                </AccordionTrigger>
                <AccordionContent>
                  You can find a wide range of industries including:
                  <ul className="mt-4">
                    <li className="mt-1">• Real estate services in Odisha </li>
                    <li className="mt-1">• Healthcare providers </li>
                    <li className="mt-1">• Restaurants and cafés </li>
                    <li className="mt-1">• Travel and tourism services </li>
                    <li className="mt-1">
                      • Education and coaching institutes{" "}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q7">
                <AccordionTrigger>
                  How do I contact a business listed on Odisha Biz?
                </AccordionTrigger>
                <AccordionContent>
                  Each listing includes direct contact details, allowing users
                  to{" "}
                  <strong>connect instantly with businesses in Odisha</strong>{" "}
                  via phone, email, or inquiry forms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q8">
                <AccordionTrigger>
                  Why should I choose Odisha Biz over other directories?
                </AccordionTrigger>
                <AccordionContent>
                  Odisha Biz stands out as a{" "}
                  <strong>trusted Odisha business marketplace</strong>
                  with verified listings, easy navigation, and a strong focus on
                  local business growth.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q9">
                <AccordionTrigger>
                  Is Odisha Biz suitable for small businesses?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely. Odisha Biz is designed to support{" "}
                  <strong>small and local businesses in Odisha</strong> by
                  giving them a digital presence and helping them compete
                  effectively.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q10">
                <AccordionTrigger>
                  How can customers benefit from Odisha Biz?
                </AccordionTrigger>
                <AccordionContent>
                  Customers can{" "}
                  <strong>find the best services in Odisha</strong>, compare
                  options, and make informed decisions quickly without wasting
                  time searching across multiple platforms.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
