import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Randevum.tr - Hızlı Randevu",
  description: "Küçük işletmeler ve freelancerlar için tek sayfalık randevu sistemi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased min-h-screen bg-zinc-50`}>
        {children}
        <Toaster />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LPSMG5XLQT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LPSMG5XLQT');
          `}
        </Script>
      </body>
    </html>
  );
}
