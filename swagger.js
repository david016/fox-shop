import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fox shop API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["routes.js"],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app, port) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

export default setupSwagger;
