"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProfile } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // Client-side validation could go here

        try {
            await createProfile(formData)
            // Success handled by server action redirect
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Profilinizi Oluşturun</CardTitle>
                    <CardDescription>
                        İşletmeniz veya kendiniz için temel bilgileri girin.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="businessName">İşletme / Ad Soyad</Label>
                            <Input name="businessName" placeholder="Örn: Mert Berber" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Linkiniz</Label>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">randevum.tr/</span>
                                <Input name="slug" placeholder="mert-berber" required />
                            </div>
                            <p className="text-xs text-muted-foreground">Türkçe karakter ve boşluk kullanmayınız.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input name="phone" placeholder="+90555..." required />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet ve Başla
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
