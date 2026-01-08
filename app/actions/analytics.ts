'use server'

import { createClient } from '@/utils/supabase/server'
import { startOfDay, endOfDay, subDays, format, getHours, setHours, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { tr } from 'date-fns/locale'

type Period = 'daily' | 'weekly' | 'monthly' | 'all'

export async function getAnalyticsData(period: Period = 'weekly') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Tarih aralığını belirle
    let startDate = new Date()
    let endDate = new Date()

    if (period === 'daily') {
        startDate = startOfDay(new Date())
        endDate = endOfDay(new Date())
    } else if (period === 'weekly') {
        startDate = subDays(new Date(), 7)
        endDate = endOfDay(new Date())
    } else if (period === 'monthly') {
        startDate = subDays(new Date(), 30)
        endDate = endOfDay(new Date())
    } else {
        startDate = new Date(0) // Hepsi
    }

    // Randevuları çek
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
            id,
            start_time,
            status,
            service_id,
            services ( title, price, currency ),
            staff ( name )
        `)
        .eq('user_id', user.id)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())

    if (error) throw new Error(error.message)

    // 1. Özet İstatistikler (Cards)
    const totalAppointments = appointments.length
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length

    const totalRevenue = appointments
        .filter(a => a.status === 'confirmed')
        .reduce((sum, app: any) => sum + (app.services?.price || 0), 0)

    // 2. Gelir Grafiği (Revenue Trend)
    const revenueByDay: Record<string, number> = {}

    // Grafiği doldurmak için boş günleri oluştur (Son 7 veya 30 gün)
    const daysToLookBack = period === 'weekly' ? 7 : period === 'monthly' ? 30 : 7;
    for (let i = daysToLookBack; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const key = format(d, 'dd MMM', { locale: tr }) // örn: 08 Oca
        revenueByDay[key] = 0
    }

    appointments.forEach((app: any) => {
        if (app.status === 'confirmed') {
            const dateKey = format(new Date(app.start_time), 'dd MMM', { locale: tr })
            if (revenueByDay[dateKey] !== undefined) {
                revenueByDay[dateKey] += (app.services?.price || 0)
            }
        }
    })

    const revenueChartData = Object.entries(revenueByDay).map(([name, value]) => ({
        name,
        total: value
    }))

    // 3. Popüler Hizmetler (Popular Services)
    const serviceCounts: Record<string, number> = {}
    appointments.forEach((app: any) => {
        const title = app.services?.title || 'Bilinmeyen'
        serviceCounts[title] = (serviceCounts[title] || 0) + 1
    })

    const popularServicesData = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1]) // En çoktan aza
        .slice(0, 5) // İlk the 5
        .map(([name, value]) => ({ name, value }))

    // 4. Yoğun Saatler (Peak Hours)
    const hoursCounts = new Array(24).fill(0).map((_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        count: 0
    }))

    appointments.forEach((app: any) => {
        const hour = getHours(new Date(app.start_time))
        if (hoursCounts[hour]) {
            hoursCounts[hour].count++
        }
    })

    // Sadece mesai saatlerini filtrele (08:00 - 20:00 arası mantıklı)
    const peakHoursData = hoursCounts.slice(8, 20)

    // 5. Personel Performansı (Staff Performance)
    const staffStats: Record<string, { revenue: number; count: number }> = {}

    appointments.forEach((app: any) => {
        if (app.status !== 'cancelled') { // Bekleyen veya Onaylı
            const staffName = app.staff?.name || 'Atanmamış'
            if (!staffStats[staffName]) {
                staffStats[staffName] = { revenue: 0, count: 0 }
            }
            staffStats[staffName].count += 1

            if (app.status === 'confirmed') {
                staffStats[staffName].revenue += (app.services?.price || 0)
            }
        }
    })

    const staffPerformanceData = Object.entries(staffStats)
        .map(([name, stats]) => ({
            name,
            revenue: stats.revenue,
            count: stats.count
        }))
        .sort((a, b) => b.revenue - a.revenue) // Gelire göre sırala

    return {
        cards: {
            totalAppointments,
            confirmedAppointments,
            cancelledAppointments,
            totalRevenue
        },
        charts: {
            revenue: revenueChartData,
            popularServices: popularServicesData,
            peakHours: peakHoursData,
            staffPerformance: staffPerformanceData
        }
    }
}
