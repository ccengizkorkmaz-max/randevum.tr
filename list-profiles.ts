import { createClient } from './utils/supabase/server';

async function listProfiles() {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, business_name, slug');

    if (error) {
        console.error("Error fetching profiles:", error);
    } else {
        console.log("ALL PROFILES:");
        profiles.forEach(p => console.log(`ID: ${p.id}, Name: ${p.business_name}, Slug: ${p.slug}`));
    }
}

listProfiles();
