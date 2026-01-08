"use client"

import { ImageUpload } from "@/components/admin/image-upload"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateProfile } from "@/app/(admin)/actions"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const profileSchema = z.object({
    businessName: z.string().min(2, "İşletme adı en az 2 karakter olmalıdır."),
    bio: z.string().max(500, "Biyografi en fazla 500 karakter olabilir.").optional(),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz."),
    avatarUrl: z.string().url("Geçerli bir URL giriniz.").optional().or(z.literal("")),
    coverUrl: z.string().url("Geçerli bir URL giriniz.").optional().or(z.literal("")),
    slug: z.string().min(2),
    address: z.string().max(200).optional().or(z.literal("")),
    locationUrl: z.string().optional().or(z.literal("")),
})

interface ProfileSettingsProps {
    profile: {
        businessName: string;
        bio: string | null;
        phone: string | null;
        avatarUrl: string | null;
        coverUrl: string | null;
        address: string | null;
        locationUrl: string | null;
        slug: string;
    }
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            businessName: profile.businessName,
            bio: profile.bio || "",
            phone: profile.phone || "",
            avatarUrl: profile.avatarUrl || "",
            coverUrl: profile.coverUrl || "",
            address: profile.address || "",
            locationUrl: profile.locationUrl || "",
            slug: profile.slug,
        },
    })

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setLoading(true)
        try {
            await updateProfile(values)
            toast.success("Profiliniz güncellendi!")
        } catch (error: any) {
            toast.error("Hata: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil Ayarları</CardTitle>
                <CardDescription>
                    Pazarlamanızda görünecek bilgileri düzenleyin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">Profil Linkiniz</div>
                        <div className="flex items-center gap-2 font-mono text-sm">
                            <span className="text-muted-foreground">randevum.tr/</span>
                            <span className="font-semibold text-foreground">{profile.slug}</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${profile.slug}`)
                            toast.success("Link kopyalandı!")
                        }}
                    >
                        Kopyala
                    </Button>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...form.register("slug")} />
                        <FormField
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İşletme Adı</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kısa Biyografi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="İşletmeniz hakkında kısa bilgi..."
                                            className="resize-none"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefon (WhatsApp)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="+90..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İşletme Adresi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mahalle, Sokak, No..."
                                            className="resize-none"
                                            {...field}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="locationUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harita Konum Linki (Google/Apple Maps)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={loading} placeholder="https://maps.app.goo.gl/..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={(url) => {
                                                form.setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            label="Profil Fotoğrafı"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="coverUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={(url) => {
                                                form.setValue("coverUrl", url, { shouldDirty: true, shouldValidate: true });
                                            }}
                                            label="Kapak Fotoğrafı"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Değişiklikleri Kaydet
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
