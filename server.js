const express = require('express');
const app = express();

// Swagger
const swaggerDocs = require('./swagger/swagger');
swaggerDocs(app);

// Middleware
app.use(express.json());

// Routes
app.use('/api/streaming', require('./routes/streaming'));
app.use('/api/auth', require('./routes/auth'));
app.get("/", (req, res) => {
    res.send("Streaming API is running. Visit /docs for documentation.");
});
module.exports = app;