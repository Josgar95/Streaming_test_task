const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function StreamingContent(titleFilter) {
    try {
        let query = `
            SELECT *
            FROM streaming_content
        `;

        let params = [];

        if (titleFilter) {
            if (titleFilter !== "" && titleFilter !== "undefined" && titleFilter !== "null"
                && titleFilter !== null && titleFilter !== undefined && titleFilter !== NaN) {
                query += " WHERE title ILIKE $1";
                params.push(`%${titleFilter}%`);
            }
        }

        query += " ORDER BY id ASC";

        const result = await pool.query(query, params);
        if (result.rows.length === 0) {
            return new Error('No streaming content found');
        } else if (result instanceof Error) {
            throw result;
        } else {
            return result.rows;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


// GET single stream
async function getStreamDetails(req, res) {
    const streams = readDB();
    const stream = streams.find(s => s.id == req.params.id);

    if (!stream) {
        return res.status(404).json({ error: 'Stream not found' });
    }

    // add more details if needed
    res.json(stream);
};

// CREATE stream
async function createStream(req, res) {
    const streams = readDB();
    const newStream = {
        //elements from req.body
    };

    streams.push(newStream);
    writeDB(streams);

    res.status(201).json(newStream);
};

// UPDATE stream
async function updateStream(req, res) {
    const streams = readDB();
    // add operations to update the stream based on req.params.id and req.body
    writeDB(streams);

    res.json(streams[index]);
};

// DELETE stream
async function deleteStream(req, res) {
    const streams = readDB();
    // add operations to delete the stream based on req.params.id

    res.json({ message: 'Stream deleted' });
};

module.exports = {
    StreamingContent,
    getStreamDetails,
    createStream,
    updateStream,
    deleteStream
}