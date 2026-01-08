"use client"

import { useState } from "react"
import { addService, deleteService, updateService } from "@/app/(admin)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Service {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    price: number;
}

interface ServiceManagerProps {
    services: Service[];
}

export function ServiceManager({ services }: ServiceManagerProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    // Simple form state for adding
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        duration: "30",
        price: "100"
    })

    async function handleAddService(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            await addService({
                title: newService.title,
                description: newService.description,
                duration: parseInt(newService.duration),
                price: parseFloat(newService.price)
            })
            toast.success("Hizmet eklendi.")
            setIsAddDialogOpen(false)
            setNewService({ title: "", description: "", duration: "30", price: "100" })
        } catch (err: any) {
            toast.error("Hata: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdateService(e: React.FormEvent) {
        e.preventDefault()
        if (!editingService) return

        setLoading(true)
        try {
            await updateService({
                id: editingService.id,
                title: editingService.title,
                description: editingService.description || "",
                duration: editingService.duration,
                price: editingService.price
            })
            toast.success("Hizmet güncellendi.")
            setIsEditDialogOpen(false)
            setEditingService(null)
        } catch (err: any) {
            toast.error("Hata: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;

        try {
            await deleteService(id)
            toast.success("Hizmet silindi.")
        } catch (err: any) {
            toast.error("Silinemedi: " + err.message)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>Hizmetler</CardTitle>
                    <CardDescription>
                        Müşterilerinizin randevu alabileceği seçenekler.
                    </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Yeni Ekle</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Hizmet Ekle</DialogTitle>
                            <DialogDescription>
                                Hizmet detaylarını giriniz.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddService} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label>Hizmet Adı</Label>
                                <Input
                                    value={newService.title}
                                    onChange={e => setNewService({ ...newService, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Açıklama</Label>
                                <Textarea
                                    value={newService.description}
                                    onChange={e => setNewService({ ...newService, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Süre (dk)</Label>
                                    <Input
                                        type="number"
                                        value={newService.duration}
                                        onChange={e => setNewService({ ...newService, duration: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Ücret (TL)</Label>
                                    <Input
                                        type="number"
                                        value={newService.price}
                                        onChange={e => setNewService({ ...newService, price: e.target.value })}
                                        required
                                    />
                                </div>
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
                {services.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Henüz hizmet eklenmemiş.
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hizmet</TableHead>
                                    <TableHead>Süre</TableHead>
                                    <TableHead>Fiyat</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.map(service => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            <div className="font-medium">{service.title}</div>
                                            <div className="text-xs text-muted-foreground">{service.description}</div>
                                        </TableCell>
                                        <TableCell>{service.duration} dk</TableCell>
                                        <TableCell>{service.price} ₺</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingService(service)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4 text-zinc-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
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
                                    <DialogTitle>Hizmeti Düzenle</DialogTitle>
                                    <DialogDescription>
                                        Hizmet bilgilerini güncelleyin.
                                    </DialogDescription>
                                </DialogHeader>
                                {editingService && (
                                    <form onSubmit={handleUpdateService} className="space-y-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Hizmet Adı</Label>
                                            <Input
                                                value={editingService.title}
                                                onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Açıklama</Label>
                                            <Textarea
                                                value={editingService.description || ""}
                                                onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Süre (dk)</Label>
                                                <Input
                                                    type="number"
                                                    value={editingService.duration}
                                                    onChange={e => setEditingService({ ...editingService, duration: parseInt(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Ücret (TL)</Label>
                                                <Input
                                                    type="number"
                                                    value={editingService.price}
                                                    onChange={e => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                                                    required
                                                />
                                            </div>
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
