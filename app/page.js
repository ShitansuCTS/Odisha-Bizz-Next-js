import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";
import Faq from "@/components/home/Faq";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedServices />
      <WhyChooseUs />
      <Faq />
    </>

  );
}
