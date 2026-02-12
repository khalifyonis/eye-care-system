import { RegisterForm } from "@/components/auth/register-form"
import { Eye } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 order-last lg:order-first">
                <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8">
                    <Eye className="h-6 w-6 text-blue-600" />
                    <span>EyeCare Manager</span>
                </div>
                <RegisterForm />
                <div className="mt-4 text-sm text-center">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
            <div className="hidden lg:flex flex-col bg-slate-900 text-white p-10 justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Eye className="h-6 w-6 text-blue-400" />
                    <span>EyeCare Manager</span>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Join the Team
                    </h1>
                    <p className="text-slate-400">
                        Create accounts for doctors, receptionists, and administrators.
                    </p>
                </div>
                <div className="text-sm text-slate-500 text-right">
                    © 2026 Eye Care System. Thesis Project.
                </div>
            </div>
        </div>
    )
}
