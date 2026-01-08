"use client"

import { createClient } from "@/utils/supabase/client"
import { addHours, startOfToday, setHours } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SeedPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    async function handleSeed() {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Giriş yapılmamış.")

            // Hizmetleri al
            const { data: services } = await supabase
                .from('services')
                .select('id')
                .eq('user_id', user.id)

            if (!services || services.length === 0) {
                toast.error("Önce bir hizmet eklemelisiniz.")
                return
            }

            const today = startOfToday()
            const samples = [
                {
                    user_id: user.id,
                    service_id: services[0].id,
                    customer_name: "Ahmet Yılmaz",
                    customer_phone: "+905551112233",
                    start_time: addHours(setHours(today, 10), 0).toISOString(),
                    end_time: addHours(setHours(today, 10), 1).toISOString(),
                    status: "pending"
                },
                {
                    user_id: user.id,
                    service_id: services[0].id,
                    customer_name: "Ayşe Demir",
                    customer_phone: "+905552223344",
                    start_time: addHours(setHours(today, 14), 0).toISOString(),
                    end_time: addHours(setHours(today, 14), 1).toISOString(),
                    status: "confirmed"
                },
                {
                    user_id: user.id,
                    service_id: services[0].id,
                    customer_name: "Mehmet Kaya",
                    customer_phone: "+905553334455",
                    start_time: addHours(setHours(today, 16), 0).toISOString(),
                    end_time: addHours(setHours(today, 16), 1).toISOString(),
                    status: "pending"
                }
            ]

            const { error } = await supabase.from('appointments').insert(samples)
            if (error) throw error

            toast.success("3 adet randevu eklendi!")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Button onClick={handleSeed} disabled={loading}>
                {loading ? "Ekleniyor..." : "3 Örnek Randevu Ekle"}
            </Button>
        </div>
    )
}
