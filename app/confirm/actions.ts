'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled') {
    const supabase = await createClient()

    // 1. Yetki Kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Unauthorized')
    }

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
