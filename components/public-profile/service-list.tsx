import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Service {
    id: string;
    title: string;
    duration: number;
    price: number;
    description: string | null;
}

interface ServiceListProps {
    services: Service[];
    onSelect: (service: Service) => void;
    selectedServiceId?: string;
}

export function ServiceList({ services, onSelect, selectedServiceId }: ServiceListProps) {
    return (
        <div className="w-full space-y-3">
            <h2 className="text-lg font-semibold px-1">Hizmetler</h2>
            <div className="grid gap-3">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className={`cursor-pointer transition-all hover:shadow-md active:scale-[0.98] border-2 ${selectedServiceId === service.id ? "border-primary bg-primary/5" : "border-transparent"
                            }`}
                        onClick={() => onSelect(service)}
                    >
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{service.title}</h3>
                                {service.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                        {service.description}
                                    </p>
                                )}
                                <div className="flex items-center text-sm text-muted-foreground mt-1.5 gap-2">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {service.duration} dk
                                    </span>
                                    <span>•</span>
                                    <span>{service.price} ₺</span>
                                </div>
                            </div>
                            <div>
                                {selectedServiceId === service.id && (
                                    <Badge variant="default">Seçildi</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
