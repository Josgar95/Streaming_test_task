const pool = require('../config/db');

// GET all streaming content with optional title filter
async function StreamingContent(queryParams) {
    try {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = (page - 1) * limit;
        let query = `
            SELECT *
            FROM streaming_content
        `;

        let params = [];
        let paramIndex = 1;

        if (queryParams.title && queryParams.title.trim() !== "") {
            query += ` WHERE title ILIKE $${paramIndex}`;
            params.push(`%${queryParams.title}%`);
            paramIndex++;
        }

        query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const countQuery = `SELECT COUNT(*) FROM streaming_content`;

        const [result, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery)
        ]);
        const total = parseInt(countResult.rows[0].count);

        if (!result || !result.rows) {
            return {
                status: 500,
                error: "Database error: invalid result"
            };
        }

        if (result.rows.length === 0) {
            return {
                status: 404,
                error: "No streaming content found"
            };
        }

        return {
            status: 200,
            data: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit),
                data: result.rows
            }
        };
    } catch (error) {
        console.error("Pagination error:", error);
        return {
            status: 500,
            error: error.message || "Internal server error"
        };
    }
}


// GET single streaming details by ID
async function getStreamingDetails(id) {
    try {
        const query = `
            SELECT *
            FROM streaming_content
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);

        if (!result || !result.rows) {
            return {
                status: 500,
                error: "Database error: invalid result"
            };
        }

        if (result.rows.length === 0) {
            return {
                status: 404,
                error: "No streaming content found"
            };
        }

        return {
            status: 200,
            data: result.rows[0]
        };
    } catch (error) {
        return {
            status: 500,
            error: error.message || "Internal server error"
        };
    }
}

// CREATE streaming
async function createStreaming(body) {
    try {

        const { title, description, thumbnail_url, video_url } = body;
        if (!title || !description || !thumbnail_url || !video_url) {
            return {
                status: 400,
                error: "All fields (title, description, thumbnail_url, video_url) are required"
            };
        }

        let query = `
            insert into streaming_content (
                title, description, thumbnail_url, video_url
            )
            values ($1, $2, $3, $4)
            returning *
        `;

        const result = await pool.query(query, [
            body.title,
            body.description,
            body.thumbnail_url,
            body.video_url
        ]);

        if (!result || !result.rows) {
            return {
                status: 500,
                error: "Database error: invalid result"
            };
        }
        if (result.rows.length === 0) {
            return {
                status: 500,
                error: "No streaming content found"
            };
        }

        return {
            status: 201,
            data: result.rows[0]
        };

    } catch (error) {
        console.error("Error in createStreaming:", error);
        return {
            status: 500,
            error: error.message || "Internal server error"
        };
    }
};

// UPDATE streaming
async function updateStreaming(id, body) {
    try {
        const { title, description, thumbnail_url, video_url } = body;
        if (!title && !description && !thumbnail_url && !video_url) {
            return {
                status: 400,
                error: "At least one field (title, description, thumbnail_url, video_url) is required"
            };
        }

        const query = `
            UPDATE streaming_content
            SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                thumbnail_url = COALESCE($3, thumbnail_url),
                video_url = COALESCE($4, video_url),
                updated_at = NOW()
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(query, [
            title,
            description,
            thumbnail_url,
            video_url,
            id
        ]);

        if (!result || !result.rows) {
            return {
                status: 500,
                error: "Database error: invalid result"
            };
        }

        if (result.rows.length === 0) {
            return {
                status: 404,
                error: "No streaming content found"
            };
        }

        return {
            status: 200,
            data: result.rows[0]
        };
    } catch (error) {
        return {
            status: 500,
            error: error.message || "Internal server error"
        };
    }
}

// DELETE streaming
async function deleteStreaming(id) {
    try {
        const query = `
            DELETE FROM streaming_content
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        if (!result || !result.rows) {
            return {
                status: 500,
                error: "Database error: invalid result"
            };
        }

        if (result.rows.length === 0) {
            return {
                status: 404,
                error: "No streaming content found"
            };
        }

        return {
            status: 200,
            data: result.rows[0]
        };
    } catch (error) {
        return {
            status: 500,
            error: error.message || "Internal server error"
        };
    }
}

module.exports = {
    StreamingContent,
    getStreamingDetails,
    createStreaming,
    updateStreaming,
    deleteStreaming
}