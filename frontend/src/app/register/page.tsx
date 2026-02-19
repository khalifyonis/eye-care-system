'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: 'DOCTOR' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            // On success, redirect to login
            router.push('/login?registered=true');
        } catch (err: any) {
            console.error('Registration failed', err);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center w-1/2 bg-slate-900 text-white p-12 relative">
                <div className="absolute top-12 left-12 flex items-center gap-2">
                    <Eye className="w-8 h-8 text-blue-400" />
                    <span className="text-xl font-bold">EyeCare Manager</span>
                </div>

                <div className="max-w-md space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        Create Account
                    </h1>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white dark:bg-slate-950 p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Register</h2>
                        <p className="text-muted-foreground">
                            Create a new  account
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Full Name</label>
                            <Input
                                name="fullName"
                                placeholder=""
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Username</label>
                            <Input
                                name="username"
                                placeholder=""
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Password</label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="PHARMACIST">Pharmacist</option>
                                <option value="OPTICIAN">Optician</option>
                            </select>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md bg-transparent">
                                {error}
                            </div>
                        )}

                        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register User'}
                        </Button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0 h-auto font-normal underline" onClick={() => router.push('/login')}>
                            Sign in
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
}
