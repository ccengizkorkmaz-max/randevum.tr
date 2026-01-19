"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center px-4">
            <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Bir şeyler ters gitti
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-[500px]">
                    Sunucu tarafında beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
                </p>
            </div>
            <div className="flex gap-4 mt-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Sayfayı Yenile
                </Button>
                <Button onClick={() => reset()}>Tekrar Dene</Button>
            </div>
        </div>
    );
}
