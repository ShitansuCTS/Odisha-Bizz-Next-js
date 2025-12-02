import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";
import Faq from "@/components/home/Faq";
import SearchHeader from "@/components/home/SearchHeader";
import Collage from "@/components/home/Collage";

export default function Home() {
  return (
    <>
      <SearchHeader />
      <HomeBanner />
      <Collage />
      <FeaturedServices />
      <WhyChooseUs />
      <Faq />
    </>
  );
}
