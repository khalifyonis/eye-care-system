'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const params = useParams();
    const role = params.role as string;
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    useEffect(() => {
        // secure retrieval of user data
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.push('/login');
            }
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; max-age=0';
        router.push('/login');
    };

    if (!user) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between pb-6 border-b">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {role ? role.toUpperCase() : 'USER'} Dashboard
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Welcome back, {user.fullName}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </header>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-full">
                        <CardHeader>
                            <CardTitle>Welcome to EyeCare Manager</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Select an option from the menu or contact support if you need assistance.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
