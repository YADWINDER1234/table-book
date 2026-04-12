import mongoose from 'mongoose';
import 'dotenv/config';
import {
  User,
  Table,
  MenuItem,
  Review,
  UserLoyalty,
  Staff,
  EventPackage,
  Promotion,
  Order,
  Booking,
} from '../models';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-app');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Table.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    await UserLoyalty.deleteMany({});
    await Staff.deleteMany({});
    await EventPackage.deleteMany({});
    await Promotion.deleteMany({});
    await Order.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcryptjs.hash('password123', 10);

    const users = await User.insertMany([
      {
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@restaurant.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'user',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '5555555555',
        role: 'user',
      },
      {
        firstName: 'Aditi',
        lastName: 'Tyagi',
        username: 'aditi_tyagi',
        email: 'aditi.tyagi@restaurant.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'user',
      },
      {
        firstName: 'Bipasha',
        lastName: 'Chatterjee',
        username: 'bipasha_chatterjee',
        email: 'bipasha.chatterjee@restaurant.com',
        password: hashedPassword,
        phone: '9876543211',
        role: 'user',
      },
      {
        firstName: 'Yadwinder',
        lastName: 'Singh',
        username: 'yadwinder_singh',
        email: 'yadwinder.singh@restaurant.com',
        password: hashedPassword,
        phone: '9876543212',
        role: 'user',
      },
    ]);
    console.log('✓ Created 6 users');

    // Create sample tables
    const tables = await Table.insertMany([
      { tableNumber: 1, capacity: 2, location: 'window', restaurantId: users[0]._id },
      { tableNumber: 2, capacity: 4, location: 'indoor', restaurantId: users[0]._id },
      { tableNumber: 3, capacity: 4, location: 'indoor', restaurantId: users[0]._id },
      { tableNumber: 4, capacity: 6, location: 'private', restaurantId: users[0]._id },
      { tableNumber: 5, capacity: 8, location: 'patio', restaurantId: users[0]._id },
    ]);
    console.log('✓ Created 5 tables');

    // Create sample menu items
    const menuItems = await MenuItem.insertMany([
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce',
        category: 'Mains',
        price: 28.99,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 25,
        ratings: 4.8,
      },
      {
        name: 'Vegetable Risotto',
        description: 'Creamy arborio rice with seasonal vegetables',
        category: 'Mains',
        price: 18.99,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 20,
        ratings: 4.6,
      },
      {
        name: 'Bruschetta',
        description: 'tomato, basil, and garlic on toasted bread',
        category: 'Appetizers',
        price: 8.99,
        dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 5,
        ratings: 4.5,
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        category: 'Desserts',
        price: 12.99,
        dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 8,
        ratings: 4.9,
      },
      {
        name: 'Espresso',
        description: 'Strong Italian espresso coffee',
        category: 'Beverages',
        price: 3.99,
        dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
        availability: true,
        ratings: 4.4,
      },
      {
        name: 'Vegan Buddha Bowl',
        description: 'Quinoa, roasted vegetables, tahini dressing',
        category: 'Mains',
        price: 16.99,
        dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 15,
        ratings: 4.7,
      },
      // Premium Steaks
      {
        name: 'Prime Rib Eye (16oz)',
        description: 'Bone-in ribeye steak, perfectly aged and seared to order. Served with truffle butter and seasonal vegetables.',
        category: 'Mains',
        price: 58.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 25,
        spicyLevel: 0,
        ratings: 4.9,
        allergens: ['dairy'],
      },
      {
        name: 'Wagyu Tenderloin (12oz)',
        description: 'Japanese Wagyu beef tenderloin, marble-scored and seared rare. Accompanied by foie gras and red wine reduction.',
        category: 'Mains',
        price: 72.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 20,
        spicyLevel: 0,
        ratings: 5.0,
        allergens: ['dairy'],
      },
      {
        name: 'New York Strip (14oz)',
        description: 'Classic New York strip steak with a perfect crust. Topped with truffle oil and served with roasted asparagus.',
        category: 'Mains',
        price: 52.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 22,
        spicyLevel: 0,
        ratings: 4.8,
        allergens: ['dairy'],
      },
      {
        name: 'Filet Mignon (10oz)',
        description: 'The most tender cut, butter-soft and succulent. Served with béarnaise sauce and seasonal sides.',
        category: 'Mains',
        price: 68.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 23,
        spicyLevel: 0,
        ratings: 4.9,
        allergens: ['dairy'],
      },
      // More Beverages
      {
        name: 'Sparkling Citrus Cooler',
        description: 'Refreshing blend of lemon, lime, and orange with sparkling water and fresh mint.',
        category: 'Beverages',
        price: 6.00,
        dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 2,
        ratings: 4.5,
      },
      {
        name: 'Iced Jasmine Tea',
        description: 'Premium jasmine green tea served over ice with a touch of honey and lemon.',
        category: 'Beverages',
        price: 5.00,
        dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 3,
        ratings: 4.6,
      },
      {
        name: 'Virgin Mojito',
        description: 'Fresh mint leaves, lime juice, and soda water. A classic non-alcoholic refreshment.',
        category: 'Beverages',
        price: 7.00,
        dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 3,
        ratings: 4.7,
      },
      {
        name: 'Cappuccino (Organic)',
        description: 'Rich espresso combined with silky steamed milk and foam. Lightly dusted with cocoa.',
        category: 'Beverages',
        price: 5.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 3,
        ratings: 4.8,
        allergens: ['dairy'],
      },
      // More Deserts
      {
        name: 'Crème Brûlée',
        description: 'Classic French custard dessert with caramelized sugar top. Accompanied by fresh berries.',
        category: 'Desserts',
        price: 10.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 5,
        ratings: 4.8,
        allergens: ['dairy'],
      },
      {
        name: 'Pistachio Cheesecake',
        description: 'Creamy cheesecake with pistachio layer and candied pistachio garnish.',
        category: 'Desserts',
        price: 11.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 3,
        ratings: 4.7,
        allergens: ['dairy', 'nuts'],
      },
      // Indian Cuisine - Appetizers
      {
        name: 'Samosa (3pc)',
        description: 'Crispy pastry triangles filled with spiced potatoes and peas. Served with tamarind and mint chutney.',
        category: 'Appetizers',
        price: 7.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 8,
        spicyLevel: 2,
        ratings: 4.6,
      },
      {
        name: 'Paneer Tikka',
        description: 'Cubes of cottage cheese marinated in yogurt and spices, grilled to perfection. Served with mint sauce.',
        category: 'Appetizers',
        price: 10.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 12,
        spicyLevel: 1,
        ratings: 4.8,
      },
      {
        name: 'Tandoori Chicken (Half)',
        description: 'Marinated in yogurt and spices, cooked in traditional tandoor. Juicy and smoky with a perfect char.',
        category: 'Appetizers',
        price: 12.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 20,
        spicyLevel: 2,
        ratings: 4.9,
      },
      {
        name: 'Chicken 65',
        description: 'Tender chicken pieces marinated in spiced yogurt, deep-fried and tossed with fresh herbs and chilies.',
        category: 'Appetizers',
        price: 9.50,
        dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 10,
        spicyLevel: 3,
        ratings: 4.7,
      },
      // Indian Cuisine - Mains
      {
        name: 'Butter Chicken (Murgh Makhani)',
        description: 'Tender chicken pieces in a creamy tomato and butter sauce with fenugreek leaves. A classic favorite!',
        category: 'Mains',
        price: 16.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 20,
        spicyLevel: 2,
        ratings: 4.9,
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Tandoori chicken in a rich and aromatic tomato-cream sauce with coconut and spices.',
        category: 'Mains',
        price: 15.50,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 22,
        spicyLevel: 2,
        ratings: 4.8,
      },
      {
        name: 'Biryani (Chicken)',
        description: 'Basmati rice cooked with marinated chicken, mint, and spices using dum pukht method. Fragrant and flavorful.',
        category: 'Mains',
        price: 14.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 25,
        spicyLevel: 2,
        ratings: 4.7,
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in a smooth, buttery tomato sauce with cream and fenugreek. Vegetarian delight!',
        category: 'Mains',
        price: 13.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 18,
        spicyLevel: 1,
        ratings: 4.8,
      },
      {
        name: 'Dal Makhani',
        description: 'Creamy black lentils and kidney beans slow-cooked with butter and spices. Rich and comforting.',
        category: 'Mains',
        price: 10.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 30,
        spicyLevel: 1,
        ratings: 4.6,
      },
      {
        name: 'Lamb Rogan Josh',
        description: 'Tender lamb pieces in a fragrant tomato-based curry with aromatic Kashmiri spices.',
        category: 'Mains',
        price: 17.00,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 28,
        spicyLevel: 2,
        ratings: 4.8,
      },
      {
        name: 'Palak Paneer',
        description: 'Creamy spinach sauce with cubes of cottage cheese and spices. Nutritious and delicious.',
        category: 'Mains',
        price: 12.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 18,
        spicyLevel: 1,
        ratings: 4.7,
      },
      {
        name: 'Shrimp Curry (Kolambi Masala)',
        description: 'Fresh shrimp in a coconut-based curry with chili, cumin, and cloves. Light yet flavorful.',
        category: 'Mains',
        price: 16.50,
        dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true },
        availability: true,
        preparationTime: 16,
        spicyLevel: 3,
        ratings: 4.6,
      },
      // Indian Cuisine - Desserts
      {
        name: 'Gulab Jamun',
        description: 'Soft milk solids fried and soaked in rose-flavored sugar syrup. A traditional Indian sweet treat.',
        category: 'Desserts',
        price: 6.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false },
        availability: true,
        preparationTime: 8,
        spicyLevel: 0,
        ratings: 4.7,
      },
      {
        name: 'Kheer (Rice Pudding)',
        description: 'Creamy rice pudding made with milk, condensed milk, and cardamom. Topped with almonds and raisins.',
        category: 'Desserts',
        price: 7.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 5,
        spicyLevel: 0,
        ratings: 4.8,
      },
      {
        name: 'Rasmalai',
        description: 'Soft paneer patties in creamy, cardamom-flavored condensed milk. A Bengali specialty.',
        category: 'Desserts',
        price: 7.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 5,
        spicyLevel: 0,
        ratings: 4.6,
      },
      // Indian Cuisine - Beverages
      {
        name: 'Mango Lassi',
        description: 'Sweet and creamy yogurt-based drink with fresh mango pulp. Refreshing and tropical.',
        category: 'Beverages',
        price: 5.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 3,
        spicyLevel: 0,
        ratings: 4.9,
      },
      {
        name: 'Chai (Indian Tea)',
        description: 'Aromatic black tea brewed with milk, spices like cardamom, cinnamon, and ginger.',
        category: 'Beverages',
        price: 4.00,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 5,
        spicyLevel: 0,
        ratings: 4.5,
      },
      {
        name: 'Masala Chai',
        description: 'Spiced chai with warming spices like ginger, cloves, and black pepper. Comfort in a cup!',
        category: 'Beverages',
        price: 4.50,
        dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false },
        availability: true,
        preparationTime: 5,
        spicyLevel: 1,
        ratings: 4.6,
      },
    ]);
    console.log('✓ Created 38 menu items');

    // Create sample bookings for reviewers
    const now = new Date();
    const bookings = await Booking.insertMany([
      {
        bookingId: 'BK-REVIEW-001',
        userId: users[3]._id, // Aditi Tyagi
        tableId: tables[0]._id,
        guestName: 'Aditi Tyagi',
        guestEmail: 'aditi.tyagi@example.com',
        guestPhone: '5551112222',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        startTime: '19:00',
        endTime: '20:30',
        durationMinutes: 90,
        specialRequests: 'Romantic dinner',
        status: 'completed',
      },
      {
        bookingId: 'BK-REVIEW-002',
        userId: users[4]._id, // Bipasha Chatterjee
        tableId: tables[2]._id,
        guestName: 'Bipasha Chatterjee',
        guestEmail: 'bipasha.chatterjee@example.com',
        guestPhone: '5553334444',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        startTime: '19:30',
        endTime: '21:00',
        durationMinutes: 90,
        specialRequests: 'Business dinner',
        status: 'completed',
      },
    ]);
    console.log('✓ Created 2 bookings for reviews');

    // Create customer reviews
    await Review.insertMany([
      {
        bookingId: bookings[0]._id,
        userId: users[3]._id, // Aditi Tyagi
        tableId: tables[0]._id,
        ratings: { food: 5, service: 5, ambiance: 5, overall: 5 },
        comment: 'Simply exceptional! The Prime Rib Eye was cooked to perfection with a beautiful crust and tender inside. The service was impeccable and the ambiance was absolutely romantic. We felt like we were in a five-star establishment!',
        verified: true,
        helpful: 12,
        unhelpful: 0,
      },
      {
        bookingId: bookings[1]._id,
        userId: users[4]._id, // Bipasha Chatterjee
        tableId: tables[2]._id,
        ratings: { food: 5, service: 4, ambiance: 5, overall: 5 },
        comment: 'Outstanding dining experience! The Cappuccino was velvety and rich, and the Filet Mignon was absolutely stunning. The dessert Crème Brûlée had the perfect caramelized top. This is the perfect spot for special occasions and business meetings.',
        verified: true,
        helpful: 15,
        unhelpful: 0,
      },
    ]);
    console.log('✓ Created 2 customer reviews from Aditi Tyagi and Bipasha');

    // Create demo order with payment
    const demoOrder = await Order.insertMany([
      {
        orderId: `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
        bookingId: bookings[0]._id,
        userId: users[3]._id, // Aditi Tyagi
        items: [
          {
            menuItemId: menuItems[6]._id, // Prime Rib Eye (16oz)
            quantity: 2,
            price: 58.00,
            specialInstructions: 'Medium-rare, one medium',
          },
          {
            menuItemId: menuItems[11]._id, // Virgin Mojito
            quantity: 2,
            price: 7.00,
          },
          {
            menuItemId: menuItems[14]._id, // Crème Brûlée
            quantity: 2,
            price: 10.00,
          },
        ],
        totalAmount: 150.00,
        status: 'completed',
        paymentStatus: 'paid',
        orderType: 'dine-in',
        notes: 'Premium dining experience - celebratory dinner',
        completedAt: new Date(),
      },
    ]);
    console.log(`✓ Created demo payment order: ${demoOrder[0].orderId}`);
    console.log(`   Total Amount: $${demoOrder[0].totalAmount.toFixed(2)} - PAID ✓`);

    // Create sample loyalty accounts
    await UserLoyalty.insertMany([
      {
        userId: users[1]._id,
        points: 1500,
        tier: 'Silver',
        totalSpent: 450,
        totalBookings: 12,
      },
      {
        userId: users[2]._id,
        points: 3200,
        tier: 'Gold',
        totalSpent: 950,
        totalBookings: 28,
      },
    ]);
    console.log('✓ Created 2 loyalty accounts');

    // Create sample staff
    await Staff.insertMany([
      {
        name: 'Mike Johnson',
        email: 'mike@restaurant.com',
        phone: '1111111111',
        role: 'Waiter',
        department: 'Front of House',
        employmentDate: new Date('2023-01-15'),
        shirtsSize: 'L',
        isActive: true,
      },
      {
        name: 'Sarah Chef',
        email: 'sarah@restaurant.com',
        phone: '2222222222',
        role: 'Chef',
        department: 'Kitchen',
        employmentDate: new Date('2022-06-01'),
        shirtsSize: 'M',
        isActive: true,
      },
      {
        name: 'Tom Manager',
        email: 'tom@restaurant.com',
        phone: '3333333333',
        role: 'Manager',
        department: 'Management',
        employmentDate: new Date('2021-01-01'),
        shirtsSize: 'XL',
        isActive: true,
      },
    ]);
    console.log('✓ Created 3 staff members');

    // Create sample event packages
    await EventPackage.insertMany([
      {
        name: 'Corporate Meeting Package',
        description: 'Perfect for business meetings and conferences',
        minGuests: 10,
        maxGuests: 50,
        pricePerHead: 50,
        inclusions: ['Table reservations', 'Standard menu', 'Basic AV setup'],
        duration: 3,
        decorOptions: false,
        musicOptions: false,
        customMenuAvailable: true,
        isActive: true,
      },
      {
        name: 'Wedding Reception Package',
        description: 'Elegant settings for your special day',
        minGuests: 50,
        maxGuests: 150,
        pricePerHead: 85,
        inclusions: [
          'Premium table setup',
          'Multi-course menu',
          'Decorations',
          'Dedicated coordinator',
        ],
        duration: 5,
        decorOptions: true,
        musicOptions: true,
        customMenuAvailable: true,
        isActive: true,
      },
      {
        name: 'Birthday Bash Package',
        description: 'Fun and festive birthday celebrations',
        minGuests: 15,
        maxGuests: 80,
        pricePerHead: 35,
        inclusions: [
          'Party table setup',
          'Casual menu',
          'Balloon decorations',
          'Birthday cake included',
        ],
        duration: 4,
        decorOptions: true,
        musicOptions: false,
        customMenuAvailable: false,
        isActive: true,
      },
    ]);
    console.log('✓ Created 3 event packages');

    // Create sample promotion codes
    const nowPromo = new Date();
    const endDate = new Date(nowPromo.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    await Promotion.insertMany([
      {
        code: 'WELCOME15',
        description: 'Welcome discount for first-time bookings',
        discountType: 'percentage',
        discountValue: 15,
        maxUsage: 100,
        usageCount: 0,
        startDate: nowPromo,
        endDate,
        applicableTiers: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        applicableOn: 'booking',
        isActive: true,
      },
      {
        code: 'LOYALTY20',
        description: 'Loyalty members discount',
        discountType: 'percentage',
        discountValue: 20,
        maxUsage: 500,
        usageCount: 0,
        startDate: nowPromo,
        endDate,
        applicableTiers: ['Gold', 'Platinum'],
        applicableOn: 'both',
        isActive: true,
      },
      {
        code: 'SAVE50',
        description: 'Save $50 on orders over $200',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 200,
        maxUsage: 50,
        usageCount: 0,
        startDate: nowPromo,
        endDate,
        applicableTiers: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        applicableOn: 'menu',
        isActive: true,
      },
    ]);
    console.log('✓ Created 3 promotion codes');

    console.log('\n✨ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin - Email: admin@restaurant.com, Password: password123');
    console.log('User 1 - Email: john@example.com, Password: password123');
    console.log('User 2 - Email: jane@example.com, Password: password123');
    console.log('\n⭐ Premium Reviewers (for Delivery Checkout):');
    console.log('Aditi Tyagi');
    console.log('Bipasha Chatterjee');
    console.log('Yadwinder Singh');
    console.log('\n💳 Demo Payment:');
    console.log(`Sample Order Created with Paid Status ($150.00)`);
    console.log('\n🍽️ Menu Items:');
    console.log('20 items including Premium Steaks, Beverages, and Desserts');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
