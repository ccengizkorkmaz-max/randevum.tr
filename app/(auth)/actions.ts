'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: { email: string, password: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword(formData)

    if (error) {
        throw new Error("Giriş başarısız: " + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: { email: string, password: string }) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp(formData)

    if (error) {
        throw new Error("Kayıt başarısız: " + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
