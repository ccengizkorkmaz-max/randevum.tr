import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentList } from "@/components/admin/appointment-list";
import { AvailabilitySettings } from "@/components/admin/availability-settings";
import { ProfileSettings } from "@/components/admin/profile-settings";
import { ServiceManager } from "@/components/admin/service-manager";
import { StaffManager } from "@/components/admin/staff-manager";
import { CustomerManager } from "@/components/admin/customer-manager";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "../logout-button";
import { AnalyticsView } from "@/components/admin/analytics/analytics-view";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Lütfen giriş yapınız.</div>
    }

    const [appointmentsResult, profileResult, servicesResult, availabilityResult, staffResult, customersResult] = await Promise.all([
        supabase
            .from('appointments')
            .select(`
                id,
                customer_name,
                customer_phone,
                customer_id,
                start_time,
                end_time,
                status,
                services ( title ),
                staff ( name )
            `)
            .eq('user_id', user.id)
            .order('start_time', { ascending: true }),
        supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
        supabase
            .from('services')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true }),
        supabase
            .from('availability')
            .select('*')
            .eq('user_id', user.id),
        supabase
            .from('staff')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true }),
        supabase
            .from('customers')
            .select('*')
            .eq('user_id', user.id)
            .order('name', { ascending: true })
    ]);

    const profile = profileResult.data;

    if (!profile) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Profiliniz Bulunamadı</h2>
                    <p className="text-muted-foreground mb-4">Devam etmek için profilinizi oluşturmalısınız.</p>
                    <a href="/onboarding" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
                        Profil Oluştur
                    </a>
                </div>
            </div>
        );
    }

    const appointmentData = appointmentsResult.data;
    const services = servicesResult.data || [];
    const availability = availabilityResult.data || [];
    const staff = staffResult.data || [];
    const customers = customersResult.data || [];

    // Calculate customer stats (cancelled & no_show counts)
    const customerStats = new Map<string, { cancelled: number, noShow: number }>();

    appointmentData?.forEach(app => {
        const phone = app.customer_phone;
        if (!phone) return;

        const current = customerStats.get(phone) || { cancelled: 0, noShow: 0 };

        if (app.status === 'cancelled') current.cancelled++;
        if (app.status === 'no_show') current.noShow++;

        customerStats.set(phone, current);
    });

    const appointments = appointmentData?.map(app => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = app.services as any;
        const staffRaw = app.staff as any;
        const staffMember = Array.isArray(staffRaw) ? staffRaw[0] : staffRaw;
        const stats = customerStats.get(app.customer_phone) || { cancelled: 0, noShow: 0 };

        return {
            id: app.id,
            customerId: app.customer_id,
            customerName: app.customer_name,
            customerPhone: app.customer_phone,
            serviceTitle: service?.title || 'Bilinmiyor',
            staffName: staffMember?.name || null,
            date: new Date(app.start_time).toLocaleDateString('tr-TR'),
            time: new Date(app.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            rawDate: app.start_time,
            status: app.status as any,
            customerStats: stats
        };
    }) || [];

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md pt-4 md:pt-8 -mx-4 px-4 md:-mx-8 md:px-8 mb-6 border-b border-zinc-100/50">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        {profile?.cover_url && (
                            <div className="h-16 w-24 md:h-20 md:w-32 relative rounded-lg overflow-hidden bg-muted shadow-sm ring-1 ring-black/5 hidden sm:block">
                                <img
                                    src={profile.cover_url}
                                    alt="Kapak Fotoğrafı"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <div className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest mb-1 px-2 py-0.5 bg-primary/5 rounded border border-primary/10 w-fit">
                                {profile.business_name}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Yönetici Paneli</h1>
                            <p className="text-sm text-muted-foreground hidden md:block">Randevularınızı yönetin.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <LogoutButton />
                        {profile?.avatar_url && (
                            <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-background shadow-md">
                                <AvatarImage src={profile.avatar_url} className="object-cover" />
                                <AvatarFallback>{profile.business_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="mb-4 flex-wrap h-auto">
                    <TabsTrigger value="appointments">Gelen Randevular</TabsTrigger>
                    <TabsTrigger value="customers">Müşteriler</TabsTrigger>
                    <TabsTrigger value="analytics">Raporlar</TabsTrigger>
                    <TabsTrigger value="services">Hizmet Yönetimi</TabsTrigger>
                    <TabsTrigger value="staff">Ekip Yönetimi</TabsTrigger>
                    <TabsTrigger value="profile">Profil Ayarları</TabsTrigger>
                    <TabsTrigger value="availability">Çalışma Saatleri</TabsTrigger>
                </TabsList>
                <TabsContent value="appointments">
                    <AppointmentList appointments={appointments} />
                </TabsContent>
                <TabsContent value="customers">
                    <CustomerManager customers={customers.map(c => ({
                        id: c.id,
                        name: c.name,
                        phone: c.phone || '',
                        email: c.email || '',
                        notes: c.notes || ''
                    }))} />
                </TabsContent>
                <TabsContent value="analytics">
                    <AnalyticsView />
                </TabsContent>
                <TabsContent value="services">
                    <ServiceManager services={services.map(s => ({
                        id: s.id,
                        title: s.title,
                        description: s.description,
                        duration: s.duration,
                        price: s.price
                    }))} />
                </TabsContent>
                <TabsContent value="staff">
                    <StaffManager staff={staff} />
                </TabsContent>
                <TabsContent value="profile">
                    {profile && (
                        <ProfileSettings profile={{
                            businessName: profile.business_name,
                            bio: profile.bio,
                            phone: profile.phone,
                            avatarUrl: profile.avatar_url,
                            coverUrl: profile.cover_url,
                            address: profile.address,
                            locationUrl: profile.location_url,
                            slug: profile.slug
                        }} />
                    )}
                </TabsContent>
                <TabsContent value="availability">
                    <AvailabilitySettings initialData={availability.map(a => ({
                        name: a.day_of_week,
                        active: a.is_active,
                        start: a.start_time.slice(0, 5), // '09:00:00' -> '09:00'
                        end: a.end_time.slice(0, 5)
                    }))} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
