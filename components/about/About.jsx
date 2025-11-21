"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, ArrowRight } from "lucide-react";
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
              alt="Odisha Bizz team working"
              className="rounded-xl shadow-lg w-full object-cover"
              width={300}
              height={300}
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 space-y-6">
            <Badge
              variant="secondary"
              className="uppercase tracking-wider font-semibold text-sm px-4 py-2 rounded-full bg-indigo-500 text-white shadow-md block sm:inline-block sm:mx-0 mx-auto text-center hover:bg-indigo-700 hover:text-white transition-colors duration-300"
            >
              About Odisha Bizz
            </Badge>




            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center md:text-left px-4">
              Showcase & Manage Your Properties Effortlessly
            </h2>



            <p className="text-muted-foreground leading-relaxed text-justify">
              Odisha Bizz is a comprehensive platform designed for property owners,
              real estate agents, and businesses to list, showcase, and manage their
              properties efficiently. Connect with potential clients, highlight your
              listings with rich media, and reach a wider audience across Bhubaneswar
              and beyond. Our tools simplify property management while maximizing visibility.
            </p>


            <div>
              <h3 className="font-semibold text-lg mb-4">
                Why Choose Odisha Bizz
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Easy property listing & management",
                  "High-quality images & videos",
                  "Advanced search & filters for clients",
                  "Secure client inquiries",
                  "Real-time updates & notifications",
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
    </>
  );
};

export default About;
