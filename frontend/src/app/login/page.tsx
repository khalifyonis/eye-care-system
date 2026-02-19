'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // If user provided an email, extract the username part before @
            // This is a temporary frontend hack until backend supports email login
            let loginUsername = username;
            if (username.includes('@')) {
                loginUsername = username.split('@')[0];
            }

            const response = await api.post('/auth/login', {
                username: loginUsername,
                password,
            });

            const { token, user } = response.data;

            // Save token and user info
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set cookie for Middleware access
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict`;

            // Redirect based on role
            switch (user.role) {
                case 'ADMIN':
                    router.push('/dashboard/admin');
                    break;
                case 'DOCTOR':
                    router.push('/dashboard/doctor');
                    break;
                case 'PHARMACIST':
                    router.push('/dashboard/pharmacist');
                    break;
                case 'OPTICIAN':
                    router.push('/dashboard/optician');
                    break;
                default:
                    router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Login failed', err);
            // Display the specific error message from backend if available
            setError(err.response?.data?.message || 'Invalid credentials or server error');
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
                        Welcome Back
                    </h1>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white dark:bg-slate-950 p-8">
                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Login</h2>
                        <p className="text-muted-foreground">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="username">
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                placeholder=""
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Password
                                </label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:border-red-900/20">
                                {error}
                            </div>
                        )}

                        <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white" type="submit" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0 h-auto font-normal underline" onClick={() => router.push('/register')}>
                            Register here
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
}
