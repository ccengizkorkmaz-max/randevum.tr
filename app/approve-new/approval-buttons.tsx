'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createAppointment } from '@/app/(public)/booking-actions'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ApprovalData {
    userId: string;
    serviceId: string;
    staffId: string | null;
    customerName: string;
    customerPhone: string;
    startTime: string;
    endTime: string;
}

export function ApprovalButtons({ data }: { data: ApprovalData }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleApprove = async () => {
        setLoading(true)
        try {
            const result = await createAppointment(data)

            if (result.success) {
                toast.success('Randevu başarıyla oluşturuldu!')
                // Başarılı olunca normal onay sayfasına yönlendirelim ki "Onaylandı" görsün
                router.push(`/confirm/${result.data.id}`)
            } else {
                toast.error('Hata: ' + result.error)
            }
        } catch (error) {
            toast.error('Beklenmeyen bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full space-y-3">
            <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                Onayla ve Oluştur
            </Button>
            <p className="text-xs text-center text-muted-foreground px-4">
                Bu randevu henüz takvimde yok. Onayladığınız an eklenecek.
            </p>
        </div>
    )
}
