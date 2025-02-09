import express from "express";
import productService from "./services/productService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello World!");
});

router.get("/product", async (req, res) => {
  const products = await productService.getProducts();
  res.json(products);
});

router.get("/product/:id", async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    res.status(404).send("Product not found");
    return;
  }
  res.json(product);
});

router.post("/product", async (req, res) => {
  const { name, price, count } = req.body;
  if (!name || !price || !count) {
    res.status(400).send("Name, price and count are required");
    return;
  }
  const newProduct = { id: Date.now(), name, price, count };
  const addedProduct = await productService.addProduct(newProduct);
  res.status(201).json(addedProduct);
});

router.put("/product/:id", async (req, res) => {
  const { price } = req.body;
  const updatedProduct = await productService.updateProductPrice(
    req.params.id,
    price
  );
  if (!updatedProduct) {
    res.status(404).send("Product not found");
    return;
  }
  res.json(updatedProduct);
});

router.delete("/product/:id", async (req, res) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  if (!deletedProduct) {
    res.status(404).send("Product not found");
    return;
  }
  res.json(deletedProduct);
});

export default router;
