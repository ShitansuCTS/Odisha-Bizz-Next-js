import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Welcome to Odisha Biz || Properties & Local Business Listings",
  description: "Explore verified property and business listings in Odisha including hotels, restaurants, travel, and commercial spaces.",
  verification: { google: "NVR4AH5Lsgl3TVcyHrctrI9luhl9gIXlU0Wr4s4zfM8" },
  icons: { icon: "/logo-fav.ico" },
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Google Tag Manager - Head */}
      <Script
        id="gtm-head"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K9BG9KRM');
          `,
        }}
      />


      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K9BG9KRM"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
          </iframe>
        </noscript>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
