const mongoose = require("mongoose");
const express = require("express");
const router = express.Router() ;

const Product = require("../models/Product");

// GET /products?category=Electronics&minPrice=100&maxPrice=1000&page=1&limit=10
router.get("/", async (req, res) => {
  try {
    const limit = 20;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.cursor) {
      filter._id = {
        $lt: new mongoose.Types.ObjectId(req.query.cursor)
      };
    }

    const products = await Product.find(filter)
      .sort({ _id: -1})
      .limit(limit);

    const nextCursor =
      products.length > 0
        ? products[products.length - 1]._id
        : null;

    res.json({
      products,
      nextCursor
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;
