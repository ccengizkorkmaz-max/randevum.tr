import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <Link href="/" className="text-2xl font-bold tracking-tighter">
                    Randevum.tr<span className="text-primary">.</span>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" className="text-base font-medium">
                        Giriş Yap
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button className="text-base font-medium px-6">
                        Hemen Başla
                    </Button>
                </Link>
            </div>
        </nav>
    );
}
