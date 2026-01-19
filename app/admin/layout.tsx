import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    // Note: This relies on the 'role' column being present in the profiles table
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        // If not admin, redirect to standard dashboard or show unauthorized
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-zinc-900 text-white min-h-screen flex flex-col p-4">
                <div className="mb-8 px-2">
                    <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-xs text-zinc-400">Yönetim Paneli</p>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/admin/profiles">
                        <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <Users className="mr-2 h-4 w-4" />
                            Kullanıcılar
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Ana Uygulama
                        </Button>
                    </Link>
                </nav>

                <div className="mt-auto">
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-zinc-800">
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                        </Button>
                    </form>
                </div>
            </aside>
            <main className="flex-1 p-8 bg-zinc-50 overflow-auto">
                {children}
            </main>
        </div>
    );
}
