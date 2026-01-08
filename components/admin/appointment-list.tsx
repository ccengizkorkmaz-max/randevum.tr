"use client"

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Phone, Check, X, Loader2, MessageCircle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { updateAppointmentStatus } from "@/app/(admin)/actions";
import { toast } from "sonner";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

interface Appointment {
    id: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    serviceTitle: string;
    date: string;
    time: string;
    rawDate: string;
    staffName?: string | null;
    customerStats?: { cancelled: number; noShow: number };
}

interface AppointmentListProps {
    appointments: Appointment[];
}

type FilterType = "today" | "week" | "month" | "all";
type StatusFilterType = "all" | "pending" | "confirmed" | "cancelled" | "no_show";

export function AppointmentList({ appointments }: AppointmentListProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

    const filteredAppointments = useMemo(() => {
        return appointments.filter((app) => {
            // Zaman Filtresi
            const date = parseISO(app.rawDate);
            let matchesTime = true;
            if (filter === "today") matchesTime = isToday(date);
            else if (filter === "week") matchesTime = isThisWeek(date, { weekStartsOn: 1 });
            else if (filter === "month") matchesTime = isThisMonth(date);

            // Durum Filtresi
            let matchesStatus = true;
            if (statusFilter !== "all") {
                matchesStatus = app.status === statusFilter;
            }

            return matchesTime && matchesStatus;
        });
    }, [appointments, filter, statusFilter]);

    const handleStatusUpdate = async (id: string, status: 'confirmed' | 'cancelled' | 'no_show') => {
        setLoadingId(id + status);
        try {
            await updateAppointmentStatus(id, status);
            toast.success(status === 'confirmed' ? "Randevu onaylandı." : status === 'no_show' ? "Durum 'Gelmedi' olarak güncellendi." : "Randevu iptal edildi.");
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setLoadingId(null);
        }
    };

    const sendNotification = (app: Appointment) => {
        let cleanPhone = app.customerPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '90' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('5')) {
            cleanPhone = '90' + cleanPhone;
        }

        let message = "";
        if (app.status === 'confirmed') {
            message = `Merhaba ${app.customerName}, ${app.date} tarihindeki ${app.serviceTitle} randevunuz onaylanmıştır. Görüşmek üzere!`;
        } else if (app.status === 'cancelled') {
            message = `Merhaba ${app.customerName}, maalesef ${app.date} tarihindeki ${app.serviceTitle} randevu talebinizi şu an karşılayamıyoruz. Başka bir müsait zamanda görüşmek dileğiyle.`;
        } else {
            message = `Merhaba ${app.customerName}, randevu talebinizi aldık. En kısa sürede size dönüş yapacağız.`;
        }

        const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground ml-1">Zaman Aralığı</div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={filter === "today" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("today")}
                            className="rounded-full font-normal"
                        >
                            Bugün
                        </Button>
                        <Button
                            variant={filter === "week" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("week")}
                            className="rounded-full font-normal"
                        >
                            Bu Hafta
                        </Button>
                        <Button
                            variant={filter === "month" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("month")}
                            className="rounded-full font-normal"
                        >
                            Bu Ay
                        </Button>
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("all")}
                            className="rounded-full font-normal"
                        >
                            Tümü
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground ml-1">Randevu Durumu</div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={statusFilter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("all")}
                            className="rounded-full font-normal h-8 px-4"
                        >
                            Hepsi
                        </Button>
                        <Button
                            variant={statusFilter === "pending" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("pending")}
                            className={`rounded-full font-normal h-8 px-4 ${statusFilter === "pending" ? "bg-amber-500 hover:bg-amber-600 border-amber-500" : ""}`}
                        >
                            Bekleyenler
                        </Button>
                        <Button
                            variant={statusFilter === "confirmed" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("confirmed")}
                            className={`rounded-full font-normal h-8 px-4 ${statusFilter === "confirmed" ? "bg-green-600 hover:bg-green-700 border-green-600" : ""}`}
                        >
                            Onaylılar
                        </Button>
                        <Button
                            variant={statusFilter === "cancelled" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("cancelled")}
                            className={`rounded-full font-normal h-8 px-4 ${statusFilter === "cancelled" ? "bg-red-600 hover:bg-red-700 border-red-600" : ""}`}
                        >
                            İptal Edilenler
                        </Button>
                        <Button
                            variant={statusFilter === "no_show" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter("no_show")}
                            className={`rounded-full font-normal h-8 px-4 ${statusFilter === "no_show" ? "bg-zinc-600 hover:bg-zinc-700 border-zinc-600" : ""}`}
                        >
                            Gelmeyenler
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold">Randevular</CardTitle>
                    <Badge variant="outline" className="font-normal">
                        {filteredAppointments.length} Randevu
                    </Badge>
                </CardHeader>
                <CardContent>
                    {filteredAppointments.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                            {statusFilter === 'pending' && "Bekleyen randevu bulunmuyor."}
                            {statusFilter === 'confirmed' && "Onaylı randevu bulunmuyor."}
                            {statusFilter === 'cancelled' && "İptal edilen randevu bulunmuyor."}
                            {statusFilter === 'no_show' && "Gelmeyen randevu bulunmuyor."}
                            {statusFilter === 'all' && "Bu dönemde randevu bulunmuyor."}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Müşteri</TableHead>
                                    <TableHead>Hizmet</TableHead>
                                    <TableHead>Uzman</TableHead>
                                    <TableHead>Tarih/Saat</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {app.customerId ? (
                                                    <Link href={`/customers/${app.customerId}`} className="hover:underline hover:text-primary transition-colors">
                                                        {app.customerName}
                                                    </Link>
                                                ) : (
                                                    app.customerName
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {app.customerPhone}
                                            </div>
                                            {(app.customerStats && (app.customerStats.noShow > 0 || app.customerStats.cancelled > 0)) && (
                                                <div className="mt-1 flex gap-1 flex-wrap">
                                                    {app.customerStats.noShow > 0 && (
                                                        <Badge variant="secondary" className="text-[10px] bg-zinc-100 text-zinc-600 border-zinc-200 px-1 py-0 h-4">
                                                            {app.customerStats.noShow} Gelmedi
                                                        </Badge>
                                                    )}
                                                    {app.customerStats.cancelled > 0 && (
                                                        <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-600 border-red-100 px-1 py-0 h-4">
                                                            {app.customerStats.cancelled} İptal
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{app.serviceTitle}</TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">{app.staffName || "-"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {app.date}</span>
                                                <span>{app.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        app.status === 'confirmed' ? 'default' :
                                                            app.status === 'pending' ? 'outline' :
                                                                app.status === 'cancelled' ? 'destructive' :
                                                                    app.status === 'no_show' ? 'secondary' : 'secondary'
                                                    }
                                                    className={
                                                        app.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' :
                                                            app.status === 'confirmed' ? 'bg-green-600' :
                                                                app.status === 'no_show' ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300' : ''
                                                    }
                                                >
                                                    {app.status === 'confirmed' ? 'Onaylı' :
                                                        app.status === 'pending' ? 'Bekliyor' :
                                                            app.status === 'cancelled' ? 'İptal' :
                                                                app.status === 'no_show' ? 'Gelmedi' : app.status}
                                                </Badge>
                                                {app.status !== 'pending' && app.status !== 'no_show' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-zinc-400 hover:text-green-600"
                                                        onClick={() => sendNotification(app)}
                                                        title="WhatsApp ile Bilgilendir"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* Bekleyenler için İşlemler */}
                                            {app.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => handleStatusUpdate(app.id, 'confirmed')}
                                                        disabled={!!loadingId}
                                                        title="Onayla"
                                                    >
                                                        {loadingId === app.id + 'confirmed' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                        disabled={!!loadingId}
                                                        title="İptal Et"
                                                    >
                                                        {loadingId === app.id + 'cancelled' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Onaylılar için İşlemler */}
                                            {app.status === 'confirmed' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                                                        onClick={() => handleStatusUpdate(app.id, 'no_show')}
                                                        disabled={!!loadingId}
                                                        title="Gelmedi Olarak İşaretle"
                                                    >
                                                        {loadingId === app.id + 'no_show' ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-xs text-muted-foreground hover:text-red-600"
                                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                        disabled={!!loadingId}
                                                    >
                                                        İptal Et
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Gelmedi Statüsündekiler için İşlemler (Geri alma opsiyonu ekleyebiliriz veya boş bırakabiliriz) */}
                                            {app.status === 'no_show' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 text-xs text-muted-foreground hover:text-red-600"
                                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                        disabled={!!loadingId}
                                                    >
                                                        İptal Et
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
