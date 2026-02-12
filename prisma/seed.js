const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    await client.connect();
    console.log('Connected to database for seeding...');

    try {
        // 1. Create Admin User
        const adminEmail = 'admin@eyecare.com';
        const adminPassword = 'hashed_password_placeholder'; // In real app, hash this!

        // Check if exists
        const res = await client.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);
        if (res.rows.length === 0) {
            await client.query(
                'INSERT INTO "User" (id, email, password, role, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW())',
                [adminEmail, adminPassword, 'ADMIN']
            );
            console.log('Created Admin User:', adminEmail);
        } else {
            console.log('Admin user already exists.');
        }

        // 2. Create Sample Products
        const products = [
            {
                sku: 'FRM-001',
                name: 'Classic Aviator',
                brand: 'Ray-Ban',
                type: 'Frame',
                price: 150.00,
                stock: 20
            },
            {
                sku: 'LNS-001',
                name: 'Anti-Blue Light Lens',
                brand: 'Essilor',
                type: 'Lens',
                price: 80.00,
                stock: 100
            }
        ];

        for (const p of products) {
            const pRes = await client.query('SELECT * FROM "Product" WHERE sku = $1', [p.sku]);
            if (pRes.rows.length === 0) {
                await client.query(
                    'INSERT INTO "Product" (id, name, brand, type, price, stock, sku, "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())',
                    [p.name, p.brand, p.type, p.price, p.stock, p.sku]
                );
                console.log('Created Product:', p.name);
            } else {
                console.log('Product already exists:', p.name);
            }
        }

    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
