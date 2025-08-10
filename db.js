import pg from "pg";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

// Forcer la résolution IPv4
dns.setDefaultResultOrder("ipv4first");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;
