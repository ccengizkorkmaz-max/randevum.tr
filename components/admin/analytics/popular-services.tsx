import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PopularServicesProps {
    data: { name: string; value: number }[]
}

export function PopularServices({ data }: PopularServicesProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Popüler Hizmetler</CardTitle>
                <CardDescription>
                    En çok tercih edilen ilk 5 işlem
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
                    {data.map((service, index) => (
                        <div key={index} className="flex flex-col space-y-2 p-3 border rounded-lg bg-muted/20">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium truncate mr-2" title={service.name}>{service.name}</span>
                                <span className="text-lg font-bold">{service.value}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${(service.value / maxValue) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <p className="text-sm text-muted-foreground col-span-full text-center">Veri yok</p>}
                </div>
            </CardContent>
        </Card>
    )
}
