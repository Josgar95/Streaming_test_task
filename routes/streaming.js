const express = require('express');
const router = express.Router();
const auth = require('../auth');
const {
    StreamingContent,
    getStreamDetails,
    createStream,
    updateStream,
    deleteStream
} = require('../controllers/streamingController');


/**
 * @swagger
 * /api/streaming:
 *   get:
 *     summary: Obtain all streaming content
 *     description: Return a list of streaming content with pagination and optional title filter.
 *     tags:
 *       - Streaming
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter streaming content by title (case-insensitive)
 *     responses:
 *       200:
 *         description: Streaming content list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StreamingContent'
 *       500:
 *         description: Internal Server Error
 */
router.get('/', auth, async (req, res) => {
    try {
        const allContent = await StreamingContent(req.query.title);
        if (allContent instanceof Error) {
            throw allContent;
        }
        else {
            res.json(allContent);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




/**
 * @swagger
 * /api/streaming/{id}:
 *   get:
 *     summary: Get stream details by ID
 *     tags: [Streaming]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Streaming details
 *       404:
 *         description: Streaming not found
 */
router.get('/:id', auth, async (req, res) => {
    getStreamDetails(req, res);
});

/**
 * @swagger
 * /api/streaming/create_stream:
 *   post:
 *     summary: Create a new stream
 *     tags: [Streaming]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stream'
 *     responses:
 *       201:
 *         description: Stream created
 */
router.post('/', auth, createStream);

/**
 * @swagger
 * /api/streaming/update_stream/{id}:
 *   put:
 *     summary: Update a stream
 *     tags: [Streaming]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stream'
 *     responses:
 *       200:
 *         description: Stream updated
 *       404:
 *         description: Stream not found
 */
router.put('/:id', auth, updateStream);

/**
 * @swagger
 * /api/streaming/{id}:
 *   delete:
 *     summary: Delete a stream
 *     tags: [Streaming]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stream deleted
 *       404:
 *         description: Stream not found
 */
router.delete('/:id', auth, deleteStream);

module.exports = router;