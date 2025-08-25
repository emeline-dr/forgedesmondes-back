import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ton_secret_ultra_secure";


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromHeader || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Erreur token :", err);
        return res.status(403).json({ message: "Token invalide" });
    }
};


export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Non authentifié" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
}

