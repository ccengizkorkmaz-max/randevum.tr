"use client"

import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"
import { signup } from "../actions"

export default function SignupPage() {
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
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-20 flex items-center text-xl font-bold tracking-tight text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-white/20 text-zinc-950">R</div>
                        Randevum.tr
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Randevum.tr ile işimi dijitalleştirdim. Kurulum sadece 1 dakika sürdü.&rdquo;
                        </p>
                        <footer className="text-sm">Ayşe Demir</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Hesap Oluşturun
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Hemen başlamak için e-posta adresinizi girin.
                        </p>
                    </div>
                    <AuthForm type="signup" onSubmitAction={signup} />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link href="/login" className="hover:text-brand underline underline-offset-4">
                            Zaten hesabınız var mı? Giriş Yapın
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
