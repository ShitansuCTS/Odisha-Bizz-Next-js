"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AuthProvider from "@/components/AuthProvider";
import ScrollToTopButton from "@/components/scroller/ScrollToTopButton";
import Script from "next/script";
import { Toaster } from "react-hot-toast"; // ← import Toaster

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isUser = pathname.startsWith("/user");
  const thankyou = pathname.startsWith("/thanks");

  return (
    <>
      {!isAdmin && !isUser && !thankyou && <Navbar />}

      <AuthProvider>{children}</AuthProvider>

      {!isAdmin && !isUser && !thankyou && <Footer />}
      {!isAdmin && !isUser && !thankyou && <ScrollToTopButton />}
      <Toaster />
      <Script
        chatbot_id="6911bdc4b446537655579714"
        data-type="default"
        src="https://app.thinkstack.ai/bot/thinkstackai-loader.min.js"
      />
    </>
  );
}
