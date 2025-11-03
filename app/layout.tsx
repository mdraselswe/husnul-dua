import type { Metadata } from "next";
import { Noto_Sans_Bengali, Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "হুসনুল দুআ - ইসলামিক আমল ও দুআ",
  description: "ইসলামিক দুআ, আমল ও জিকিরের সংগ্রহ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "হুসনুল দুআ",
  },
};

export function generateViewport() {
  return {
    themeColor: "#10b981",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body
        className={`${bengali.variable} ${arabic.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
