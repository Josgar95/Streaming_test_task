const jwt = require("jsonwebtoken");
// jest.spyOn(console, "log").mockImplementation(() => { });
// jest.spyOn(console, "error").mockImplementation(() => { });

const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");

describe("Streaming API", () => {

    let token;
    let createdId;
    const bcrypt = require("bcrypt");

    beforeAll(async () => {
        await pool.query("DELETE FROM users");
        const hashed = await bcrypt.hash("123456", 10);

        await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2)`,
            ["test@test.com", hashed]
        );

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "123456" });

        token = res.body.token;
    });

    // test per login
    test("POST /api/auth/login → wrong email returns 401", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "wrong@test.com", password: "123456" });

        expect(res.status).toBe(401);
    });

    test("POST /api/auth/login → wrong password returns 401", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "wrongpass" });

        expect(res.status).toBe(401);
    });

    test("POST /api/auth/login → missing fields returns 400", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com" });

        expect(res.status).toBe(400);
    });

    test("POST /api/auth/login → empty body returns 400", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(res.status).toBe(400);
    });

    // test per streaming
    test("POST /api/streaming/create_stream → missing token returns 401", async () => {
        const res = await request(app)
            .post("/api/streaming/create_stream")
            .send({
                title: "Test",
                description: "Desc",
                thumbnail_url: "http://example.com",
                video_url: "http://example.com"
            });

        expect(res.status).toBe(401);
    });

    test("POST /api/streaming/create_stream → invalid token returns 403", async () => {
        const res = await request(app)
            .post("/api/streaming/create_stream")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                title: "Test",
                description: "Desc",
                thumbnail_url: "http://example.com",
                video_url: "http://example.com"
            });

        expect(res.status).toBe(403);
    });

    test("POST /api/streaming/create_stream → missing fields returns 400", async () => {
        const res = await request(app)
            .post("/api/streaming/create_stream")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Only title"
            });

        expect(res.status).toBe(400);
    });

    test("POST /api/streaming/create_stream → create a streaming", async () => {
        const res = await request(app)
            .post("/api/streaming/create_stream")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Stream",
                description: "A test description",
                thumbnail_url: "http://example.com/thumb.jpg",
                video_url: "http://example.com/video.mp4"
            });

        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        createdId = res.body.id;
    });

    test("PUT /api/streaming/update_stream/:id → invalid id returns 404", async () => {
        const res = await request(app)
            .put("/api/streaming/update_stream/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated",
                description: "Updated",
                thumbnail_url: "http://example.com",
                video_url: "http://example.com"
            });

        expect(res.status).toBe(404);
    });

    test("PUT /api/streaming/update_stream/:id → update streaming", async () => {
        const res = await request(app)
            .put(`/api/streaming/update_stream/${createdId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Title",
                description: "Updated description",
                thumbnail_url: "http://example.com/newthumb.jpg",
                video_url: "http://example.com/newvideo.mp4"
            });

        expect(res.status).toBe(200);

        // L’oggetto aggiornato deve contenere i campi modificati
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe("Updated Title");
        expect(res.body.description).toBe("Updated description");
        expect(res.body.thumbnail_url).toBe("http://example.com/newthumb.jpg");
        expect(res.body.video_url).toBe("http://example.com/newvideo.mp4");
    });

    test("GET /api/streaming → streaming list", async () => {
        const res = await request(app)
            .get("/api/streaming")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("DELETE /api/streaming/:id → invalid id returns 404", async () => {
        const res = await request(app)
            .delete("/api/streaming/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    test("DELETE /api/streaming/:id → elimina stream", async () => {
        const res = await request(app)
            .delete(`/api/streaming/${createdId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    afterAll(async () => {
        await pool.end();
    });
});