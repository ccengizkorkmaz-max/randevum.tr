import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "@/app/actions/customers";
import { Calendar, Mail, Phone, Clock, FileText, ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Lütfen giriş yapınız.</div>;

    // Fetch customer with appointments
    const { data: customer, error } = await supabase
        .from('customers')
        .select(`
            *,
            appointments (
                id,
                start_time,
                status,
                service_id,
                services ( title, price, currency )
            )
        `)
        .eq('id', resolvedParams.id)
        .eq('user_id', user.id)
        .single();

    if (error || !customer) {
        notFound();
    }

    // Sort appointments: Future first, then past
    const appointments = (customer.appointments || []).sort((a: any, b: any) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

    // Calculate stats
    const totalAppointments = appointments.length;
    const totalSpent = appointments.reduce((sum: number, app: any) => {
        if (app.status === 'confirmed' && app.services?.price) {
            return sum + app.services.price;
        }
        return sum;
    }, 0);

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="mb-6">
                <Link href="/dashboard" className="text-sm text-muted-foreground flex items-center hover:text-foreground mb-2">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Panele Dön
                </Link>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sol Kolon: Profil & Düzenleme */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Müşteri Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => {
                                'use server'
                                await updateCustomer(customer.id, formData)
                            }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ad Soyad</Label>
                                    <Input id="name" name="name" defaultValue={customer.name} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefon</Label>
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <Input id="phone" name="phone" defaultValue={customer.phone} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <Input id="email" name="email" type="email" defaultValue={customer.email || ''} placeholder="E-posta yok" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Özel Notlar</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        defaultValue={customer.notes || ''}
                                        placeholder="Müşteri hakkında notlar..."
                                        className="h-32"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Save className="w-4 h-4 mr-2" />
                                    Değişiklikleri Kaydet
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Özet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Toplam Randevu</span>
                                <span className="font-bold">{totalAppointments}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-2 border-b text-center text-xs">
                                <div className="flex flex-col">
                                    <span className="font-bold text-green-600">{appointments.filter((a: any) => a.status === 'confirmed').length}</span>
                                    <span className="text-muted-foreground">Onaylı</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-red-600">{appointments.filter((a: any) => a.status === 'cancelled').length}</span>
                                    <span className="text-muted-foreground">İptal</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-zinc-600">{appointments.filter((a: any) => a.status === 'no_show').length}</span>
                                    <span className="text-muted-foreground">Gelmedi</span>
                                </div>
                            </div>
                            <div className="flex justify-between border-b pb-2 pt-2">
                                <span className="text-muted-foreground">Toplam Harcama</span>
                                <span className="font-bold text-green-600">
                                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalSpent)}
                                </span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-muted-foreground">Kayıt Tarihi</span>
                                <span className="text-sm">
                                    {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sağ Kolon: Geçmiş */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Randevu Geçmişi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {appointments.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">Henüz randevu kaydı yok.</p>
                                ) : (
                                    appointments.map((app: any) => (
                                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg text-primary font-bold">
                                                    <span>{new Date(app.start_time).getDate()}</span>
                                                    <span className="text-[10px] uppercase">{new Date(app.start_time).toLocaleString('tr-TR', { month: 'short' })}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{app.services?.title || 'Bilinmeyen Hizmet'}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(app.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        app.status === 'confirmed' ? 'default' :
                                                            app.status === 'pending' ? 'outline' :
                                                                app.status === 'cancelled' ? 'destructive' : 'secondary'
                                                    }
                                                    className={
                                                        app.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100' :
                                                            app.status === 'confirmed' ? 'bg-green-600 hover:bg-green-700' :
                                                                app.status === 'no_show' ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300' : ''
                                                    }
                                                >
                                                    {app.status === 'confirmed' ? 'Onaylı' :
                                                        app.status === 'pending' ? 'Bekliyor' :
                                                            app.status === 'cancelled' ? 'İptal' :
                                                                app.status === 'no_show' ? 'Gelmedi' : app.status}
                                                </Badge>
                                                {app.services?.price > 0 && (
                                                    <div className="text-sm font-medium mt-1">
                                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: app.services.currency }).format(app.services.price)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
