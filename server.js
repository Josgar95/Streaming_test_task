const express = require('express');
const app = express();
const streamingRoutes = require('./routes/streamingRoutes');

app.use(express.json());

// Routes
app.use('/api/streaming', streamingRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});