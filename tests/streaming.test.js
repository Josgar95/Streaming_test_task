const request = require("supertest");
const app = require("../server");

describe("Streaming API", () => {

    let token;
    let createdId;

    beforeAll(async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "123456" });

        token = res.body.token;
    });

    test("POST /api/streaming → crea uno stream", async () => {
        const res = await request(app)
            .post("/api/streaming")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test", url: "http://test.com", category: "news" });

        expect(res.status).toBe(201);
        createdId = res.body.id;
    });

    test("GET /api/streaming → lista stream", async () => {
        const res = await request(app)
            .get("/api/streaming")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("DELETE /api/streaming/:id → elimina stream", async () => {
        const res = await request(app)
            .delete(`/api/streaming/${createdId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

});