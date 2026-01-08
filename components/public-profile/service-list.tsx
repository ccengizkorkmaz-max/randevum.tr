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
            <div className="grid gap-2 md:grid-cols-3">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className={`cursor-pointer transition-all hover:shadow-sm active:scale-[0.98] border ${selectedServiceId === service.id ? "border-primary bg-primary/5" : "border-zinc-200"
                            }`}
                        onClick={() => onSelect(service)}
                    >
                        <CardContent className="px-3 py-1">
                            <div className="flex items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="font-semibold text-sm leading-none truncate">{service.title}</h3>
                                        <span className="font-bold text-xs text-zinc-900 whitespace-nowrap">{service.price} ₺</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground leading-none">
                                        <span className="flex items-center gap-0.5 whitespace-nowrap bg-zinc-50 px-1.5 py-0.5 rounded-sm border border-zinc-100">
                                            <Clock className="w-2.5 h-2.5" /> {service.duration} dk
                                        </span>
                                        {service.description && (
                                            <span className="truncate opacity-70 border-l pl-2 border-zinc-200">
                                                {service.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {selectedServiceId === service.id ? (
                                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border border-zinc-300" />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
