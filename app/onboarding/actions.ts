'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Kullanıcı oturumu bulunamadı.")
    }

    const businessName = formData.get('businessName') as string
    const slug = formData.get('slug') as string
    const phone = formData.get('phone') as string

    if (!slug || slug.length < 3) {
        throw new Error("Slug en az 3 karakter olmalıdır.")
    }

    // Insert profile
    const { error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            slug: slug.toLowerCase(),
            business_name: businessName,
            phone: phone,
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error("Bu link adresi zaten alınmış.")
        }
        throw new Error("Profil oluşturulamadı: " + error.message)
    }

    redirect('/dashboard')
}
