import express from "express";
import productService from "./services/productService.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - count
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         count:
 *           type: integer
 *           description: The count of the product
 *       example:
 *         name: "Product name"
 *         price: 100
 *         count: 10
 *     PriceHistory:
 *       type: array
 *       items:
 *         type: object
 *         additionalProperties:
 *           type: number
 *       example:
 *         - { "Initial price": 15 }
 *         - { "2025-02-10T00:23:05.681Z - 2025-02-10T00:25:30.163Z": 10 }
 *         - { "2025-02-10T00:25:30.163Z - Present": 20 }
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product operations
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get the products (all or filtered by name)
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the product to get
 *     responses:
 *       200:
 *         description: Product(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get("/products", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    const products = await productService.getProducts();
    return res.json(products);
  }

  const product = await productService.getProductByName(name);
  if (!product) {
    return res.status(404).send("Product not found");
  }
  res.json(product);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get("/products/:id", async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    res.status(404).send("Product not found");
    return;
  }
  res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *    summary: Create a new product
 *    tags: [Product]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      201:
 *        description: The product was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *       description: Name, price and count are required
 */
router.post("/products", async (req, res) => {
  const { name, price, count } = req.body;
  if (!name || !price || !count) {
    res.status(400).send("Name, price and count are required");
    return;
  }
  const newProduct = { id: Date.now(), name, price, count };
  const addedProduct = await productService.addProduct(newProduct);
  res.status(201).json(addedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *    summary: Update the product by id
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *          required: true
 *          description: Numeric ID of the product to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The new name of the product
 *              price:
 *                type: number
 *                description: The new price of the product
 *              count:
 *                type: integer
 *                description: The new count of the product
 *    responses:
 *      200:
 *        description: The product was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: The product was not found
 */
router.patch("/products/:id", async (req, res) => {
  const updatedProduct = await productService.updateProduct(
    req.params.id,
    req.body
  );
  if (!updatedProduct) {
    return res.status(404).send("Product not found");
  }
  res.json(updatedProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.delete("/products/:id", async (req, res) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  if (!deletedProduct) {
    return res.status(404).send("Product not found");
  }
  res.json(deletedProduct);
});

/**
 * @swagger
 * /products/{id}/price-history:
 *   get:
 *     summary: Get the product price history by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Numeric ID of the product to get price history
 *     responses:
 *       200:
 *         description: The product price history by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PriceHistory"
 *       404:
 *         description: The product was not found
 */
router.get("/products/:id/price-history", async (req, res) => {
  const priceHistory = await productService.getPriceHistory(req.params.id);
  if (!priceHistory) {
    return res.status(404).send(`The product was not found`);
  }
  res.json(priceHistory);
});

export default router;
