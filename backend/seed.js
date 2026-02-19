import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './src/generated/prisma/client.ts';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
    const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (existing) {
        console.log('Admin user already exists. Skipping seed.');
        await pool.end();
        return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            fullName: 'System Admin',
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin user created:', { id: admin.id, username: admin.username, role: admin.role });
    console.log('Login with: username="admin", password="admin123"');
    await pool.end();
}

seed().catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
});
