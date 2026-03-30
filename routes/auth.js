const express = require("express");
const router = express.Router();
const { registerNewUser, loginUser } = require("../controllers/authController");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
    try {
        const result = await registerNewUser(req.body);
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        return res.status(201).json(result.user);
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
    try {
        const result = await loginUser(req.body);
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        return res.status(201).json({ token: result.token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }

});

module.exports = router;