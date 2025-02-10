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
 *   put:
 *    summary: Update the product price by id
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
 *              price:
 *                type: number
 *                description: The new price of the product
 *            required:
 *              - price
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
router.put("/products/:id", async (req, res) => {
  const { price } = req.body;
  if (!price) {
    return res.status(400).send("Price is required");
  }

  const updatedProduct = await productService.updateProductPrice(
    req.params.id,
    price
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

export default router;
