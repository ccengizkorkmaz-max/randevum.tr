import { Calendar, Users, MessageSquare, BarChart3, Clock, Briefcase, CheckCircle, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
    {
        icon: Store,
        title: "İşletme Profili",
        description: "Logonuz, iletişim bilgileriniz ve kurumsal kimliğinizle profesyonel bir profil sayfası oluşturun."
    },
    {
        icon: Briefcase,
        title: "Hizmet & Ürün Yönetimi",
        description: "Sunduğunuz hizmetleri fiyat, süre ve açıklamalarıyla detaylı bir şekilde sergileyin."
    },
    {
        icon: Users,
        title: "Ekip Yönetimi",
        description: "Çalışanlarınızı ekleyin, her biri için özel takvim ve hizmet yetkileri tanımlayın."
    },
    {
        icon: Clock,
        title: "Çalışma Saatleri",
        description: "Haftalık çalışma günlerinizi, saatlerinizi ve mola sürelerinizi esnek bir şekilde ayarlayın."
    },
    {
        icon: Calendar,
        title: "7/24 Randevu",
        description: "Siz uyurken bile müşterileriniz boş saatlerinizi görüp randevu alabilsin."
    },
    {
        icon: CheckCircle,
        title: "Randevu Kontrolü",
        description: "Gelen randevuları tek tıkla onaylayın, reddedin veya durumlarını 'Geldi/Gelmedi' olarak güncelleyin."
    },
    {
        icon: MessageSquare,
        title: "WhatsApp İletişim",
        description: "Müşterilerinizle tek tıkla WhatsApp üzerinden iletişime geçin, otomatik mesajlar gönderin."
    },
    {
        icon: BarChart3,
        title: "Raporlar & Analiz",
        description: "Günlük cironuzu, en çok tercih edilen hizmetleri ve personel performansını analiz edin."
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-zinc-50/50 border-t border-zinc-100">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
                        İhtiyacınız Olan Tüm Özellikler
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        Randevum.tr, işletmenizi dijitale taşımanız için gereken her şeyi sunar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
