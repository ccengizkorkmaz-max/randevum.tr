import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Yeni: WhatsApp Entegrasyonu Yayında
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
            Kendi randevu linkini <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 animate-gradient bg-300%">
              1 dakikada oluştur.
            </span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Randevum.tr, işletmeniz veya freelance işleriniz için tek sayfalık, ultra sade bir randevu ve tanıtım sitesi oluşturmanızı sağlar. Kodlama yok, karmaşa yok.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Ücretsiz Başla <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo-business">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white hover:bg-zinc-50 border-zinc-200">
                Örnek Sayfayı İncele
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row gap-8 justify-center text-sm text-zinc-500 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Kredi Kartı Gerekmez</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Tamamen <strong>BEDAVA</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Anında Kurulum</span>
            </div>
          </div>
        </div>
      </main>

      <FeaturesSection />

      <footer className="py-8 text-center text-zinc-400 text-sm border-t border-zinc-100 bg-white">
        <p>© 2024 Randevum.tr. Türkiye'de geliştirildi 🇹🇷</p>
      </footer>
    </div>
  );
}
