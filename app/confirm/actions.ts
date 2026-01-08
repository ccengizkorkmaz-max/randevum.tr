'use server'

import { createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled') {
    const supabase = await createAdminClient()

    // Auth kontrolü kaldırıldı - Linke sahip olan onaylayabilir

    // 2. Güncelleme
    const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)

    if (error) {
        throw new Error('Failed to update appointment')
    }

    // 3. Cache Temizleme
    revalidatePath(`/confirm/${appointmentId}`)
    revalidatePath('/dashboard')

    return { success: true }
}
