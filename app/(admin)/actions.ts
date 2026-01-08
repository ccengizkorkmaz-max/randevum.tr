'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: {
    businessName: string;
    bio?: string;
    phone: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    slug: string;
    address?: string;
    locationUrl?: string;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error, count } = await supabase
        .from('profiles')
        .update({
            business_name: data.businessName,
            bio: data.bio || null,
            phone: data.phone,
            avatar_url: data.avatarUrl || null,
            cover_url: data.coverUrl || null,
            address: data.address || null,
            location_url: data.locationUrl || null,
            updated_at: new Date().toISOString(),
        }, { count: 'exact' })
        .eq('id', user.id)

    if (error) throw new Error(error.message)

    if (count === 0) {
        throw new Error("Profil güncellenemedi. Lütfen oturumunuzu kontrol edip tekrar deneyin.")
    }

    revalidatePath('/dashboard')
    revalidatePath('/', 'layout') // Revalidate public pages too if cached
}

export async function addService(data: {
    title: string;
    description?: string;
    duration: number;
    price: number;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('services')
        .insert({
            user_id: user.id,
            title: data.title,
            description: data.description,
            duration: data.duration,
            price: data.price,
        })

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function updateService(data: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    price: number;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('services')
        .update({
            title: data.title,
            description: data.description,
            duration: data.duration,
            price: data.price,
        })
        .eq('id', data.id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function deleteService(serviceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function updateAvailability(days: {
    name: string;
    active: boolean;
    start: string;
    end: string;
}[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    // Basic implementation: Upsert records

    const records = days.map(day => ({
        user_id: user.id,
        day_of_week: day.name,
        is_active: day.active,
        start_time: day.start,
        end_time: day.end
    }))

    const { error } = await supabase
        .from('availability')
        .upsert(records, { onConflict: 'user_id, day_of_week' })

    if (error) throw new Error("Saatler güncellenemedi: " + error.message)

    revalidatePath('/dashboard')
}

export async function updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled' | 'pending' | 'no_show') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function addStaff(data: {
    name: string;
    title?: string;
    avatarUrl?: string;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('staff')
        .insert({
            user_id: user.id,
            name: data.name,
            title: data.title,
            avatar_url: data.avatarUrl,
        })

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function updateStaff(data: {
    id: string;
    name: string;
    title?: string;
    avatarUrl?: string;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('staff')
        .update({
            name: data.name,
            title: data.title,
            avatar_url: data.avatarUrl,
        })
        .eq('id', data.id)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function deleteStaff(staffId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', staffId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
}

export async function toggleStaffStatus(staffId: string, isActive: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const { error } = await supabase
        .from('staff')
        .update({ is_active: isActive })
        .eq('id', staffId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard')
    revalidatePath('/', 'layout')
}

export async function updateStaffAvailability(staffId: string, days: {
    name: string;
    active: boolean;
    start: string;
    end: string;
}[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Yetkisiz işlem.")

    const records = days.map(day => ({
        user_id: user.id,
        staff_id: staffId,
        day_of_week: day.name,
        is_active: day.active,
        start_time: day.start,
        end_time: day.end
    }))

    const { error } = await supabase
        .from('availability')
        .upsert(records, { onConflict: 'staff_id, day_of_week' })

    if (error) throw new Error("Çalışan saatleri güncellenemedi: " + error.message)

    revalidatePath('/dashboard')
}
