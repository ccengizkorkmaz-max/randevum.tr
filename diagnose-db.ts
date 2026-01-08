import { createClient } from './utils/supabase/server'

async function diagnose() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        console.log("No user found in session.")
        return
    }

    console.log("Checking profile for user:", user.id)

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error("Error fetching profile:", error)
    } else {
        console.log("Current profile data in DB:", data)
        console.log("Columns present in response:", Object.keys(data))
    }
}

diagnose()
