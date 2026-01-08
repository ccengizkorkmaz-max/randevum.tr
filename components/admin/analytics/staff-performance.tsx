'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface StaffPerformanceProps {
    data: { name: string; revenue: number; count: number }[]
}

export function StaffPerformance({ data }: StaffPerformanceProps) {
    return (
        <Card className="col-span-4 lg:col-span-4">
            <CardHeader>
                <CardTitle>Personel Performansı</CardTitle>
                <CardDescription>
                    Personele göre toplam gelir (Onaylı) ve randevu sayıları.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₺${value}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            // @ts-ignore
                            formatter={(value: any, name: any) => {
                                if (name === 'revenue') return [new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(value) || 0), 'Gelir']
                                return [value, 'Randevu']
                            }}
                            labelStyle={{ color: 'black' }}
                            contentStyle={{ borderRadius: '8px' }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" name="Gelir" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="count" name="Randevu Sayısı" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
