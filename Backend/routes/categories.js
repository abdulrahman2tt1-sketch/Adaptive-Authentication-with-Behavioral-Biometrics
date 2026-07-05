const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;
    const c = new Category({ name, slug });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE category (by id)
router.put("/:id", async (req, res) => {
  try {
    const { name, slug } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE category (by id)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
