"use client"

import { useState } from "react";
import { BioCard } from "./bio-card";
import { ServiceList } from "./service-list";
import { BookingWidget } from "./booking-widget";

interface Service {
    id: string;
    title: string;
    duration: number;
    price: number;
    description: string | null;
}

interface Staff {
    id: string;
    name: string;
    title: string | null;
    avatarUrl: string | null;
    isActive: boolean;
}

interface Profile {
    id: string;
    businessName: string;
    bio: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    phone: string;
    address: string | null;
    locationUrl: string | null;
}

interface ProfileViewProps {
    profile: Profile;
    services: Service[];
    staff: Staff[];
}

export function ProfileView({ profile, services, staff }: ProfileViewProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <div className="max-w-md md:max-w-4xl mx-auto min-h-screen bg-white shadow-xl overflow-hidden flex flex-col">
            <div className="bg-gradient-to-b from-zinc-100 to-white pb-6 pt-10">
                <BioCard
                    businessName={profile.businessName}
                    bio={profile.bio}
                    avatarUrl={profile.avatarUrl}
                    coverUrl={profile.coverUrl}
                    address={profile.address}
                    locationUrl={profile.locationUrl}
                />
            </div>

            <div className="flex-1 px-4 space-y-8 pb-10">
                <ServiceList
                    services={services}
                    onSelect={setSelectedService}
                    selectedServiceId={selectedService?.id}
                />

                <div id="booking-widget">
                    <BookingWidget
                        service={selectedService}
                        businessPhone={profile.phone}
                        userId={profile.id}
                        staff={staff}
                    />
                </div>
            </div>

            <div className="p-4 text-center text-xs text-muted-foreground border-t bg-gray-50">
                Powered by <span className="font-bold">Randevum.tr</span>
            </div>
        </div>
    );
}
