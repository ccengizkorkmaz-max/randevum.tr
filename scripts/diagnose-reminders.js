const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function diagnose() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabase = createClient(supabaseUrl, supabaseKey)

    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    console.log('--- DIAGNOSIS START ---')
    console.log('Server Time (Local):', now.toString())
    console.log('Server Time (ISO):', now.toISOString())
    console.log('Next 24 Hours Limit:', next24Hours.toISOString())

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')

    if (error) {
        console.error('Error fetching appointments:', error)
        return
    }

    console.log(`Found ${appointments.length} total appointments.`)

    appointments.forEach(app => {
        const start = new Date(app.start_time)
        const isConfirmed = app.status === 'confirmed'
        const notReminded = app.reminder_sent === false
        const inWindow = start >= now && start <= next24Hours

        console.log(`\nID: ${app.id}`)
        console.log(`  - Customer: ${app.customer_name}`)
        console.log(`  - Start Time: ${app.start_time} (${start.toString()})`)
        console.log(`  - Status: ${app.status} (${isConfirmed ? 'OK' : 'FAIL'})`)
        console.log(`  - Reminder Sent: ${app.reminder_sent} (${notReminded ? 'OK' : 'FAIL'})`)
        console.log(`  - In Window: ${inWindow} (${inWindow ? 'OK' : 'FAIL'})`)

        if (isConfirmed && notReminded && inWindow) {
            console.log('  => SHOULD BE PICKED UP')
        } else {
            console.log('  => IGNORED')
        }
    })
    console.log('\n--- DIAGNOSIS END ---')
}

diagnose()
