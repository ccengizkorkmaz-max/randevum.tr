import { createAdminClient, createClient } from "@/utils/supabase/server";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default async function AdminProfilesPage() {
    const supabaseAdmin = await createAdminClient();
    const supabase = await createClient();

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (profilesError) {
        return <div>Error loading profiles: {profilesError.message}</div>
    }

    // Fetch all users from Auth (to get emails)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
        return <div>Error loading auth users: {usersError.message}</div>
    }

    // Merge data
    const profilesWithEmail = profiles.map(profile => {
        const user = users.find(u => u.id === profile.id);
        return {
            ...profile,
            email: user?.email || "No Email",
            last_sign_in_at: user?.last_sign_in_at
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kayıtlı Profil Listesi ({profilesWithEmail.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>İşletme Adı</TableHead>
                                <TableHead>Slug (Link)</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Telefon</TableHead>
                                <TableHead>Kayıt Tarihi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profilesWithEmail.map((profile) => (
                                <TableRow key={profile.id}>
                                    <TableCell className="font-medium">{profile.business_name}</TableCell>
                                    <TableCell>
                                        <a href={`/${profile.slug}`} target="_blank" className="text-blue-600 hover:underline">
                                            /{profile.slug}
                                        </a>
                                    </TableCell>
                                    <TableCell>{profile.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={profile.role === 'admin' ? 'destructive' : 'secondary'}>
                                            {profile.role || 'user'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{profile.phone || '-'}</TableCell>
                                    <TableCell>
                                        {format(new Date(profile.created_at), "d MMMM yyyy", { locale: tr })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
