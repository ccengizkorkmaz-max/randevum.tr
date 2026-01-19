'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

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

    if (resend) {
        try {
            const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`
            const userEmail = user.email

            if (userEmail) {
                await resend.emails.send({
                    from: 'Linka <onboarding@resend.dev>',
                    to: userEmail,
                    subject: "Tebrikler! Randevu Sayfanız Hazır 🚀",
                    html: `
                        <h1>Sayfanız Yayında!</h1>
                        <p>Harika! Profil kurulumunu tamamladınız. Artık size özel randevu sayfanız müşterileriniz için hazır.</p>

                        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                            <p style="margin-bottom: 10px; font-weight: bold;">Müşterilerinizle paylaşacağınız link:</p>
                            <a href="${publicUrl}" style="font-size: 18px; color: #000; font-weight: bold; text-decoration: none;">${publicUrl}</a>
                        </div>

                        <h3>Şimdi Ne Yapmalısınız?</h3>
                        <ul>
                            <li>📸 <strong>Instagram Biyografinize Ekleyin:</strong> Müşterileriniz profilinizden doğrudan randevu alsın.</li>
                            <li>💬 <strong>Whatsapp'tan Paylaşın:</strong> "Randevu almak için bu linki kullanabilirsiniz" diyerek müşterilerinize gönderin.</li>
                            <li>🔗 <strong>Kartvizitinize Ekleyin:</strong> Profesyonel görünümünüzü tamamlayın.</li>
                        </ul>

                        <p>Bol kazançlar dileriz!</p>
                        <p>Sevgiler,<br>Randevum.tr Ekibi</p>
                    `
                })
            }
        } catch (emailError) {
            console.error("Failed to send profile link email:", emailError)
        }
    }

    redirect('/dashboard')
}
