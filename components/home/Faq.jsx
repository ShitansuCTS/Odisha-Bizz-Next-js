"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <section className="w-full py-16 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4 items-center">
        {/* LEFT IMAGE */}
        <div className="w-full h-full">
          <div className="h-full rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/faq.webp"
              alt="Odisha Biz Support"
              width={700}
              height={700}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT FAQ CONTENT */}
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem
              value="item-1"
              className="border border-gray-200 bg-white rounded-xl shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 text-lg font-semibold text-gray-900">
                What is Odisha Biz?
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-gray-600">
                Odisha Biz is a leading{" "}
                <strong>business listing platform in Odisha</strong> that helps
                users discover trusted local services, businesses, and
                professionals across multiple industries in one place.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-200 bg-white rounded-xl shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                How can I list my business on Odisha Biz?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                You can easily <strong>list your business in Odisha</strong> by
                signing up on the platform, adding your business details,
                services, and contact information to start attracting potential
                customers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-200 bg-white rounded-xl shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                Is Odisha Biz free for business owners?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                Yes, Odisha Biz offers both <strong>free and premium business listing
                options</strong>, allowing businesses to choose the best plan based on
                their growth needs and visibility goals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-200 bg-white rounded-xl shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 text-lg font-medium">
               How does Odisha Biz help my business grow?
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-600">
                Odisha Biz improves your <strong>online visibility in Odisha</strong>, helps you reach targeted local customers, and increases leads through a trusted <strong>local business directory platform</strong>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
