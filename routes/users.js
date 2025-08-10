import express from "express";
import { getAllUsers, getUserById } from "../models/userModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const users = await getUserById(id);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
})

export default router;