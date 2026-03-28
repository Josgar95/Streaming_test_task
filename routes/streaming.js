const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    StreamingContent,
    getStreamingDetails,
    createStreaming,
    updateStreaming,
    deleteStreaming
} = require('../controllers/streamingController');


/**
 * @swagger
 * /api/streaming:
 *   get:
 *     summary: Obtain all streaming content
 *     description: Return a list of streaming content with pagination and optional title filter.
 *     tags:
 *       - Streaming
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter streaming content by title (case-insensitive)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of streaming content
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
        const allContent = await StreamingContent(req.query);
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
 *     tags:
 *       - Streaming
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
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
    try {
        const streamingDetail = await getStreamingDetails(req.params.id);
        if (streamingDetail instanceof Error) {
            throw streamingDetail;
        }
        else {
            res.json(streamingDetail);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/streaming/create_stream:
 *   post:
 *     summary: Create a new streaming content
 *     tags:
 *       - Streaming
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StreamingCreate'
 *     responses:
 *       201:
 *         description: Streaming content created
 */
router.post('/create_stream', auth, async (req, res) => {
    try {
        const streamingCreation = await createStreaming(req.body);
        if (streamingCreation instanceof Error) {
            throw streamingCreation;
        }
        else {
            res.json(streamingCreation);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/streaming/update_stream/{id}:
 *   put:
 *     summary: Update a streaming content by ID
 *     tags:
 *       - Streaming
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/StreamingUpdate'
 *     responses:
 *       200:
 *         description: Streaming updated
 *       404:
 *         description: Streaming not found
 */
router.put('/update_stream/:id', auth, async (req, res) => {
    try {
        const streamingUpdate = await updateStreaming(req.params.id, req.body);
        if (streamingUpdate instanceof Error) {
            throw streamingUpdate;
        }
        else {
            res.json(streamingUpdate);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/streaming/{id}:
 *   delete:
 *     summary: Delete a streaming content by ID
 *     tags:
 *       - Streaming
 *     security:
 *       - bearerAuth: []
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
router.delete('/:id', auth, async (req, res) => {
    try {
        const streamingDeletion = await deleteStreaming(req.params.id);
        if (streamingDeletion instanceof Error) {
            throw streamingDeletion;
        }
        else {
            res.json({ message: "Stream deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;