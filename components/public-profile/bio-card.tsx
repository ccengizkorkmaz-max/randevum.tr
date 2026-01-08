import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface BioCardProps {
    businessName: string;
    bio: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    address: string | null;
    locationUrl: string | null;
}

export function BioCard({ businessName, bio, avatarUrl, coverUrl, address, locationUrl }: BioCardProps) {
    return (
        <div className="flex flex-col items-center text-center pb-2 space-y-2 relative">
            <div
                className="absolute top-0 left-0 w-full h-20 bg-cover bg-center z-0"
                style={{
                    backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
                    backgroundColor: coverUrl ? 'transparent' : '#f3f4f6'
                }}
            />
            <div className="z-10 mt-10">
                <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                    <AvatarImage src={avatarUrl || ""} alt={businessName} className="object-cover" />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground font-bold">
                        {businessName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="px-4 space-y-1">
                <h1 className="text-xl font-bold tracking-tight">{businessName}</h1>
                {bio && <p className="text-muted-foreground text-xs leading-snug line-clamp-2">{bio}</p>}

                {(address || locationUrl) && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {address && (
                            <div className="flex items-center gap-1 text-zinc-500 text-[10px]">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span>{address}</span>
                            </div>
                        )}
                        {locationUrl && (
                            <a
                                href={locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-6 px-3 rounded-full text-[10px] font-medium gap-1 border border-zinc-200 hover:bg-zinc-50 transition-colors"
                            >
                                <ExternalLink className="w-2.5 h-2.5" />
                                Konum
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
