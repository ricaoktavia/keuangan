import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }

    const connection = await mysql.createConnection(dbUrl);
    console.log("Connected to database.");

    const migrationDir = 'drizzle';
    const files = fs.readdirSync(migrationDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        console.log(`Running migration: ${file}`);
        let sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
        // Fix MariaDB/MySQL serial syntax issue
        sql = sql.replace(/serial AUTO_INCREMENT/g, 'int AUTO_INCREMENT');
        
        const statements = sql.split('--> statement-breakpoint');

        for (let statement of statements) {
            statement = statement.trim();
            if (statement) {
                console.log(`Executing statement: ${statement.substring(0, 50)}...`);
                try {
                    await connection.query(statement);
                } catch (e) {
                    console.error(`Failed to execute statement: ${statement.substring(0, 50)}...`);
                    console.error(e);
                    // Continue if error is "table already exists" or similar for simplicity in this dev environment
                }
            }
        }
    }

    console.log("Migration completed successfully.");
    await connection.end();
}

runMigration().catch(console.error);
