const bcrypt = require('bcryptjs');
const { Restaurant } = require('./models');

async function checkRestaurant() {
  try {
    const restaurant = await Restaurant.findOne({
      where: { email: 'contact@deliciousbites.com' }
    });

    if (restaurant) {
      console.log('Restaurant found:', {
        id: restaurant.Restaurant_ID,
        name: restaurant.name,
        email: restaurant.email,
        passwordHash: restaurant.password
      });

      // Test password
      const isMatch = await bcrypt.compare('myRestaurant55', restaurant.password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        console.log('Password does not match. Updating password...');
        const hashedPassword = await bcrypt.hash('myRestaurant55', 10);
        restaurant.password = hashedPassword;
        await restaurant.save();
        console.log('Password updated successfully');
      }
    } else {
      console.log('Restaurant not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRestaurant();
