const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resendApiKey = process.env.RESEND_API_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.randevumtr.com';

if (!resendApiKey) {
    console.error('RESEND_API_KEY is missing in .env.local');
    process.exit(1);
}

const resend = new Resend(resendApiKey);
const targetEmail = 'ccengizkorkmaz@gmail.com';

async function sendTestEmails() {
    console.log(`Sending test emails to ${targetEmail}...`);

    // 1. Welcome Email
    try {
        console.log('Sending Welcome Email...');
        await resend.emails.send({
            from: 'Linka <onboarding@resend.dev>',
            to: targetEmail,
            subject: "TEST: Randevum.tr'ye Hoşgeldiniz! 🎉",
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
                    <a href="${siteUrl}/login" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Yönetim Paneline Git</a>
                </p>

                <p>Sorularınız olursa bu e-postaya yanıt verebilirsiniz.</p>
                <p>Sevgiler,<br>Randevum.tr Ekibi</p>
                <br><hr><br>
                <small>Bu bir test e-postasıdır.</small>
            `
        });
        console.log('Welcome Email Sent.');
    } catch (error) {
        console.error('Failed to send Welcome Email:', error.message);
    }

    // 2. Profile Ready Email
    try {
        const dummySlug = 'test-berber';
        const publicUrl = `${siteUrl}/${dummySlug}`;

        console.log('Sending Profile Ready Email...');
        await resend.emails.send({
            from: 'Linka <onboarding@resend.dev>',
            to: targetEmail,
            subject: "TEST: Tebrikler! Randevu Sayfanız Hazır 🚀",
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
                <br><hr><br>
                <small>Bu bir test e-postasıdır.</small>
            `
        });
        console.log('Profile Ready Email Sent.');
    } catch (error) {
        console.error('Failed to send Profile Ready Email:', error.message);
    }
}

sendTestEmails();
