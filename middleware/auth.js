const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Must be: Bearer <token>
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid authorization header format" });
    }

    const token = parts[1];
    console.log("TOKEN RICEVUTO:", token);
    console.log("JWT_SECRET USATA:", process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains userId
        next();
    } catch (err) {
        console.log("ERRORE VERIFICA JWT:", err.message);
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;