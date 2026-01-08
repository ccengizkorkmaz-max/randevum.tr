'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PeakHoursChartProps {
    data: { hour: string; count: number }[]
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>En Yoğun Saatler</CardTitle>
                <CardDescription>
                    Gün içinde randevuların en sık olduğu saatler.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="hour"
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
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-amber-500" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
