const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getStreams,
    getStreamDetails,
    createStream,
    updateStream,
    deleteStream
} = require('../controllers/streamingController');

router.get('/', auth, getStreams);

// routes/streaming.js — performance issue present
router.get('/', auth, async (req, res) => {
    try {
        const allContent = await StreamingContent.findAll({
            limit: 20,
            offset: 0
        });
        const filtered = allContent.filter(item =>
            item.genre === req.query.genre
        );
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', auth, getStreamDetails);
router.post('/', auth, createStream);
router.put('/:id', auth, updateStream);
router.delete('/:id', auth, deleteStream);

module.exports = router;