import db from "../db.js";

async function getProducts() {
  await db.read();
  return db.data.products;
}

async function getProductByName(name) {
  return await getProducts().then((products) =>
    products.find((product) => product.name == name)
  );
}

async function getProductById(id) {
  await db.read();
  return db.data.products.find((product) => product.id == id);
}

async function addProduct(product) {
  await db.read();
  db.data.products.push(product);
  await db.write();
  return product;
}

async function updateProductPrice(id, price) {
  await db.read();
  const index = db.data.products.findIndex((product) => product.id == id);
  if (index === -1) {
    return null;
  }
  db.data.products[index].price = price;
  await db.write();
  return db.data.products[index];
}

async function deleteProduct(id) {
  await db.read();
  const index = db.data.products.findIndex((product) => product.id == id);
  if (index === -1) {
    return null;
  }
  const deletedProduct = db.data.products.splice(index, 1);
  await db.write();
  return deletedProduct;
}

export default {
  getProducts,
  getProductByName,
  addProduct,
  updateProductPrice,
  deleteProduct,
};
