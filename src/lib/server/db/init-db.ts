import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function init() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }

    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    
    // Connect without DB name to create it
    const connection = await mysql.createConnection({
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
    });

    console.log(`Creating database dynamic: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log("Database created or already exists.");
    await connection.end();
}

init().catch(console.error);
