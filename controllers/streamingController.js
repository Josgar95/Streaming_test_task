const pool = require('../config/db');

// GET all streaming content with optional title filter
async function StreamingContent(queryParams) {
    try {
        const page = parseInt(queryParams.page) || 1;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = (page - 1) * limit;

        let params = [];
        let query = `
            SELECT * FROM streaming_content
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `;

        const countQuery = `
            SELECT COUNT(*) FROM streaming_content
        `;

        const [result, countResult] = await Promise.all([
            pool.query(query, [limit, offset]),
            pool.query(countQuery)
        ]);

        const total = parseInt(countResult.rows[0].count);


        if (queryParams.title) {
            if (queryParams.title !== "" && queryParams.title !== "undefined" && queryParams.title !== "null"
                && queryParams.title !== null && queryParams.title !== undefined && queryParams.title !== NaN) {
                query += " WHERE title ILIKE $1";
                params.push(`%${queryParams.title}%`);
            }
        }
        query += " ORDER BY id ASC";

        if (!result || !result.rows) {
            throw new Error("Database error: invalid result");
        }
        if (result.rows.length === 0) {
            throw new Error("No streaming content found");
        }

        return {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit),
            data: result.rows
        };

    } catch (error) {
        console.error("Pagination error:", error);
        throw new Error(error.message);
    }
}


// GET single streaming details by ID
async function getStreamingDetails(id) {
    try {
        let query = `
            SELECT *
            FROM streaming_content
            where id = $1
        `;

        const result = await pool.query(query, [id]);
        if (!result || !result.rows) {
            throw new Error("Database error: invalid result");
        }
        if (result.rows.length === 0) {
            throw new Error("No streaming content found");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

// CREATE streaming
async function createStreaming(body) {
    try {

        const { title, description, thumbnail_url, video_url } = body;
        if (!title || !description || !thumbnail_url || !video_url) {
            throw new Error("All fields (title, description, thumbnail_url, video_url) are required");
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
            throw new Error("Database error: invalid result");
        }
        if (result.rows.length === 0) {
            throw new Error("No streaming content found");
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error in createStreaming:", error);
        throw new Error(error.message);
    }
};

// UPDATE streaming
async function updateStreaming(id, body) {
    try {

        const { title, description, thumbnail_url, video_url } = body;
        if (!title && !description && !thumbnail_url && !video_url) {
            throw new Error("At least one field (title, description, thumbnail_url, video_url) is required");
        }

        let query = `
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
            body.title,
            body.description,
            body.thumbnail_url,
            body.video_url,
            id
        ]);

        if (!result || !result.rows) {
            throw new Error("Database error: invalid result");
        }
        if (result.rows.length === 0) {
            throw new Error("No streaming content found");
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

// DELETE streaming
async function deleteStreaming(id) {
    try {
        let query = `
            DELETE FROM streaming_content
            WHERE id = $1
            RETURNING *
        `;

        const result = await pool.query(query, [id]);

        if (!result || !result.rows) {
            throw new Error("Database error: invalid result");
        }
        if (result.rows.length === 0) {
            throw new Error("No streaming content found");
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    StreamingContent,
    getStreamingDetails,
    createStreaming,
    updateStreaming,
    deleteStreaming
}