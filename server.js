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

module.exports = app;