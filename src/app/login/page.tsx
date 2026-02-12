import { LoginForm } from "@/components/auth/login-form"
import { Eye } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col bg-slate-900 text-white p-10 justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Eye className="h-6 w-6 text-blue-400" />
                    <span>EyeCare Manager</span>
                </div>
                <div>
                   <h1 className="text-3xl font-semibold mb-3">
                    Eye Care Management System
                    </h1>
                    <p className="text-slate-400 text-sm">
                    Manage appointments, patients, and inventory efficiently.
                    </p>
                </div>
                <div className="text-sm text-slate-500">
                    © 2026 Eye Care System. Thesis Project.
                </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
                <div className="lg:hidden flex items-center gap-2 font-bold text-xl mb-8">
                    <Eye className="h-6 w-6 text-blue-600" />
                    <span>EyeCare Manager</span>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
