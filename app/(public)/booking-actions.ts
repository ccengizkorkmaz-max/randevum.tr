'use server'

import { createClient } from '@/utils/supabase/server'

export async function createAppointment(data: {
    userId: string;
    serviceId: string;
    staffId?: string | null;
    customerName: string;
    customerPhone: string;
    startTime: string;
    endTime: string;
}) {
    try {
        const supabase = await createClient()

        // 1. Müşteriyi bul veya oluştur
        const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', data.userId)
            .eq('phone', data.customerPhone)
            .maybeSingle()

        let customerId = existingCustomer?.id

        if (!customerId) {
            const { data: newCustomer, error: customerError } = await supabase
                .from('customers')
                .insert({
                    user_id: data.userId,
                    name: data.customerName,
                    phone: data.customerPhone,
                })
                .select('id')
                .single()

            if (customerError) {
                console.error("Müşteri oluşturma hatası:", customerError)
                // RLS hatası olabilir, devam edelim ama customer_id olmadan
            } else {
                customerId = newCustomer.id
            }
        }

        // 2. Randevuyu oluştur
        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                user_id: data.userId,
                service_id: data.serviceId,
                staff_id: data.staffId,
                customer_name: data.customerName,
                customer_phone: data.customerPhone,
                start_time: data.startTime,
                end_time: data.endTime,
                status: 'pending',
                customer_id: customerId // İlişkilendirme
            })
            .select()
            .single()

        if (error) {
            console.error("Kayıt Hatası:", error)
            return { success: false, error: "Randevu kaydedilemedi: " + error.message }
        }

        return { success: true, data: appointment }

    } catch (error: any) {
        console.error("Server Action Exception:", error)
        return { success: false, error: "Beklenmeyen hata: " + error.message }
    }
}

export async function getBookedSlots(userId: string, staffId: string | null, dateStr: string) {
    const supabase = await createClient()

    // Gelen günün başlangıç ve bitişini hesapla
    const startOfDay = new Date(dateStr)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(dateStr)
    endOfDay.setHours(23, 59, 59, 999)

    let query = supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('user_id', userId)
        .neq('status', 'cancelled')
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())

    if (staffId) {
        query = query.eq('staff_id', staffId)
    } else {
        query = query.is('staff_id', null)
    }

    const { data, error } = await query

    if (error) {
        console.error("Meşgul saatleri çekme hatası:", error)
        return []
    }

    return data.map(app => ({
        start: new Date(app.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        end: new Date(app.end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }))
}
