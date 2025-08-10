import express from "express";
import { getAllUsers, getUserById, createUser } from "../models/userModel.js";

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
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await createUser(name, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;