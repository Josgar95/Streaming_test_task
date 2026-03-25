const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/streaming.json');

const readDB = () => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all streams
exports.getStreams = (req, res) => {
    const streams = readDB();
    // add pagination
    res.json(streams);
};

// GET single stream
exports.getStreamDetails = (req, res) => {
    const streams = readDB();
    const stream = streams.find(s => s.id == req.params.id);

    if (!stream) {
        return res.status(404).json({ error: 'Stream not found' });
    }

    // add more details if needed
    res.json(stream);
};

// CREATE stream
exports.createStream = (req, res) => {
    const streams = readDB();
    const newStream = {
        //elements from req.body
    };

    streams.push(newStream);
    writeDB(streams);

    res.status(201).json(newStream);
};

// UPDATE stream
exports.updateStream = (req, res) => {
    const streams = readDB();
    // add operations to update the stream based on req.params.id and req.body
    writeDB(streams);

    res.json(streams[index]);
};

// DELETE stream
exports.deleteStream = (req, res) => {
    const streams = readDB();
    // add operations to delete the stream based on req.params.id

    res.json({ message: 'Stream deleted' });
};