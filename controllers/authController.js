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
    const { error } = registerSchema.validate(body);
    if (error) {
        return { status: 400, error: error.details[0].message };
    }

    const { email, password } = body;
    if (!email || !password) {
        return { status: 400, error: "Email and password are required" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         RETURNING id, email`,
        [email, hashedPassword]
    );

    return { status: 201, user: result.rows[0] };
}
async function loginUser(body) {
    const { error } = loginSchema.validate(body);
    if (error) {
        return { status: 400, error: error.details[0].message };
    }

    const { email, password } = body;

    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        return { status: 401, error: "Invalid credentials" };
    }

    const user = result.rows[0];
    if (!user) {
        return { status: 401, error: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { status: 401, error: "Invalid credentials" };
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { status: 201, token };
}

module.exports = {
    registerNewUser,
    loginUser
};