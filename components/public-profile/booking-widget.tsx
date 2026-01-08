"use client"

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createAppointment, getBookedSlots } from "@/app/(public)/booking-actions";
import { addMinutes, setHours, setMinutes } from "date-fns";
import { useEffect } from "react";

interface Service {
    id: string;
    title: string;
    duration: number;
    price: number;
}

interface Staff {
    id: string;
    name: string;
    title: string | null;
    avatarUrl: string | null;
    isActive: boolean;
}

interface BookingWidgetProps {
    service: Service | null;
    businessPhone: string;
    userId: string;
    staff: Staff[];
}

export function BookingWidget({ service, businessPhone, userId, staff }: BookingWidgetProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [busySlots, setBusySlots] = useState<{ start: string; end: string }[]>([]);


    useEffect(() => {
        async function checkAvailability() {
            if (!date) return;
            const slots = await getBookedSlots(userId, selectedStaff?.id || null, date.toISOString());
            setBusySlots(slots);
        }
        checkAvailability();
    }, [date, selectedStaff, userId]);

    const handleBooking = async () => {
        if (!service || !date || !time || !name || !phone) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        if (staff.length > 0 && !selectedStaff) {
            toast.error("Lütfen bir uzman seçin.");
            return;
        }

        if (!phone.startsWith("+90") || phone.length < 13) {
            toast.error("Lütfen geçerli bir telefon numarası girin (+90...)");
            return;
        }

        setLoading(true);

        try {
            // Randevu zamanını oluştur
            const [hours, minutes] = time.split(":").map(Number);
            const startDateTime = setMinutes(setHours(date, hours), minutes);
            const endDateTime = addMinutes(startDateTime, service.duration);

            // Veritabanına kaydet
            await createAppointment({
                userId,
                serviceId: service.id,
                staffId: selectedStaff?.id || null,
                customerName: name,
                customerPhone: phone,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
            });

            const formattedDate = format(date, "d MMMM yyyy", { locale: tr });
            const staffInfo = selectedStaff ? ` uzman: ${selectedStaff.name}` : "";
            const message = `Randevum.tr: Yeni Randevu! Müşteri: ${name}, Hizmet: ${service.title}${staffInfo}, Tarih: ${formattedDate}, Saat: ${time}`;
            const encodedMessage = encodeURIComponent(message);

            // WhatsApp için numarayı düzenliyoruz
            let cleanPhone = businessPhone.replace(/\D/g, '');
            if (cleanPhone.startsWith('0')) {
                cleanPhone = '90' + cleanPhone.substring(1);
            } else if (cleanPhone.startsWith('5')) {
                cleanPhone = '90' + cleanPhone;
            }

            const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

            toast.success("Randevunuz alındı, WhatsApp'a yönlendiriliyorsunuz...");

            setTimeout(() => {
                window.location.href = whatsappLink;
            }, 1000);

        } catch (error: any) {
            toast.error("Randevu oluşturulamadı: " + error.message);
            setLoading(false);
        }
    };

    if (!service) {
        return (
            <Card className="text-center p-6 bg-muted/50 border-dashed">
                <p className="text-muted-foreground">Randevu almak için lütfen yukarıdan bir hizmet seçin.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {staff.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Uzman Seçin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {staff.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => setSelectedStaff(member)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border-2 ${selectedStaff?.id === member.id
                                        ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                        : "border-transparent hover:bg-zinc-50"
                                        } ${!member.isActive ? "grayscale opacity-70" : ""}`}
                                >
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-sm ${selectedStaff?.id === member.id ? "border-primary" : "border-zinc-100"
                                            }`}>
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                                                    <span className="text-zinc-400 font-bold text-lg">{member.name.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                        {selectedStaff?.id === member.id && (
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                        )}
                                        {!member.isActive && (
                                            <div className="absolute top-0 right-0 bg-zinc-500 text-white text-[8px] font-bold px-1 rounded uppercase">
                                                Kapalı
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-sm font-bold ${selectedStaff?.id === member.id ? "text-primary" : "text-zinc-700"}`}>
                                            {member.name}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{member.title}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {selectedStaff && !selectedStaff.isActive ? (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6 text-center text-amber-800">
                        <p className="font-medium text-lg">⚠️ {selectedStaff.name} şu an randevu almıyor.</p>
                        <p className="text-sm mt-1 opacity-80">Lütfen başka bir uzman seçiniz or daha sonra tekrar deneyiniz.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tarih ve Saat Seçin</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border shadow-sm"
                                locale={tr}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />

                            <div className="grid grid-cols-3 gap-2 w-full">
                                {(() => {
                                    // Dinamik zaman dilimleri (30 dk aralıklarla)
                                    const slots = [];
                                    for (let h = 9; h <= 18; h++) {
                                        for (let m = 0; m < 60; m += 30) {
                                            const hh = h.toString().padStart(2, '0');
                                            const mm = m.toString().padStart(2, '0');
                                            slots.push(`${hh}:${mm}`);
                                        }
                                    }

                                    const now = new Date();
                                    const isTodayDate = date && date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                    const currentHour = now.getHours();
                                    const currentMinute = now.getMinutes();

                                    return slots.map((slot) => {
                                        // Geçmiş Zaman Kontrolü
                                        const [slotH, slotM] = slot.split(':').map(Number);
                                        const isPast = isTodayDate && (slotH < currentHour || (slotH === currentHour && slotM <= currentMinute));

                                        // Çakışma Kontrolü (Seçilen hizmet süresini dikkate alır)
                                        const isBusy = busySlots.some(busy => {
                                            // 1. Slotun kendisi mevcut bir randevunun içinde mi?
                                            // [busy.start, busy.end) aralığı
                                            const isSlotInside = slot >= busy.start && slot < busy.end;
                                            if (isSlotInside) return true;

                                            // 2. Eğer bu slot seçilirse, hizmet süresi mevcut bir randevuyla çakışır mı?
                                            if (service) {
                                                const [h, m] = slot.split(':').map(Number);
                                                const proposedStartMin = h * 60 + m;
                                                const proposedEndMin = proposedStartMin + service.duration;

                                                const [bh, bm] = busy.start.split(':').map(Number);
                                                const appStartMin = bh * 60 + bm;
                                                const [eh, em] = busy.end.split(':').map(Number);
                                                const appEndMin = eh * 60 + em;

                                                // Çakışma: max(start1, start2) < min(end1, end2)
                                                const startMax = Math.max(proposedStartMin, appStartMin);
                                                const endMin = Math.min(proposedEndMin, appEndMin);

                                                return startMax < endMin;
                                            }
                                            return false;
                                        });

                                        const isDisabled = isBusy || isPast;

                                        return (
                                            <Button
                                                key={slot}
                                                variant={time === slot ? "default" : "outline"}
                                                onClick={() => setTime(slot)}
                                                className={`w-full ${isDisabled ? "opacity-40 cursor-not-allowed bg-zinc-50 text-zinc-300 border-zinc-100" : ""}`}
                                                disabled={isDisabled}
                                            >
                                                {slot}
                                                {isBusy && <span className="ml-1 text-[8px] font-bold block">(DOLU)</span>}
                                                {!isBusy && isPast && <span className="ml-1 text-[8px] font-bold block">(-)</span>}
                                            </Button>
                                        );
                                    });
                                })()}
                            </div>
                        </CardContent>
                    </Card>

                    {date && time && (
                        <Card className="animate-in fade-in slide-in-from-bottom-2">
                            <CardHeader>
                                <CardTitle>Bilgilerinizi Girin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ad Soyad</Label>
                                    <Input
                                        id="name"
                                        placeholder="Örn: Ahmet Yılmaz"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon Numarası</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+90 555 123 45 67"
                                        value={phone}
                                        onChange={(e) => {
                                            // Auto-prefix with +90 if empty or user tries to delete it
                                            let val = e.target.value;
                                            if (!val.startsWith("+90")) {
                                                if (val.startsWith("90")) val = "+" + val;
                                                else if (val.startsWith("0")) val = "+9" + val;
                                                else if (val.startsWith("+")) { /* ok */ }
                                                else val = "+90" + val;
                                            }
                                            // Allow only numbers and spaces after +
                                            if (/^\+90[\d\s]*$/.test(val)) {
                                                setPhone(val);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">Başında +90 olacak şekilde giriniz.</p>
                                </div>

                                <Button className="w-full text-lg py-6" onClick={handleBooking} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Randevu Oluştur (WhatsApp)"}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
