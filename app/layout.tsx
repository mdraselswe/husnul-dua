import type { Metadata } from "next";
import { Noto_Sans_Bengali, Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/components/AdminProvider";

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
  applicationName: "হুসনুল দুআ",
  title: {
    default: "হুসনুল দুআ - ইসলামিক আমল ও দুআ",
    template: "%s · হুসনুল দুআ",
  },
  description: "ইসলামিক দুআ, আমল ও জিকিরের সংগ্রহ — খুঁজুন, পড়ুন, সংরক্ষণ করুন।",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "হুসনুল দুআ",
  },
  formatDetection: { telephone: false },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover" as const,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#0f766e" },
      { media: "(prefers-color-scheme: dark)", color: "#0b1a1f" },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${bengali.variable} ${arabic.variable} ${inter.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hd_theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');var fs=localStorage.getItem('hd_read_scale');if(fs)document.documentElement.style.setProperty('--read-scale',fs);}catch(e){}})();`,
          }}
        />
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
