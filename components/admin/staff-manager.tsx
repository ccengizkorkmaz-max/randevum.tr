"use client"

import { useState } from "react"
import { addStaff, deleteStaff, toggleStaffStatus, updateStaff } from "@/app/(admin)/actions"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Pencil, Plus, Trash2, User } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "./image-upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Staff {
    id: string;
    name: string;
    title: string | null;
    avatar_url: string | null;
    is_active: boolean;
}

interface StaffManagerProps {
    staff: Staff[];
}

export function StaffManager({ staff }: StaffManagerProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

    const [newStaff, setNewStaff] = useState({
        name: "",
        title: "",
        avatarUrl: ""
    })

    async function handleAddStaff(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await addStaff({
                name: newStaff.name,
                title: newStaff.title,
                avatarUrl: newStaff.avatarUrl
            })
            toast.success("Personel eklendi.")
            setIsAddDialogOpen(false)
            setNewStaff({ name: "", title: "", avatarUrl: "" })
        } catch (err: any) {
            toast.error("Hata: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdateStaff(e: React.FormEvent) {
        e.preventDefault()
        if (!editingStaff) return

        setLoading(true)
        try {
            await updateStaff({
                id: editingStaff.id,
                name: editingStaff.name,
                title: editingStaff.title || "",
                avatarUrl: editingStaff.avatar_url || ""
            })
            toast.success("Personel güncellendi.")
            setIsEditDialogOpen(false)
            setEditingStaff(null)
        } catch (err: any) {
            toast.error("Hata: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;

        try {
            await deleteStaff(id)
            toast.success("Personel silindi.")
        } catch (err: any) {
            toast.error("Silinemedi: " + err.message)
        }
    }

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        try {
            await toggleStaffStatus(id, !currentStatus)
            toast.success("Durum güncellendi.")
        } catch (err: any) {
            toast.error("Hata: " + err.message)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>Ekip Üyeleri</CardTitle>
                    <CardDescription>
                        İşletmenizde hizmet veren personeller.
                    </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Yeni Ekle</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Personel Ekle</DialogTitle>
                            <DialogDescription>
                                Personel bilgilerini giriniz.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStaff} className="space-y-4 py-4">
                            <ImageUpload
                                label="Personel Fotoğrafı"
                                value={newStaff.avatarUrl}
                                onChange={(url) => setNewStaff({ ...newStaff, avatarUrl: url })}
                            />
                            <div className="grid gap-2">
                                <Label>Ad Soyad</Label>
                                <Input
                                    value={newStaff.name}
                                    placeholder="Örn: Ahmet Yılmaz"
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Unvan / Uzmanlık</Label>
                                <Input
                                    value={newStaff.title}
                                    placeholder="Örn: Kıdemli Berber"
                                    onChange={e => setNewStaff({ ...newStaff, title: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Ekle
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {staff.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Henüz personel eklenmemiş.
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Personel</TableHead>
                                    <TableHead>Unvan</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.avatar_url || ""} />
                                                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">{member.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{member.title || "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={member.is_active}
                                                    onCheckedChange={() => handleToggleStatus(member.id, member.is_active)}
                                                    className="data-[state=checked]:bg-green-500"
                                                />
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {member.is_active ? "Aktif" : "Kapalı"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingStaff(member)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4 text-zinc-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Düzenleme Dialogu */}
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Personeli Düzenle</DialogTitle>
                                    <DialogDescription>
                                        Personel bilgilerini güncelleyin.
                                    </DialogDescription>
                                </DialogHeader>
                                {editingStaff && (
                                    <form onSubmit={handleUpdateStaff} className="space-y-4 py-4">
                                        <ImageUpload
                                            label="Personel Fotoğrafı"
                                            value={editingStaff.avatar_url || ""}
                                            onChange={(url) => setEditingStaff({ ...editingStaff, avatar_url: url })}
                                        />
                                        <div className="grid gap-2">
                                            <Label>Ad Soyad</Label>
                                            <Input
                                                value={editingStaff.name}
                                                onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Unvan / Uzmanlık</Label>
                                            <Input
                                                value={editingStaff.title || ""}
                                                onChange={e => setEditingStaff({ ...editingStaff, title: e.target.value })}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={loading}>
                                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                Güncelle
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
