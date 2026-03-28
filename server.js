require("dotenv").config();
console.log("Server starting...");
const express = require('express');
const app = express();
const swaggerDocs = require('./swagger/swagger'); // importa la funzione

swaggerDocs(app); // inizializza swagger

app.use(express.json());

// Routes
app.use('/api/streaming', require('./routes/streaming'));
app.use("/api/auth", require("./routes/auth"));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// to launch debug mode: node --inspect server.js