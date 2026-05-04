import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { users, standardPrices } from './schema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

async function seed() {
    console.log('Seeding database...');
    
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection, { schema, mode: 'default' });

    // 1. Seed Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
        name: 'Administrator',
        email: 'admin@keuangan.go.id',
        password: hashedPassword,
        role: 'admin',
    }).onDuplicateKeyUpdate({ set: { name: 'Administrator' } });
    
    // Seed DPRD User
    const dprdPassword = await bcrypt.hash('dprd123', 10);
    await db.insert(users).values({
        name: 'Anggota DPRD',
        email: 'dprd@keuangan.go.id',
        password: dprdPassword,
        role: 'dprd',
    }).onDuplicateKeyUpdate({ set: { name: 'Anggota DPRD' } });

    // 2. Seed Standard Prices
    const prices = [
        { itemName: 'Semen (per sak)', maxPrice: '75000' },
        { itemName: 'Besi Beton (per batang)', maxPrice: '120000' },
        { itemName: 'Tenaga Kerja (per hari)', maxPrice: '150000' },
        { itemName: 'Pasir (per m3)', maxPrice: '300000' },
        { itemName: 'Batu Kali (per m3)', maxPrice: '450000' },
    ];

    for (const price of prices) {
        await db.insert(standardPrices).values(price)
            .onDuplicateKeyUpdate({ set: { maxPrice: price.maxPrice } });
    }

    console.log('Seeding completed!');
    await connection.end();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
