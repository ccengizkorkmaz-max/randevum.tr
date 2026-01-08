import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ProfileView } from '@/components/public-profile/profile-view';
import { Metadata } from 'next';

async function getProfileData(slug: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!profile) return null;

    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', profile.id);

    const { data: staff } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: true });

    return {
        profile: {
            id: profile.id,
            businessName: profile.business_name,
            bio: profile.bio,
            avatarUrl: profile.avatar_url,
            coverUrl: profile.cover_url,
            phone: profile.phone,
            address: profile.address,
            locationUrl: profile.location_url
        },
        services: services?.map(s => ({
            id: s.id,
            title: s.title,
            duration: s.duration,
            price: s.price,
            description: s.description
        })) || [],
        staff: staff?.map(member => ({
            id: member.id,
            name: member.name,
            title: member.title,
            avatarUrl: member.avatar_url,
            isActive: member.is_active
        })) || []
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const data = await getProfileData(resolvedParams.slug);

    if (!data) {
        return {
            title: 'Profil Bulunamadı | Randevum.tr',
            description: 'Aradığınız profil bulunamadı.'
        };
    }

    return {
        title: `${data.profile.businessName} - Randevu Al | Randevum.tr`,
        description: `${data.profile.businessName} - ${data.profile.bio}`,
        openGraph: {
            title: `${data.profile.businessName} - Randevu Al`,
            description: data.profile.bio || undefined,
            images: data.profile.avatarUrl ? [data.profile.avatarUrl] : [],
        }
    };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const data = await getProfileData(resolvedParams.slug);

    if (!data) notFound();

    return <ProfileView profile={data.profile} services={data.services} staff={data.staff} />;
}
