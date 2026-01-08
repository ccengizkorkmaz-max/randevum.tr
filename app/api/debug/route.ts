import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 401 })
        }

        const { data: allProfiles } = await supabase
            .from('profiles')
            .select('id, slug, business_name')
            .limit(10)

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            sessionUserId: user.id,
            profileFound: !!profile,
            profile,
            allProfiles: allProfiles || [],
            error: error ? error.message : null,
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
