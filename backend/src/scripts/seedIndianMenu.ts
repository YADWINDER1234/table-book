import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { MenuItem } from '../models'; // Adjust path if needed

dotenv.config();

const indianMenu = [
  { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes and peas.', category: 'Appetizers', price: 5.99, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Vegetable Pakora', description: 'Deep-fried fritters made with mixed vegetables and gram flour.', category: 'Appetizers', price: 6.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Onion Bhaji', description: 'Crispy onion fritters seasoned with mild spices.', category: 'Appetizers', price: 5.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Paneer Tikka', description: 'Grilled chunks of paneer marinated in spices.', category: 'Appetizers', price: 10.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Papdi Chaat', description: 'Crispy dough wafers with potatoes, chickpeas, chilies, yogurt, and chutney.', category: 'Appetizers', price: 7.99, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Aloo Tikki', description: 'Spiced potato patties served with sweet and tangy chutneys.', category: 'Appetizers', price: 6.99, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Chicken 65', description: 'Spicy, deep-fried chicken bites.', category: 'Appetizers', price: 11.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 3, availability: true },
  { name: 'Chilli Paneer', description: 'Indo-Chinese style paneer tossed with peppers and onions.', category: 'Appetizers', price: 10.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Dahi Vada', description: 'Lentil dumplings soaked in yogurt and topped with chutneys.', category: 'Appetizers', price: 7.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Gobi Manchurian', description: 'Cauliflower bites tossed in a sweet and spicy Indo-Chinese sauce.', category: 'Appetizers', price: 9.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Bhel Puri', description: 'Savory snack made with puffed rice, vegetables, and tamarind sauce.', category: 'Appetizers', price: 6.99, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Hara Bhara Kabab', description: 'Vegetarian kebabs made with spinach, peas, and potatoes.', category: 'Appetizers', price: 8.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },

  { name: 'Chicken Tikka Masala', description: 'Roasted chicken chunks in a spicy sauce.', category: 'Mains', price: 15.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Butter Chicken', description: 'Chicken in a mildly spiced tomato sauce.', category: 'Mains', price: 16.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Palak Paneer', description: 'Paneer in a thick paste made from pureed spinach.', category: 'Mains', price: 14.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Rogan Josh', description: 'Aromatic lamb dish of Persian origin.', category: 'Mains', price: 18.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Chana Masala', description: 'Chickpeas simmered in a spicy and tangy gravy.', category: 'Mains', price: 13.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Dal Makhani', description: 'Whole black lentils cooked with butter and cream.', category: 'Mains', price: 14.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Aloo Gobi', description: 'Potatoes and cauliflower cooked with spices.', category: 'Mains', price: 13.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Chicken Biryani', description: 'Mixed rice dish with spices and chicken.', category: 'Mains', price: 17.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Lamb Biryani', description: 'Basmati rice cooked with tender pieces of lamb and aromatic spices.', category: 'Mains', price: 19.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Vegetable Biryani', description: 'Spiced rice cooked with mixed vegetables.', category: 'Mains', price: 14.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Malai Kofta', description: 'Potato and paneer balls in a rich and creamy mild gravy.', category: 'Mains', price: 15.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Paneer Butter Masala', description: 'Rich and creamy curry made with paneer, spices, onions, and tomatoes.', category: 'Mains', price: 15.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Bhindi Masala', description: 'Stir-fried okra cooked with onions, tomatoes, and spices.', category: 'Mains', price: 13.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Fish Curry', description: 'Tender fish pieces simmered in a tangy coastal sauce.', category: 'Mains', price: 18.50, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Kadai Chicken', description: 'Spicy chicken curry cooked with bell peppers, tomatoes, and freshly ground spices.', category: 'Mains', price: 16.50, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 3, availability: true },
  { name: 'Saag Gosht', description: 'Tender meat cooked in a spiced spinach gravy.', category: 'Mains', price: 18.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Baingan Bharta', description: 'Smoked and mashed eggplant cooked with fresh herbs and spices.', category: 'Mains', price: 14.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Muttar Paneer', description: 'Green peas and paneer in a tomato-based sauce.', category: 'Mains', price: 14.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Shrimp Vindaloo', description: 'Highly spiced shrimp curry with potatoes.', category: 'Mains', price: 19.50, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 3, availability: true },
  { name: 'Chicken Korma', description: 'Mild chicken curry in a rich cream and cashew sauce.', category: 'Mains', price: 16.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Mutton Curry', description: 'Slow-cooked mutton with bone, in rich traditional spices.', category: 'Mains', price: 19.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Prawn Masala', description: 'Succulent prawns cooked in a thick spicy tomato gravy.', category: 'Mains', price: 20.50, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin, garlic and dried red chillies.', category: 'Mains', price: 12.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Rajma Masala', description: 'Red kidney beans in a thick gravy with many Indian whole spices.', category: 'Mains', price: 13.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },

  { name: 'Masala Dosa', description: 'Crispy crepe filled with potato curry.', category: 'Specials', price: 12.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Idli Sambar', description: 'Steamed rice cakes served with lentil soup.', category: 'Specials', price: 8.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Chole Bhature', description: 'Spicy chickpea curry served with fried bread.', category: 'Specials', price: 13.99, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Medu Vada', description: 'Crispy lentil doughnuts served with chutneys.', category: 'Specials', price: 8.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Pav Bhaji', description: 'Spicy mixed vegetable mash served with buttered bread rolls.', category: 'Specials', price: 11.99, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Hyderabadi Dum Biryani', description: 'Authentic layered rice and chicken dish slow-cooked with spices.', category: 'Specials', price: 18.99, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 3, availability: true },
  { name: 'Kati Roll', description: 'Skewer-roasted food wrapped in paratha bread.', category: 'Specials', price: 9.99, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Tandoori Chicken', description: 'Roasted chicken marinated in yogurt and spices.', category: 'Specials', price: 16.50, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 2, availability: true },
  { name: 'Paneer Kathi Roll', description: 'Spiced paneer wrapped in flatbread.', category: 'Specials', price: 9.50, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 1, availability: true },
  { name: 'Vada Pav', description: 'Deep fried potato dumpling inside a bread bun.', category: 'Specials', price: 6.99, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 2, availability: true },
  { name: 'Rava Dosa', description: 'Crispy crepe made from semolina, flavored with cumin and chilies.', category: 'Specials', price: 11.99, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 1, availability: true },
  { name: 'Uttapam', description: 'Thick pancake made from rice and lentil batter with toppings.', category: 'Specials', price: 11.50, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 1, availability: true },

  { name: 'Gulab Jamun', description: 'Milk solid sweet balls in sugar syrup.', category: 'Desserts', price: 4.99, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Rasmalai', description: 'Flattened balls of chhana soaked in sweet, flavored milk.', category: 'Desserts', price: 6.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Gajar Ka Halwa', description: 'Sweet carrot pudding made with milk and nuts.', category: 'Desserts', price: 5.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Kheer', description: 'Traditional rice pudding favored with cardamom.', category: 'Desserts', price: 4.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Jalebi', description: 'Deep-fried maida flour batter in pretzel shapes, soaked in sugar syrup.', category: 'Desserts', price: 5.50, dietary: { vegetarian: true, vegan: true, glutenFree: false, dairyFree: true }, spicyLevel: 0, availability: true },
  { name: 'Mango Kulfi', description: 'Traditional Indian ice cream made with mango pulp.', category: 'Desserts', price: 5.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Pistachio Kulfi', description: 'Traditional Indian ice cream flavored with pistachio.', category: 'Desserts', price: 5.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },

  { name: 'Mango Lassi', description: 'Sweet yogurt-based drink with mango pulp.', category: 'Beverages', price: 4.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Sweet Lassi', description: 'Chilled, sweet, refreshing yogurt drink.', category: 'Beverages', price: 3.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Salted Lassi', description: 'Savory yogurt drink flavored with cumin and salt.', category: 'Beverages', price: 3.99, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Masala Chai', description: 'Aromatic Indian tea made with milk and spices.', category: 'Beverages', price: 3.50, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, spicyLevel: 0, availability: true },
  { name: 'Jal Jeera', description: 'Refreshing cumin and mint flavored lemonade.', category: 'Beverages', price: 3.99, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, spicyLevel: 0, availability: true }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');
    
    // Delete existing ones to prevent duplicates before inserting new 60 items
    const names = indianMenu.map(m => m.name);
    await MenuItem.deleteMany({ name: { $in: names } });

    // Also remove the old lazy ones just in case
    await MenuItem.deleteMany({ name: /Indian Dish/ });

    await MenuItem.insertMany(indianMenu);
    console.log(`Successfully inserted ${indianMenu.length} distinct Indian menu items.`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding Indian menu:', error);
    process.exit(1);
  }
}

seed();
