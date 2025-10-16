import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAllUsers, getUserById, createUser, deleteUser, verifyUser } from "../models/userModel.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ton_secret_ultra_secure";

router.get("/", authenticateToken, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get("/:id", authenticateToken, async (req, res) => {
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
        const { username, email, password, passwordBis } = req.body;
        if (password !== passwordBis) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
        }
        const newUser = await createUser(username, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await verifyUser(email, password);
        if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error("ERREUR DETAILLEE :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
})

router.post("/avatar", authenticateToken, async (req, res) => {
    try {
        const { avatarUrl } = req.body;
        if (!avatarUrl) {
            return res.status(400).json({ error: "avatarUrl est requis" });
        }

        const userId = req.user.id; // défini par authenticateToken
        const updatedUser = await updateAvatar(userId, avatarUrl);

        if (!updatedUser) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        res.json({
            message: "Avatar mis à jour avec succès",
            user: updatedUser
        });
    } catch (err) {
        console.error("Erreur avatar :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export default router;