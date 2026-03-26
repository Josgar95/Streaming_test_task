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
const { Op, fn, col, where } = require("sequelize");
const { getAllStreamingContent } = require("../controllers/streamingController");


/**
 * @swagger
 * /streams:
 *   get:
 *     summary: Obtain all streaming content
 *     description: Return a list of streaming content with pagination and optional genre filter.
 *     tags:
 *       - Streaming
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter streaming content by genre (case-insensitive)
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
router.get("/", auth, getAllStreamingContent);



// routes/streaming.js — performance issue present

/**
 * @swagger
 * /streams:
 *   get:
 *     summary: Ottiene tutti i contenuti streaming
 *     description: Restituisce una lista di contenuti con paginazione e filtro opzionale per genere.
 *     tags:
 *       - Streaming
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtra i contenuti per genere (case-insensitive)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Numero di risultati per pagina
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero della pagina
 *     responses:
 *       200:
 *         description: Lista dei contenuti streaming
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StreamingContent'
 *       500:
 *         description: Errore interno del server
 */

router.get('/', auth, async (req, res) => {
    try {
        const genreFilter = req.query.genre ? req.query.genre.toLowerCase() : null;
        const allContent = await StreamingContent.findAll({
            where: genreFilter
                ? where(fn('LOWER', col('genre')), genreFilter)
                : undefined,

            limit: 10,
            offset: 0
        });

        res.json(allContent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /streaming/{id}:
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
 * /streams:
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
 * /streams/{id}:
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
 * /streams/{id}:
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