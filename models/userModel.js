import pool from "../db.js";
import bcrypt from "bcrypt";

export async function getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
}

export async function getUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0];
}

export async function verifyUser(email, password) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return false;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : false;
}

export async function createUser(username, email, password) {
    const createdAt = new Date();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
        "INSERT INTO users (username, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, hashedPassword, createdAt]
    );
    return result.rows[0];
}

export async function deleteUser(id) {
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
    );
    return result.rowCount;
}

export async function updateAvatar(userUuid, avatarUrl) {
    const result = await pool.query(
        "UPDATE users SET avatar_url = $1 WHERE uuid = $2 RETURNING *",
        [avatarUrl, userUuid]
    );
    return result.rows[0];
}

