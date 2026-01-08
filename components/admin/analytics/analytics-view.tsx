'use client'

import { useState, useEffect } from 'react'
import { getAnalyticsData } from "@/app/actions/analytics"
import { RevenueChart } from "./revenue-chart"
import { StatsCards } from "./stats-cards"
import { PeakHoursChart } from "./peak-hours-chart"
import { PopularServices } from "./popular-services"
import { StaffPerformance } from "./staff-performance"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export function AnalyticsView() {
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly')
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const result = await getAnalyticsData(period)
                setData(result)
            } catch (error) {
                console.error("Analiz verileri yüklenemedi", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [period])

    if (loading && !data) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">İşletme Raporları</h2>
                <Tabs value={period} onValueChange={(v) => setPeriod(v as any)} className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="weekly">Bu Hafta</TabsTrigger>
                        <TabsTrigger value="monthly">Bu Ay</TabsTrigger>
                        <TabsTrigger value="all">Tüm Zamanlar</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <StatsCards data={data.cards} />

            <div className="grid gap-4">
                <PopularServices data={data.charts.popularServices} />
            </div>

            {/* Staff Performance Chart */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-full">
                    <StaffPerformance data={data.charts.staffPerformance} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart data={data.charts.revenue} />
                <PeakHoursChart data={data.charts.peakHours} />
            </div>
        </div>
    )
}
