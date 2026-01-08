import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function GET(request: Request) {
    // Optional: Check for Cron Secret if deployed
    const authHeader = request.headers.get('authorization')
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // Use Admin Client to bypass RLS
    let supabase
    try {
        supabase = createAdminClient()
    } catch (e) {
        return NextResponse.json({ error: "Configuration Error: SUPABASE_SERVICE_ROLE_KEY missing." }, { status: 500 })
    }

    // Define the time window (e.g., next 24 hours)
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Fetch appointments
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*, services(title)')
        .eq('reminder_sent', false)
        .eq('status', 'confirmed')
        .gte('start_time', now.toISOString())
        .lte('start_time', next24Hours.toISOString())

    if (error) {
        console.error('Error fetching appointments:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
        return NextResponse.json({ message: 'No appointments to remind' })
    }

    const results = []

    for (const appointment of appointments) {
        const { customer_email, customer_name, start_time, services } = appointment
        // @ts-ignore
        const serviceName = services?.title || 'Hizmet'
        const formattedDate = new Date(start_time).toLocaleString('tr-TR', {
            dateStyle: 'long',
            timeStyle: 'short',
        })

        if (!customer_email) {
            console.log(`Skipping appointment ${appointment.id}: No email`)
            results.push({ id: appointment.id, status: 'skipped_no_email' })
            continue
        }

        try {
            if (resend) {
                await resend.emails.send({
                    from: 'Linka <onboarding@resend.dev>', // Update with your verify domain
                    to: customer_email,
                    subject: `Randevu Hatırlatması: ${serviceName}`,
                    html: `
            <p>Sayın ${customer_name},</p>
            <p><strong>${serviceName}</strong> için randevunuzu hatırlatmak isteriz.</p>
            <p><strong>Tarih:</strong> ${formattedDate}</p>
            <p>Sizi bekliyoruz!</p>
          `,
                })
                console.log(`Email sent to ${customer_email}`)
            } else {
                console.log(`[SIMULATION] Email would be sent to ${customer_email}`)
            }

            // Update reminder_sent status
            const { error: updateError } = await supabase
                .from('appointments')
                .update({ reminder_sent: true })
                .eq('id', appointment.id)

            if (updateError) {
                console.error('Error updating status:', updateError)
                results.push({ id: appointment.id, status: 'failed_update', error: updateError })
            } else {
                results.push({ id: appointment.id, status: 'sent' })
            }

        } catch (emailError) {
            console.error('Error sending email:', emailError)
            results.push({ id: appointment.id, status: 'failed_email', error: emailError })
        }
    }

    return NextResponse.json({ success: true, results })
}
