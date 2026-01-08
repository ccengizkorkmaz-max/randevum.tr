"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { resetPassword } from "./actions"
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
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Geçerli bir e-posta adresi giriniz.",
    }),
})

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            await resetPassword(values.email)
            setEmailSent(true)
            toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!")
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
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
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <Mail className="h-8 w-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                E-posta Gönderildi
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Şifre sıfırlama bağlantısı <strong>{form.getValues("email")}</strong> adresine gönderildi.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/login')}
                            className="w-full"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Giriş Sayfasına Dön
                        </Button>
                    </div>
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
                            &ldquo;Şifrenizi unutmanız sorun değil. Hemen sıfırlayın ve işinize devam edin.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Şifremi Unuttum
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-posta</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ornek@sirket.com" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Şifre Sıfırlama Bağlantısı Gönder
                            </Button>
                        </form>
                    </Form>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link href="/login" className="hover:text-brand underline underline-offset-4 inline-flex items-center gap-1">
                            <ArrowLeft className="h-3 w-3" />
                            Giriş sayfasına dön
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
