import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";
import Faq from "@/components/home/Faq";
import SearchHeader from "@/components/home/SearchHeader";
import Collage from "@/components/home/Collage";
import Cities from "@/components/home/Cities";

export default function Home() {
  return (
    <>
      <SearchHeader />
      <HomeBanner />
      <Collage />
      <Cities />
      <FeaturedServices />
      <WhyChooseUs />
      <Faq />
    </>
  );
}
