console.log("Server starting...");
require("dotenv").config();
const express = require('express');
const app = express();
const streamingRoutes = require('./routes/streaming');
const swaggerDocs = require('./swagger/swagger'); // importa la funzione

swaggerDocs(app); // inizializza swagger

app.use(express.json());

// Routes
app.use('/api/streaming', streamingRoutes);
console.log("ROUTES LOADED:");
streamingRoutes.stack.forEach(r => {
    console.log(r.route?.path, Object.keys(r.route?.methods || {}));
});

console.log("SERVER FILE PATH:", __filename);
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
console.log("SERVER PID:", process.pid);
// to launch debug mode: node --inspect server.js