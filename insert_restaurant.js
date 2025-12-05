const bcrypt = require('bcryptjs');
const { Restaurant } = require('./models');

async function insertRestaurant() {
  try {
    const hashedPassword = await bcrypt.hash('myRestaurant55', 10);

    const restaurant = await Restaurant.create({
      name: 'Delicious Bites',
      email: 'contact@deliciousbites.com',
      password: hashedPassword,
      phone: '01000000000',
      address: '12 Nile Street, Cairo, Egypt',
      logoURL: 'https://share.google/images/p309GotAcUKr7JUkS',
      is_active: true
    });

    console.log('Restaurant inserted successfully:', restaurant.Restaurant_ID);
    process.exit(0);
  } catch (error) {
    console.error('Error inserting restaurant:', error);
    process.exit(1);
  }
}

insertRestaurant();
