'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

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

    if (resend) {
        try {
            await resend.emails.send({
                from: 'Linka <onboarding@resend.dev>',
                to: formData.email,
                subject: "Randevum.tr'ye Hoşgeldiniz! 🎉",
                html: `
                    <h1>Hoşgeldiniz!</h1>
                    <p>Merhaba,</p>
                    <p>Randevum.tr ailesine katıldığınız için teşekkür ederiz. İşletmeniz veya freelance çalışmalarınız için profesyonel randevu sayfanızı oluşturmaya sadece bir adım uzaktasınız.</p>

                    <h3>Neler Yapabilirsiniz?</h3>
                    <ul>
                        <li>🚀 <strong>1 Dakikada Kurulum:</strong> Profil bilgilerinizi girin ve yayınlayın.</li>
                        <li>📅 <strong>Kolay Randevu:</strong> Müşterileriniz sizinle uğraşmadan randevu alsın.</li>
                        <li>🔗 <strong>Tek Link:</strong> Tüm hizmetlerinizi tek bir linkte toplayın.</li>
                    </ul>

                    <p>Hemen başlamak için yönetim panelinize gidin:</p>
                    <p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Yönetim Paneline Git</a>
                    </p>

                    <p>Sorularınız olursa bu e-postaya yanıt verebilirsiniz.</p>
                    <p>Sevgiler,<br>Randevum.tr Ekibi</p>
                `
            })
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError)
            // Continue signup flow even if email fails
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
