"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function SlideCarousel({ images }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: { perView: 1 },
        duration: 1000,
        drag: true,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    const timeout = useRef();

    useEffect(() => {
        if (!instanceRef.current) return;

        const play = () => {
            timeout.current = setTimeout(() => {
                instanceRef.current.next();
            }, 10000);
        };

        play();
        instanceRef.current.on("created", () => play());
        instanceRef.current.on("slideChanged", () => play());
        instanceRef.current.on("destroyed", () => clearTimeout(timeout.current));

        return () => clearTimeout(timeout.current);
    }, [instanceRef]);

    return (
        <div className="relative w-full flex justify-center mt-2 md:mt-2 px-1 md:px-0">
            {/* Slider */}
            <div
                ref={sliderRef}
                className="
        keen-slider w-full 
        max-w-[1400px]   /* Increased width for desktop */
        rounded-xl 
        overflow-hidden 
        relative 
        shadow-md
      "
            >
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        className="keen-slider__slide relative bg-transparent"
                    >
                        {/* Image */}
                        <div
                            className="
              relative 
              w-full 
              h-32          /* mobile */
              sm:h-48       
              md:h-[300px]  /* desktop height */
              lg:h-[340px]
            "
                        >
                            <Image
                                src={src}
                                alt={`Slide ${idx + 1}`}
                                fill
                                className="
                object-cover 
                rounded-xl 
                md:object-cover /* Ensures full desktop coverage */
              "
                                priority={idx === 0}
                            />

                            {/* Soft overlay */}
                            <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide number (INSIDE now) */}
            <div className="
      absolute 
      top-4 
      right-4
      md:right-18 
      z-30 
      bg-black/40 
      text-white 
      text-xs 
      md:text-sm 
      px-2 py-1 
      rounded
    ">
                {currentSlide + 1} of {images.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => instanceRef.current?.moveToIdx(idx)}
                        className={`
            w-2.5 h-2.5 rounded-full transition-all duration-300
            ${currentSlide === idx
                                ? "bg-white scale-125"
                                : "bg-white/50 hover:bg-white"
                            }
          `}
                    />
                ))}
            </div>
        </div>
    );


}
