"use client"

import { useState } from "react";
import { updateAvailability } from "@/app/(admin)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvailabilitySettingsProps {
    initialData?: {
        name: string;
        active: boolean;
        start: string;
        end: string;
    }[];
}

export function AvailabilitySettings({ initialData }: AvailabilitySettingsProps) {
    const [loading, setLoading] = useState(false);

    const defaultDays = [
        { name: "Pazartesi", active: true, start: "09:00", end: "17:00" },
        { name: "Salı", active: true, start: "09:00", end: "17:00" },
        { name: "Çarşamba", active: true, start: "09:00", end: "17:00" },
        { name: "Perşembe", active: true, start: "09:00", end: "17:00" },
        { name: "Cuma", active: true, start: "09:00", end: "17:00" },
        { name: "Cumartesi", active: false, start: "10:00", end: "14:00" },
        { name: "Pazar", active: false, start: "10:00", end: "14:00" },
    ];

    // Merge initialData with defaultDays to ensure all days exist and order is correct
    const [days, setDays] = useState(() => {
        if (!initialData || initialData.length === 0) return defaultDays;

        return defaultDays.map(day => {
            const found = initialData.find(d => d.name === day.name);
            if (found) return found;
            return day;
        });
    });

    const hours = Array.from({ length: 24 }).map((_, i) => `${i.toString().padStart(2, '0')}:00`);

    async function handleSave() {
        setLoading(true);
        try {
            await updateAvailability(days);
            toast.success("Çalışma saatleri güncellendi.");
        } catch (error: any) {
            toast.error("Hata: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Çalışma Saatleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {days.map((day, index) => (
                    <div key={day.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4 w-32">
                            <Switch checked={day.active} onCheckedChange={(checked) => {
                                const newDays = [...days];
                                newDays[index].active = checked;
                                setDays(newDays);
                            }} />
                            <Label className={day.active ? "" : "text-muted-foreground"}>{day.name}</Label>
                        </div>

                        {day.active && (
                            <div className="flex items-center gap-2">
                                <Select
                                    value={day.start}
                                    onValueChange={(val) => {
                                        const newDays = [...days];
                                        newDays[index].start = val;
                                        setDays(newDays);
                                    }}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <span>-</span>
                                <Select
                                    value={day.end}
                                    onValueChange={(val) => {
                                        const newDays = [...days];
                                        newDays[index].end = val;
                                        setDays(newDays);
                                    }}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hours.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {!day.active && <span className="text-sm text-muted-foreground">Kapalı</span>}
                    </div>
                ))}
                <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kaydet
                </Button>
            </CardContent>
        </Card>
    );
}
