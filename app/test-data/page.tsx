import { createClient } from '@/utils/supabase/server';

export default async function TestDataPage() {
    const supabase = await createClient();
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: services } = await supabase.from('services').select('*');
    const { data: staff } = await supabase.from('staff').select('*');
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Database Debug Page</h1>
            <div className="mb-4 p-4 bg-gray-100 rounded border border-gray-300">
                <strong>Current AUTH User ID (auth.getUser()):</strong> {user?.id || "LOGGED OUT"}
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-2">PROFILES Table:</h2>
                    <pre className="p-4 bg-zinc-900 text-green-400 rounded overflow-auto max-h-[300px] border border-zinc-700">
                        {JSON.stringify(profiles, null, 2)}
                    </pre>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">SERVICES Table:</h2>
                    <pre className="p-4 bg-zinc-900 text-blue-400 rounded overflow-auto max-h-[300px] border border-zinc-700">
                        {JSON.stringify(services, null, 2)}
                    </pre>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-2">STAFF Table:</h2>
                    <pre className="p-4 bg-zinc-900 text-yellow-400 rounded overflow-auto max-h-[300px] border border-zinc-700">
                        {JSON.stringify(staff, null, 2)}
                    </pre>
                </section>
            </div>
        </div>
    );
}
