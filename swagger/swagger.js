const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Streaming API",
            version: "1.0.0",
            description: "API for managing streaming content with JWT authentication."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string" },
                        password: { type: "string" }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        token: { type: "string" }
                    }
                },
                StreamingContent: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        title: { type: "string" },
                        description: { type: "string" },
                        thumbnail_url: { type: "string" },
                        video_url: { type: "string" },
                        created_at: { type: "string", format: "date-time" },
                        updated_at: { type: "string", format: "date-time" }
                    }
                },
                StreamingCreate: {
                    type: "object",
                    required: ["title", "description", "thumbnail_url", "video_url"],
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        thumbnail_url: { type: "string" },
                        video_url: { type: "string" }
                    }
                }
            }
        },
        security: [
            { bearerAuth: [] }
        ]
    },
    apis: ["./routes/*.js"] // <-- Swagger leggerà i commenti JSDoc nelle route
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = (app) => {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};