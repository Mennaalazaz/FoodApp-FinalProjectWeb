const Category = require('../models/Category');

// Add category
exports.addCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    const category = await Category.create({ Name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
