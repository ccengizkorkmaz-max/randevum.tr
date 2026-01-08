'use server'

import { createClient } from '@/utils/supabase/server'

export async function resetPassword(email: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
        throw new Error("Şifre sıfırlama e-postası gönderilemedi: " + error.message)
    }

    return { success: true }
}
