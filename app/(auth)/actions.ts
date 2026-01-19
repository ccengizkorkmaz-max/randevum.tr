'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: { email: string, password: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword(formData)

    if (error) {
        throw new Error("Kullanıcı adınız ya da şifrenizi kontrol ederek tekrar deneyiniz.")
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: { email: string, password: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp(formData)

    if (error) {
        console.error("Signup error:", error)
        if (error.message.includes("is invalid")) {
            throw new Error("Kayıt başarısız: Geçerli bir e-posta adresi giriniz. Ya da bu e-posta ile daha önce kayıt oldunuz ise hesabınıza giriş yapın!")
        }
        throw new Error("Kayıt başarısız: " + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
