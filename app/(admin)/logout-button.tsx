"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loading}
            className="gap-2 text-muted-foreground hover:text-foreground"
        >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Çıkış Yap</span>
        </Button>
    )
}
