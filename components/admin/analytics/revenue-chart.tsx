'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface RevenueChartProps {
    data: { name: string; total: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Gelir Analizi</CardTitle>
                <CardDescription>
                    Günlük bazda elde edilen toplam gelir (Onaylı randevular).
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₺${value}`}
                        />
                        <Tooltip
                            formatter={(value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)}
                            contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
