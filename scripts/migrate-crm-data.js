const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    console.log('--- CRM DATA MIGRATION START ---');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch all appointments without customer_id
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .is('customer_id', null);

    if (error) {
        console.error('Error fetching appointments:', error);
        return;
    }

    console.log(`Found ${appointments.length} appointments to migrate.`);

    // 2. Group by user_id + phone
    const customersMap = {}; // key: "user_id:phone" -> { user_id, phone, name, email, appointmentIds: [] }

    for (const app of appointments) {
        if (!app.customer_phone) continue;

        const key = `${app.user_id}:${app.customer_phone}`;

        if (!customersMap[key]) {
            customersMap[key] = {
                user_id: app.user_id,
                phone: app.customer_phone,
                name: app.customer_name,
                email: app.customer_email || null,
                appointmentIds: []
            };
        }
        // Update name/email if currently missing but present in this appointment (enrich data)
        if (!customersMap[key].email && app.customer_email) {
            customersMap[key].email = app.customer_email;
        }

        customersMap[key].appointmentIds.push(app.id);
    }

    console.log(`Identified ${Object.keys(customersMap).length} unique customers.`);

    // 3. Process each customer
    for (const key of Object.keys(customersMap)) {
        const customerData = customersMap[key];

        console.log(`Processing customer: ${customerData.name} (${customerData.phone})...`);

        // Check if customer already exists
        const { data: existing } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', customerData.user_id)
            .eq('phone', customerData.phone)
            .maybeSingle();

        let customerId;

        if (existing) {
            console.log(`  -> Exists (ID: ${existing.id}). Linking...`);
            customerId = existing.id;
        } else {
            console.log(`  -> Creating new customer...`);
            const { data: newCustomer, error: createError } = await supabase
                .from('customers')
                .insert({
                    user_id: customerData.user_id,
                    name: customerData.name,
                    phone: customerData.phone,
                    email: customerData.email
                })
                .select()
                .single();

            if (createError) {
                console.error(`  -> Failed to create customer:`, createError);
                continue;
            }
            customerId = newCustomer.id;
        }

        // 4. Update appointments
        const { error: updateError } = await supabase
            .from('appointments')
            .update({ customer_id: customerId })
            .in('id', customerData.appointmentIds);

        if (updateError) {
            console.error(`  -> Failed to update appointments:`, updateError);
        } else {
            console.log(`  -> Updated ${customerData.appointmentIds.length} appointments.`);
        }
    }

    console.log('--- MIGRATION COMPLETE ---');
}

migrate();
