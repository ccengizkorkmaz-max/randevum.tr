import { createAdminClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Phone, User, CheckCircle2, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ConfirmationButtons } from './confirmation-buttons' // Client Component for interactivity

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createAdminClient()

    // Auth kontrolü kaldırıldı (WhatsApp linki için)

    // 2. Randevu Detaylarını Çek
    const { data: appointment } = await supabase
        .from('appointments')
        .select(`
            *,
            services ( title, duration, price ),
            staff ( name )
        `)
        .eq('id', resolvedParams.id)
        .single()

    if (!appointment) notFound()

    const date = new Date(appointment.start_time)
    const endDate = new Date(appointment.end_time)

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Randevu Onayı</CardTitle>
                    <p className="text-sm text-muted-foreground">İşlem yapmak için lütfen inceleyin.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Durum Göstergesi */}
                    <div className={`p-3 rounded-lg text-center font-bold text-sm border
                        ${appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {appointment.status === 'confirmed' && '✅ ONAYLANDI'}
                        {appointment.status === 'cancelled' && '❌ İPTAL EDİLDİ'}
                        {appointment.status === 'pending' && '⏳ ONAY BEKLİYOR'}
                    </div>

                    {/* Detaylar */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                            <div>
                                <p className="font-medium">{appointment.customer_name}</p>
                                <a href={`tel:${appointment.customer_phone}`} className="text-sm text-blue-600 hover:underline">
                                    {appointment.customer_phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-lg">
                                    {format(date, 'd MMMM yyyy', { locale: tr })}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(date, 'HH:mm')} - {format(endDate, 'HH:mm')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 flex items-center justify-center mt-0.5">✂️</div>
                            <div>
                                <p className="font-medium">{appointment.services?.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {appointment.services?.duration} dk • {appointment.services?.price} ₺
                                </p>
                            </div>
                        </div>

                        {appointment.staff && (
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Uzman:</p>
                                    <p className="font-medium">{appointment.staff.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    {appointment.status === 'pending' && (
                        <ConfirmationButtons id={appointment.id} />
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
