'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, Calculator, Phone, Mail, FileText } from "lucide-react"
import Link from "next/link"

interface Customer {
    id: string
    name: string
    phone: string
    email: string
    notes: string
}

interface CustomerManagerProps {
    customers: Customer[]
}

export function CustomerManager({ customers }: CustomerManagerProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle>Müşteriler</CardTitle>
                    <CardDescription>
                        Müşteri listesi ve iletişim bilgileri.
                    </CardDescription>
                </div>
                {/* Gelecekte buraya 'Yeni Müşteri Ekle' butonu gelecek */}
                <Button variant="outline" size="sm" className="hidden">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Yeni Müşteri
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-4">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                        placeholder="İsim veya telefon ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">İsim</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Telefon</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">E-posta</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground hidden md:table-cell">Notlar</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                <Link href={`/customers/${customer.id}`} className="hover:underline text-primary">
                                                    {customer.name}
                                                </Link>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {customer.phone}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle hidden md:table-cell">
                                                {customer.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {customer.email}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle hidden md:table-cell">
                                                {customer.notes && (
                                                    <div className="flex items-center gap-2 text-muted-foreground truncate max-w-[200px]">
                                                        <FileText className="h-3 w-3" />
                                                        {customer.notes}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                            Müşteri bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
