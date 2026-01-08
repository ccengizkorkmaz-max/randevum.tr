"use client"

import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"
import { login } from "../actions"

export default function LoginPage() {
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
                            &ldquo;Randevum.tr sayesinde randevularımı yönetmek çocuk oyuncağına dönüştü. Müşterilerim WhatsApp üzerinden direkt bana ulaşıyor.&rdquo;
                        </p>
                        <footer className="text-sm">Ali Yılmaz</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Hesabınıza Giriş Yapın
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            E-posta ve şifrenizi giriniz.
                        </p>
                    </div>
                    <AuthForm type="login" onSubmitAction={login} />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link href="/forgot-password" className="hover:text-brand underline underline-offset-4">
                            Şifremi Unuttum
                        </Link>
                    </p>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link href="/signup" className="hover:text-brand underline underline-offset-4">
                            Hesabınız yok mu? Kayıt Olun
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
