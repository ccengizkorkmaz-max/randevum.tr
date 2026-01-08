import { createClient } from './utils/supabase/server'
import { addHours, startOfToday, setHours } from 'date-fns'

async function seed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.log("Kullanıcı oturumu bulunamadı.")
        return
    }

    // Hizmetleri al
    const { data: services } = await supabase
        .from('services')
        .select('id, duration')
        .eq('user_id', user.id)

    if (!services || services.length === 0) {
        console.log("Kullanıcıya ait hizmet bulunamadı. Lütfen önce bir hizmet ekleyin.")
        return
    }

    const today = startOfToday()

    const sampleAppointments = [
        {
            user_id: user.id,
            service_id: services[0].id,
            customer_name: "Ahmet Yılmaz",
            customer_phone: "+905551112233",
            customer_email: "ahmet@example.com",
            start_time: addHours(setHours(today, 10), 0).toISOString(),
            end_time: addHours(setHours(today, 10), 1).toISOString(),
            status: "pending",
            reminder_sent: false
        },
        {
            user_id: user.id,
            service_id: services[services.length > 1 ? 1 : 0].id,
            customer_name: "Ayşe Demir",
            customer_phone: "+905552223344",
            customer_email: "ayse@example.com",
            start_time: addHours(setHours(today, 14), 0).toISOString(),
            end_time: addHours(setHours(today, 14), 1).toISOString(),
            status: "confirmed",
            reminder_sent: false
        },
        {
            user_id: user.id,
            service_id: services[0].id,
            customer_name: "Mehmet Kaya",
            customer_phone: "+905553334455",
            customer_email: "mehmet@example.com",
            start_time: addHours(setHours(today, 16), 0).toISOString(),
            end_time: addHours(setHours(today, 16), 1).toISOString(),
            status: "pending",
            reminder_sent: false
        }
    ]

    console.log("Randevular oluşturuluyor...")
    const { error } = await supabase.from('appointments').insert(sampleAppointments)

    if (error) {
        console.error("Randevu oluşturma hatası:", error)
    } else {
        console.log("3 adet örnek randevu başarıyla eklendi.")
    }
}

seed()
