const { createClient } = require('@supabase/supabase-js')
const { addHours, startOfToday, setHours } = require('date-fns')
require('dotenv').config({ path: '.env.local' })

async function seed() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase URL veya Anon Key .env.local dosyasında bulunamadı.")
        return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Auth yerine manuel ID alalım (Sizin terminal loglarından aldığım ID)
    const userId = '9e4f8579-0910-409c-bba6-31c233048b4e'

    const { data: services } = await supabase
        .from('services')
        .select('id')
        .eq('user_id', userId)

    if (!services || services.length === 0) {
        console.log("Hizmet bulunamadı. Lütfen önce bir hizmet ekleyin.")
        return
    }

    const today = startOfToday()

    const sampleAppointments = [
        {
            user_id: userId,
            service_id: services[0].id,
            customer_name: "Ahmet Yılmaz",
            customer_phone: "+905551112233",
            start_time: addHours(setHours(today, 10), 0).toISOString(),
            end_time: addHours(setHours(today, 10), 1).toISOString(),
            status: "pending"
        },
        {
            user_id: userId,
            service_id: services[0].id,
            customer_name: "Ayşe Demir",
            customer_phone: "+905552223344",
            start_time: addHours(setHours(today, 14), 0).toISOString(),
            end_time: addHours(setHours(today, 14), 1).toISOString(),
            status: "confirmed"
        },
        {
            user_id: userId,
            service_id: services[0].id,
            customer_name: "Mehmet Kaya",
            customer_phone: "+905553334455",
            start_time: addHours(setHours(today, 16), 0).toISOString(),
            end_time: addHours(setHours(today, 16), 1).toISOString(),
            status: "pending"
        }
    ]

    console.log("Randevular ekleniyor...")
    const { error } = await supabase.from('appointments').insert(sampleAppointments)

    if (error) {
        console.error("Hata:", error)
    } else {
        console.log("3 adet örnek randevu eklendi. Dashboard'u yenileyin.")
    }
}

seed()
