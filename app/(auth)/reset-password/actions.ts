'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(newPassword: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        throw new Error("Şifre güncellenemedi: " + error.message)
    }

    redirect('/login')
}
