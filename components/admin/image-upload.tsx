"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    label: string;
    bucketName?: string;
}

export function ImageUpload({ value, onChange, label, bucketName = "images" }: ImageUploadProps) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.")
            return
        }

        setLoading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)

            onChange(data.publicUrl)
            toast.success("Fotoğraf yüklendi!")
        } catch (error: any) {
            toast.error("Yükleme hatası: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = () => {
        onChange("")
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            {value ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted/50 group">
                    <img
                        src={value}
                        alt="Upload preview"
                        className="w-full max-h-[300px] object-contain bg-black/5"
                    />
                    <div className="absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {loading ? (
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            )}
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Fotoğraf seç</span> veya sürükle
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={loading}
                        />
                    </label>
                </div>
            )}
        </div>
    )
}
