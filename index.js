import express from "express";
import routes from "./routes.js";
import setupSwagger from "./swagger.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  setupSwagger(app, port);
});
