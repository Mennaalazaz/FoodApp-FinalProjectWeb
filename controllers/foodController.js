const Food = require('../models/Food');

// Add food
exports.addFood = async (req, res) => {
  try {
    const { Restaurant_ID, Category_ID, Name, Description, Price, imageURL } = req.body;
    const food = await Food.create({ Restaurant_ID, Category_ID, Name, Description, Price, imageURL });
    res.json({ Food_ID: food.Food_ID, Name: food.Name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List foods by restaurant
exports.listFoodsByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const foods = await Food.findAll({
      where: { Restaurant_ID: restaurant_id }
    });

    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// List foods by category
exports.listFoodsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const foods = await Food.findAll({ where: { Category_ID: category_id } });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  

// Get food details
exports.getFoodDetails = async (req, res) => {
  try {
    const { food_id } = req.params;
    const food = await Food.findByPk(food_id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};