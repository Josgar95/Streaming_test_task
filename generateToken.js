const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { user: "debug" },
    "secret123",
    { expiresIn: "1h" }
);

console.log("TOKEN DI DEBUG:");
console.log(token);