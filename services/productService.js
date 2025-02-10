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

async function updateProduct(id, requestBody) {
  const { name, price, count } = requestBody;

  await db.read();

  const index = db.data.products.findIndex((product) => product.id == id);
  if (index === -1) {
    return null;
  }

  const product = db.data.products[index];

  if (name) {
    product.name = name;
  }

  if (price) {
    product.price = price;

    const priceChange = {
      productId: id,
      productName: product.name,
      previousPrice: product.price,
      newPrice: price,
      changedAt: new Date().toISOString(),
    };

    db.data.changes.push(priceChange);
  }

  if (count) {
    product.count = count;
  }

  await db.write();
  return product;
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

async function getProductPriceChanges(id) {
  await db.read();
  return db.data.changes.filter((change) => change.productId == id);
}

async function getPriceHistory(productId) {
  let priceHistory = [];

  await db.read();

  const changes = db.data.changes
    .filter((change) => change.productId === productId)
    .sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

  if (changes.length === 0) {
    const product = await getProductById(productId);
    if (!product) {
      return null;
    }

    const actualPrice = product.price;
    priceHistory.push({ "Actual price": actualPrice });

    return priceHistory;
  }

  const initialPrice = changes[0].previousPrice;
  priceHistory.push({ "Initial price": initialPrice });

  for (let i = 0; i < changes.length; i++) {
    const currentChange = changes[i];
    const nextChange = changes[i + 1];

    let dateFrom = new Date(currentChange.changedAt).toISOString();
    let dateTo = nextChange
      ? new Date(nextChange.changedAt).toISOString()
      : "Present";

    priceHistory.push({
      [`${dateFrom} - ${dateTo}`]: currentChange.newPrice,
    });
  }

  return priceHistory;
}

export default {
  getProducts,
  getProductByName,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductPriceChanges,
  getPriceHistory,
};
