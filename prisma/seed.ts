import { PrismaClient } from '../node_modules/.prisma/client/client'

// @ts-ignore
const prisma = new PrismaClient({})

async function main() {
    console.log('Seeding database...')

    // 1. Create Admin User
    const adminEmail = 'admin@eyecare.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: 'hashed_password_placeholder', // In real app, hash this!
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // 2. Create Sample Products
    const frame = await prisma.product.upsert({
        where: { sku: 'FRM-001' },
        update: {},
        create: {
            name: 'Classic Aviator',
            brand: 'Ray-Ban',
            type: 'Frame',
            price: 150.00,
            stock: 20,
            sku: 'FRM-001',
        },
    })

    const lens = await prisma.product.upsert({
        where: { sku: 'LNS-001' },
        update: {},
        create: {
            name: 'Anti-Blue Light Lens',
            brand: 'Essilor',
            type: 'Lens',
            price: 80.00,
            stock: 100,
            sku: 'LNS-001',
        },
    })
    console.log({ frame, lens })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
