import HomeBanner from "@/components/home/HomeBanner";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <HomeBanner />
      <FeaturedServices />
      <WhyChooseUs />
    </>

  );
}
