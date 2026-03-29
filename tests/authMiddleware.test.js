const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

describe("Auth middleware", () => {

    test("Should call next() and set req.user", () => {
        // 1. Mock del token valido
        const validToken = "validtoken";

        // 2. Mock dell'header Authorization
        const req = {
            headers: {
                authorization: `Bearer ${validToken}`
            }
        };

        // 3. Mock di res e next
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        // 4. Mock di jwt.verify → restituisce un payload valido
        jest.spyOn(jwt, "verify").mockReturnValue({ userId: 123 });

        // 5. Esegui il middleware
        auth(req, res, next);

        // 6. Verifiche
        expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
        expect(req.user).toEqual({ userId: 123 });
        expect(next).toHaveBeenCalled(); // next() deve essere chiamato
    });


    test("Missing Authorization → 401", () => {
        const req = { headers: {} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("Header without Bearer → 401", () => {
        const req = { headers: { authorization: "abc123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    test("Invalid token → 403", () => {
        jest.spyOn(jwt, "verify").mockImplementation(() => { throw new Error(); });

        const req = { headers: { authorization: "Bearer invalid" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });

});