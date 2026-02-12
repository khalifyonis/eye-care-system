import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'DOCTOR', 'RECEPTIONIST']),
    name: z.string().min(2),
    phone: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, name, phone } = registerSchema.parse(body);

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });

        // If needed, create related Patient/Doctor profile here based on role
        if (role === 'DOCTOR') {
            await db.doctor.create({
                data: {
                    userId: user.id,
                    specialization: 'General Optometry', // Default
                    fees: 50.0, // Default
                }
            })
        }

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, email: user.email, role: user.role } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        const errorMessage = error?.issues?.[0]?.message || error?.message || 'Something went wrong';
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}
