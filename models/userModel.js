import pool from "../db.js";

export async function getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
}

export async function getUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0];
}

export async function createUser(username, email, password) {
    const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password]
    );
    return result.rows[0];
}