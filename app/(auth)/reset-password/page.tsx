"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
    password: z.string().min(6, {
        message: "Şifre en az 6 karakter olmalıdır.",
    }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Check if we have a valid session from the recovery link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setSessionReady(true)
            } else {
                toast.error("Geçersiz veya süresi dolmuş şifre sıfırlama linki")
                setTimeout(() => router.push('/forgot-password'), 2000)
            }
        }
        checkSession()
    }, [supabase, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: values.password
            })

            if (error) throw error

            toast.success("Şifreniz başarıyla güncellendi!")
            setTimeout(() => {
                router.push('/login')
            }, 1000)
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
            }
            setIsLoading(false)
        }
    }

    if (!sessionReady) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">Oturum kontrol ediliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white dark:border-r lg:flex overflow-hidden">
                <div
                    className="absolute inset-0 bg-center bg-no-repeat opacity-80"
                    style={{
                        backgroundImage: 'url("/auth-side.jpg")',
                        backgroundSize: '40%'
                    }}
                />
                <div className="relative z-20 flex items-center text-xl font-bold tracking-tight text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-white/20 text-zinc-950">R</div>
                        Randevum.tr
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Yeni şifrenizi belirleyin ve güvenli bir şekilde hesabınıza giriş yapın.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Yeni Şifre Belirleyin
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Lütfen yeni şifrenizi girin.
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Yeni Şifre</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="******" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Şifreyi Güncelle
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
