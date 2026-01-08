import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
