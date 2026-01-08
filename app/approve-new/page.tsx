import { createAdminClient } from '@/utils/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { ApprovalButtons } from './approval-buttons' // Client comp
import { notFound } from 'next/navigation'

export default async function ApproveNewPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    // URL'den gelen datalar (Widget'ta kodladığımız parametreler)
    const userId = params.userId as string
    const serviceId = params.serviceId as string
    const staffId = params.staffId as string
    const customerName = params.customerName as string
    const customerPhone = params.customerPhone as string
    const startTime = params.startTime as string
    const endTime = params.endTime as string

    if (!userId || !serviceId || !startTime) {
        return (
            <div className="p-10 text-center text-red-500">
                Eksik parametre. Bu link geçersiz olabilir.
            </div>
        )
    }

    // Hizmet adını vs. veritabanından çekip teyit edelim ki güzel görünsün
    const supabase = await createAdminClient()
    const { data: service } = await supabase.from('services').select('title, price, duration').eq('id', serviceId).single()

    // Opsiyonel: Staff check
    let staffName = null
    if (staffId) {
        const { data: staff } = await supabase.from('staff').select('name').eq('id', staffId).single()
        staffName = staff?.name
    }

    const date = new Date(startTime)
    const endDate = new Date(endTime)

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-orange-200">
                <CardHeader className="text-center pb-2 bg-orange-100 rounded-t-lg">
                    <CardTitle className="text-xl text-orange-900">🆕 Yeni Müşteri İsteği</CardTitle>
                    <p className="text-sm text-orange-700">Bu randevu henüz oluşturulmadı.</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {/* Detaylar */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <p className="font-bold text-lg">{customerName}</p>
                                <a href={`tel:${customerPhone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {customerPhone}
                                </a>
                                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded ml-2">Yeni Kayıt</span>
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
                            <div className="w-5 h-5 flex items-center justify-center mt-0.5 text-zinc-400">✂️</div>
                            <div>
                                <p className="font-medium">{service?.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {service?.duration} dk • {service?.price} ₺
                                </p>
                            </div>
                        </div>

                        {staffName && (
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-zinc-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Uzman:</p>
                                    <p className="font-medium">{staffName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    <ApprovalButtons
                        data={{
                            userId,
                            serviceId,
                            staffId: staffId || null,
                            customerName,
                            customerPhone,
                            startTime,
                            endTime
                        }}
                    />
                </CardFooter>
            </Card>
        </div>
    )
}
