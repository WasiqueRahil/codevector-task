require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    await Product.deleteMany({});

    const products = [];

    for (let i = 1; i <= 200000; i++) {
      products.push({
        name: `Product ${i}`,
        category:
          categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 10000) + 100,
      });
    }

    console.log("Inserting products...");

    await Product.insertMany(products);

    console.log("200000 products inserted");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedProducts();
