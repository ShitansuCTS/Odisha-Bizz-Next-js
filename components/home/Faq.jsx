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
                            alt="Odisha Bizz Support"
                            width={700}
                            height={700}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* RIGHT FAQ CONTENT */}
                <div className="flex flex-col h-full justify-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-snug mb-6">
                        Frequently Asked Questions
                    </h2>

                    <Accordion type="single" collapsible className="w-full space-y-3">

                        <AccordionItem
                            value="item-1"
                            className="border border-gray-200 bg-white rounded-xl shadow-sm"
                        >
                            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                                What is Odisha Bizz?
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-gray-600">
                                Odisha Bizz is a service and business discovery platform helping
                                people find trusted professionals, vendors, and local businesses
                                across Odisha.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-2"
                            className="border border-gray-200 bg-white rounded-xl shadow-sm"
                        >
                            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                                How can I list my business?
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-gray-600">
                                Simply submit your details through the “Add Listing” page. Our
                                team will verify and approve your listing typically within 24 hours.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-3"
                            className="border border-gray-200 bg-white rounded-xl shadow-sm"
                        >
                            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                                Is Odisha Bizz free to use?
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-gray-600">
                                Yes, browsing, searching, and contacting service providers on
                                Odisha Bizz is completely free for users.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                            value="item-4"
                            className="border border-gray-200 bg-white rounded-xl shadow-sm"
                        >
                            <AccordionTrigger className="px-4 py-3 text-lg font-medium">
                                How do I contact customer support?
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-gray-600">
                                You can reach us through the Contact Us page. Our support team
                                generally responds within a few hours.
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>
            </div>
        </section>
    );
}
