import { createClient } from './utils/supabase/server'

async function debugData() {
    const supabase = await createClient()

    console.log("--- Son 3 Randevu ---")
    const { data: appointments, error: appError } = await supabase
        .from('appointments')
        .select('*, services(title), staff(name)')
        .order('created_at', { ascending: false })
        .limit(3)

    if (appError) {
        console.error("Randevu çekme hatası:", appError)
    } else {
        console.log(JSON.stringify(appointments, null, 2))
    }

    console.log("\n--- Ekip Üyeleri ---")
    const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('*')

    if (staffError) {
        console.error("Personel çekme hatası:", staffError)
    } else {
        console.log(JSON.stringify(staff, null, 2))
    }
}

debugData()
