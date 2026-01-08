'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateAppointmentStatus } from '../actions'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function ConfirmationButtons({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)

    const handleAction = async (status: 'confirmed' | 'cancelled') => {
        setLoading(true)
        try {
            await updateAppointmentStatus(id, status)
            toast.success(status === 'confirmed' ? 'Randevu onaylandı!' : 'Randevu reddedildi.')
        } catch (error) {
            toast.error('Bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-2 gap-3 w-full">
            <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => handleAction('cancelled')}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                Reddet
            </Button>
            <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction('confirmed')}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Onayla
            </Button>
        </div>
    )
}
