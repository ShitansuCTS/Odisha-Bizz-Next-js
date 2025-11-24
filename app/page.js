import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";
import Faq from "@/components/home/Faq";
import SearchHeader from "@/components/home/SearchHeader";

export default function Home() {
  return (
    <>
      <SearchHeader />
      <HomeBanner />
      <FeaturedServices />
      <WhyChooseUs />
      <Faq />
    </>
  );
}
