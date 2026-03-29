const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

async function registerNewUser(body) {
    try {
        const { error } = registerSchema.validate(body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = body;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
            [email, hashedPassword]
        );

        return result.rows[0];
    } catch (err) {
        console.error("Register error:", err);
        throw new Error("Internal server error");
    }
}

async function loginUser(body) {
    try {
        const { error } = loginSchema.validate(body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = body;

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error("Invalid credentials");
        }

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return { token };
    } catch (err) {
        console.error("Login error:", err);
        throw new Error("Internal server error");
    }
}

module.exports = {
    registerNewUser,
    loginUser
};