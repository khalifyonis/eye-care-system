"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground">
                        Welcome to the Eye Care Management System! You have successfully logged in.
                    </p>
                    <div className="flex justify-center">
                        <Button onClick={() => router.push("/login")}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
