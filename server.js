require("dotenv").config();
const express = require('express');
const app = express();
const streamingRoutes = require('./routes/streaming');
const swaggerDocs = require('./swagger/swagger'); // importa la funzione

swaggerDocs(app); // inizializza swagger

app.use(express.json());

// Routes
app.use('/api/streaming', streamingRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});