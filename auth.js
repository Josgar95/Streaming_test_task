// middleware/auth.js — CONTAINS BUGS. Fix before integrating.
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // BUG: The original code did not check if authHeader exists before splitting it.
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ');
    // BUG: The original code did not check if the token exists after splitting.
    if (token.length !== 2 || token[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    jwt.verify(token[1], 'secret123', (err, decoded) => {
        if (err) {
            // BUG: The original code did not return after sending the response, which could lead to calling next()
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
module.exports = authMiddleware;