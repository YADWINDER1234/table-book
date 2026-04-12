/**
 * Database Seeding Script
 * 
 * Run once to populate initial test data:
 * ts-node src/scripts/seed.ts
 */

import mongoose from 'mongoose';
import { User, Table, Booking, MenuItem, Review, Order } from '../models';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Table.deleteMany({}),
      Booking.deleteMany({}),
      MenuItem.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');

    // Create sample users (password will be hashed by User pre-save hook)
    const users = await User.create([
      {
        email: 'admin@hotel.com',
        username: 'admin',
        password: 'Admin@123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '555-123-4567',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      },
      {
        email: 'john@example.com',
        username: 'johndoe',
        password: 'User@123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '555-234-5678',
        role: 'user',
        isActive: true,
        emailVerified: true,
      },
      {
        email: 'jane@example.com',
        username: 'janesmith',
        password: 'User@123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '555-345-6789',
        role: 'user',
        isActive: true,
        emailVerified: true,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create sample tables
    const tables = await Table.create([
      // Window Tables
      { tableNumber: 1, capacity: 2, location: 'window', description: 'Cozy corner table' },
      { tableNumber: 2, capacity: 2, location: 'window', description: 'Front window view' },
      { tableNumber: 9, capacity: 2, location: 'window', description: 'Window alcove for two' },
      { tableNumber: 10, capacity: 4, location: 'window', description: 'Large window table' },
      { tableNumber: 11, capacity: 4, location: 'window', description: 'Corner window table' },

      // Indoor Tables
      { tableNumber: 3, capacity: 4, location: 'indoor', description: 'Standard indoor table' },
      { tableNumber: 4, capacity: 4, location: 'indoor', description: 'Near the bar' },
      { tableNumber: 6, capacity: 6, location: 'indoor', description: 'Large table' },
      { tableNumber: 12, capacity: 2, location: 'indoor', description: 'Intimate center table' },
      { tableNumber: 13, capacity: 2, location: 'indoor', description: 'Couples indoor table' },
      { tableNumber: 14, capacity: 4, location: 'indoor', description: 'Square center table' },
      { tableNumber: 15, capacity: 6, location: 'indoor', description: 'Round table near kitchen' },
      { tableNumber: 16, capacity: 8, location: 'indoor', description: 'Long table center' },
      { tableNumber: 17, capacity: 4, location: 'indoor', description: 'Booth seating' },
      { tableNumber: 18, capacity: 4, location: 'indoor', description: 'Booth seating' },

      // Patio Tables
      { tableNumber: 5, capacity: 4, location: 'patio', description: 'Outdoor seating' },
      { tableNumber: 7, capacity: 6, location: 'patio', description: 'Patio with lighting' },
      { tableNumber: 19, capacity: 2, location: 'patio', description: 'Sunny patio table' },
      { tableNumber: 20, capacity: 2, location: 'patio', description: 'Shaded patio table' },
      { tableNumber: 21, capacity: 4, location: 'patio', description: 'Outdoor family table' },
      { tableNumber: 22, capacity: 8, location: 'patio', description: 'Large bench patio' },

      // Private Tables
      { tableNumber: 8, capacity: 8, location: 'private', description: 'Private dining room' },
      { tableNumber: 23, capacity: 6, location: 'private', description: 'Executive suite' },
      { tableNumber: 24, capacity: 4, location: 'private', description: 'Chef table' },
      { tableNumber: 25, capacity: 2, location: 'private', description: 'Proposal booth' },
    ]);
    console.log(`✅ Created ${tables.length} tables`);

    // Create sample bookings
    const now = new Date();
    const bookings = await Booking.create([
      {
        bookingId: 'BK-2024-001',
        userId: users[1]._id,
        tableId: tables[0]._id,
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1 (555) 234-5678',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        startTime: '19:00',
        endTime: '20:30',
        durationMinutes: 90,
        specialRequests: 'Window seat preferred',
        status: 'confirmed',
        confirmedAt: now,
      },
      {
        bookingId: 'BK-2024-002',
        userId: users[2]._id,
        tableId: tables[3]._id,
        guestName: 'Jane Smith',
        guestEmail: 'jane@example.com',
        guestPhone: '+1 (555) 345-6789',
        numberOfGuests: 4,
        bookingDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        startTime: '20:00',
        endTime: '21:30',
        durationMinutes: 90,
        specialRequests: 'Celebration dinner - quiet corner',
        status: 'pending',
      },
      {
        bookingId: 'BK-2024-003',
        userId: users[1]._id,
        tableId: tables[6]._id,
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '+1 (555) 234-5678',
        numberOfGuests: 6,
        bookingDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        startTime: '18:30',
        endTime: '20:00',
        durationMinutes: 90,
        specialRequests: 'Group dinner',
        status: 'pending',
      },
      {
        bookingId: 'BK-2024-004',
        userId: users[2]._id,
        tableId: tables[9]._id,
        guestName: 'Michael Chen',
        guestEmail: 'michael.chen@gmail.com',
        guestPhone: '+1 (555) 891-2345',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        startTime: '19:30',
        endTime: '21:00',
        durationMinutes: 90,
        specialRequests: 'Anniversary dinner, please arrange flowers',
        status: 'confirmed',
        confirmedAt: now,
      },
      {
        bookingId: 'BK-2024-005',
        userId: users[1]._id,
        tableId: tables[21]._id,
        guestName: 'Sarah Williams',
        guestEmail: 'sarah.w@outlook.com',
        guestPhone: '+1 (555) 456-7890',
        numberOfGuests: 6,
        bookingDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        startTime: '20:00',
        endTime: '22:00',
        durationMinutes: 120,
        specialRequests: 'Private room, corporate event',
        status: 'pending',
      },
      {
        bookingId: 'BK-2024-006',
        userId: users[2]._id,
        tableId: tables[4]._id,
        guestName: 'Robert Martinez',
        guestEmail: 'rob.martinez@yahoo.com',
        guestPhone: '+1 (555) 567-8901',
        numberOfGuests: 4,
        bookingDate: new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000),
        startTime: '18:00',
        endTime: '19:30',
        durationMinutes: 90,
        specialRequests: 'Gluten-free options needed',
        status: 'confirmed',
        confirmedAt: now,
      },
      {
        bookingId: 'BK-2024-007',
        userId: users[1]._id,
        tableId: tables[15]._id,
        guestName: 'Emily Foster',
        guestEmail: 'emily.foster@gmail.com',
        guestPhone: '+1 (555) 678-9012',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        startTime: '20:30',
        endTime: '22:00',
        durationMinutes: 90,
        specialRequests: 'Proposal setup, need private area',
        status: 'completed',
      },
      {
        bookingId: 'BK-2024-008',
        userId: users[2]._id,
        tableId: tables[7]._id,
        guestName: 'David Park',
        guestEmail: 'david.park@icloud.com',
        guestPhone: '+1 (555) 789-0123',
        numberOfGuests: 8,
        bookingDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        startTime: '19:00',
        endTime: '21:30',
        durationMinutes: 150,
        specialRequests: 'Birthday celebration, need cake service',
        status: 'pending',
      },
      {
        bookingId: 'BK-2024-009',
        userId: users[1]._id,
        tableId: tables[1]._id,
        guestName: 'Olivia Thompson',
        guestEmail: 'olivia.t@hotmail.com',
        guestPhone: '+1 (555) 890-1234',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        startTime: '19:00',
        endTime: '20:30',
        durationMinutes: 90,
        specialRequests: '',
        status: 'cancelled',
      },
      {
        bookingId: 'BK-2024-010',
        userId: users[2]._id,
        tableId: tables[22]._id,
        guestName: 'James Wilson',
        guestEmail: 'j.wilson@company.com',
        guestPhone: '+1 (555) 901-2345',
        numberOfGuests: 4,
        bookingDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        startTime: '20:00',
        endTime: '21:30',
        durationMinutes: 90,
        specialRequests: "Chef's table experience, wine pairing",
        status: 'confirmed',
        confirmedAt: now,
      },
      {
        bookingId: 'BK-2024-011',
        userId: users[1]._id,
        tableId: tables[11]._id,
        guestName: 'Sophia Anderson',
        guestEmail: 'sophia.a@gmail.com',
        guestPhone: '+1 (555) 012-3456',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000),
        startTime: '21:00',
        endTime: '22:30',
        durationMinutes: 90,
        specialRequests: 'Late dinner, vegetarian menu',
        status: 'pending',
      },
      {
        bookingId: 'BK-2024-012',
        userId: users[2]._id,
        tableId: tables[16]._id,
        guestName: 'Alexander Petrov',
        guestEmail: 'alex.petrov@mail.ru',
        guestPhone: '+1 (555) 123-4567',
        numberOfGuests: 6,
        bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        startTime: '19:30',
        endTime: '21:30',
        durationMinutes: 120,
        specialRequests: 'Business dinner, need projector setup',
        status: 'completed',
      },
      {
        bookingId: 'BK-2024-013',
        userId: users[1]._id,
        tableId: tables[19]._id,
        guestName: 'Isabella Torres',
        guestEmail: 'bella.torres@gmail.com',
        guestPhone: '+1 (555) 234-5670',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        startTime: '18:00',
        endTime: '19:30',
        durationMinutes: 90,
        specialRequests: 'Patio seating, dog-friendly spot',
        status: 'pending',
      },
    ]);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Create menu items (food & beverages)
    const menuItems = await MenuItem.create([
      // Premium Steaks
      { name: 'Prime Rib Eye (16oz)', category: 'Mains', description: 'Bone-in ribeye steak, perfectly aged and seared to order. Served with truffle butter and seasonal vegetables.', price: 58.00, spicyLevel: 0, preparationTime: 25, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'beef'] },
      { name: 'Wagyu Tenderloin (12oz)', category: 'Mains', description: 'Japanese Wagyu beef tenderloin, marble-scored and seared rare. Accompanied by foie gras and red wine reduction.', price: 72.00, spicyLevel: 0, preparationTime: 20, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'New York Strip (14oz)', category: 'Mains', description: 'Classic New York strip steak with a perfect crust. Topped with truffle oil and served with roasted asparagus.', price: 52.00, spicyLevel: 0, preparationTime: 22, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Filet Mignon (10oz)', category: 'Mains', description: 'The most tender cut, butter-soft and succulent. Served with béarnaise sauce and seasonal sides.', price: 68.00, spicyLevel: 0, preparationTime: 23, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'eggs'] },

      // Appetizers
      { name: 'Lobster Bisque', category: 'Appetizers', description: 'Creamy and elegant lobster soup with a hint of cognac and truffle oil. Topped with lobster medallion.', price: 18.00, spicyLevel: 0, preparationTime: 8, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['shellfish', 'cream', 'dairy'] },
      { name: 'Seared Scallops', category: 'Appetizers', description: 'Pan-seared diver scallops with lemon beurre blanc and microgreens. A classic steakhouse favorite.', price: 22.00, spicyLevel: 0, preparationTime: 10, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['shellfish', 'dairy'] },
      { name: 'Shrimp Tempura', category: 'Appetizers', description: 'Crispy tempura-fried jumbo shrimp served with spicy mayo and sesame seeds.', price: 16.00, spicyLevel: 2, preparationTime: 8, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['shellfish', 'flour', 'gluten'] },
      { name: 'Foie Gras Terrine', category: 'Appetizers', description: 'Smooth foie gras terrine with brioche toast points and fig reduction.', price: 28.00, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'gluten'] },

      // Desserts
      { name: 'Molten Chocolate Cake', category: 'Desserts', description: 'Warm chocolate cake with a molten center and vanilla ice cream. Pure chocolate indulgence.', price: 12.00, spicyLevel: 0, preparationTime: 12, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'eggs', 'gluten', 'chocolate'] },
      { name: 'Crème Brûlée', category: 'Desserts', description: 'Classic French custard dessert with caramelized sugar top. Accompanied by fresh berries.', price: 10.00, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'eggs'] },
      { name: 'Pistachio Cheesecake', category: 'Desserts', description: 'Creamy cheesecake with pistachio layer and candied pistachio garnish.', price: 11.00, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'gluten', 'nuts'] },
      { name: 'Panna Cotta', category: 'Desserts', description: 'Silky Italian panna cotta with raspberry coulis and mint.', price: 9.00, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'cream'] },

      // Beverages - Non-Alcoholic
      { name: 'Sparkling Citrus Cooler', category: 'Beverages', description: 'Refreshing blend of lemon, lime, and orange with sparkling water and fresh mint.', price: 6.00, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },
      { name: 'Iced Jasmine Tea', category: 'Beverages', description: 'Premium jasmine green tea served over ice with a touch of honey and lemon.', price: 5.00, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },
      { name: 'Virgin Mojito', category: 'Beverages', description: 'Fresh mint leaves, lime juice, and soda water. A classic non-alcoholic refreshment.', price: 7.00, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },
      { name: 'Espresso Martini (N/A)', category: 'Beverages', description: 'Coffee with vanilla and cream, crafted to perfection without alcohol.', price: 6.50, spicyLevel: 0, preparationTime: 4, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'caffeine'] },

      // Beverages - Coffee & Tea
      { name: 'Single Origin Espresso (Ethiopia)', category: 'Beverages', description: 'Smooth and fruity single origin espresso with chocolate notes.', price: 4.50, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: ['caffeine'] },
      { name: 'Cappuccino (Organic)', category: 'Beverages', description: 'Rich espresso combined with silky steamed milk and foam. Lightly dusted with cocoa.', price: 5.50, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'caffeine'] },

      // Specials
      { name: 'Chef\'s Surf & Turf', category: 'Specials', description: 'Prime steak paired with lobster tail. The ultimate surf and turf experience.', price: 85.00, spicyLevel: 0, preparationTime: 30, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['shellfish', 'dairy'] },
      { name: 'Venison Medallions', category: 'Specials', description: 'Pan-seared venison medallions with juniper berry gastrique and mushroom ragout.', price: 54.00, spicyLevel: 1, preparationTime: 26, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },

      // Additional Appetizers
      { name: 'Pan-Seared Duck Breast', category: 'Appetizers', description: 'Crispy-skinned duck breast with cherry gastrique and seasonal vegetables. A delicacy!', price: 24.00, spicyLevel: 0, preparationTime: 12, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: [] },
      { name: 'Beef Carpaccio', category: 'Appetizers', description: 'Paper-thin slices of premium beef with olive oil, capers, and aged parmesan. Fresh and elegant.', price: 20.00, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Oysters Rockefeller', category: 'Appetizers', description: 'Fresh oysters topped with seasoned spinach, hollandaise, and panko crust. Baked to perfection.', price: 22.00, spicyLevel: 0, preparationTime: 10, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['shellfish', 'dairy'] },
      { name: 'Truffle Mushroom Risotto', category: 'Appetizers', description: 'Creamy arborio rice with wild mushrooms, truffle oil, and aged parmesan.', price: 16.00, spicyLevel: 0, preparationTime: 15, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },

      // Additional Mains
      { name: 'Grilled Lamb Chops (3pc)', category: 'Mains', description: 'Premium lamb chops with rosemary and garlic, charred to order. Served with mint chimichurri.', price: 56.00, spicyLevel: 1, preparationTime: 20, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: [] },
      { name: 'Butter-Poached Lobster Tail', category: 'Mains', description: 'Luxurious lobster tail poached in clarified butter, finished with drawn butter and lemon.', price: 62.00, spicyLevel: 0, preparationTime: 18, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['shellfish', 'dairy'] },
      { name: 'Pan-Seared Halibut', category: 'Mains', description: 'Fresh Atlantic halibut with brown butter sauce and crispy capers. Served with seasonal vegetables.', price: 48.00, spicyLevel: 0, preparationTime: 16, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['fish', 'dairy'] },
      { name: 'Dry-Aged Tomahawk Steak (32oz)', category: 'Mains', description: 'Colossal dry-aged tomahawk with spectacular marbling. A showstopper for two or more diners.', price: 125.00, spicyLevel: 0, preparationTime: 35, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },

      // Additional Desserts
      { name: 'Tiramisu', category: 'Desserts', description: 'Traditional Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream. Dusted with cocoa.', price: 10.50, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'eggs', 'gluten', 'caffeine'] },
      { name: 'Chocolate Soufflé', category: 'Desserts', description: 'Light as air chocolate soufflé with 70% dark chocolate ganache center. Served with vanilla cream.', price: 13.00, spicyLevel: 0, preparationTime: 14, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'eggs', 'chocolate'] },
      { name: 'Lemon Tart', category: 'Desserts', description: 'Buttery pastry tart with silky lemon custard filling and candied lemon peel.', price: 11.50, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'eggs', 'gluten', 'citrus'] },

      // Premium Wines
      { name: 'Cabernet Sauvignon (Napa Valley)', category: 'Beverages', description: 'Full-bodied red wine with notes of black cherry and oak. Perfect with steaks.', price: 18.00, spicyLevel: 0, preparationTime: 1, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: ['sulfites'] },
      { name: 'Pinot Noir (Oregon)', category: 'Beverages', description: 'Elegant light red with cherry and strawberry notes. Versatile with multiple courses.', price: 16.00, spicyLevel: 0, preparationTime: 1, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: ['sulfites'] },
      { name: 'Chardonnay (Burgundy)', category: 'Beverages', description: 'Rich and complex white with notes of apple and hazelnut. Pairs beautifully with seafood.', price: 17.00, spicyLevel: 0, preparationTime: 1, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: ['sulfites'] },
      { name: 'Champagne (Veuve Clicquot)', category: 'Beverages', description: 'Prestigious champagne with elegant bubbles and toasty notes. Celebratory choice!', price: 22.00, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: ['sulfites'] },

      // Craft Cocktails
      { name: 'Old Fashioned (Premium Spirit)', category: 'Beverages', description: 'Classic cocktail with bourbon, sugar cube, bitters, and orange peel. Timeless elegance.', price: 14.00, spicyLevel: 0, preparationTime: 4, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },
      { name: 'Martini (Vodka or Gin)', category: 'Beverages', description: 'The iconic martini with premium spirits, dry vermouth, and olives. Shaken or stirred.', price: 14.00, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },
      { name: 'Manhattan', category: 'Beverages', description: 'Sophisticated blend of rye whiskey, sweet vermouth, and bitters topped with cherry.', price: 13.50, spicyLevel: 0, preparationTime: 4, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },

      // Additional Beverages
      { name: 'Iced Coffee (Cold Brew)', category: 'Beverages', description: 'Smooth cold brew coffee served over ice with cream and brown sugar. Pick-me-up!', price: 5.50, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'caffeine'] },
      { name: 'Hot Chocolate (Premium Swiss)', category: 'Beverages', description: 'Rich and decadent hot chocolate made with premium Swiss chocolate and steamed milk.', price: 6.50, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'chocolate'] },
      { name: 'Fresh Lemonade', category: 'Beverages', description: 'Freshly made lemonade with fresh lemons, spring water, and a hint of honey.', price: 5.00, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: true, glutenFree: true, dairyFree: true }, allergens: [] },

      // Indian Cuisine - Appetizers
      { name: 'Samosa (3pc)', category: 'Appetizers', description: 'Crispy pastry triangles filled with spiced potatoes and peas. Served with tamarind and mint chutney.', price: 7.00, spicyLevel: 2, preparationTime: 8, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten', 'dairy'] },
      { name: 'Vegetable Pakora', category: 'Appetizers', description: 'Mixed vegetables dipped in chickpea batter and deep-fried. Served with tamarind sauce and mint chutney.', price: 6.50, spicyLevel: 1, preparationTime: 7, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten', 'dairy'] },
      { name: 'Tandoori Chicken (Half)', category: 'Appetizers', description: 'Marinated in yogurt and spices, cooked in traditional tandoor. Juicy and smoky with a perfect char.', price: 12.00, spicyLevel: 2, preparationTime: 20, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Paneer Tikka', category: 'Appetizers', description: 'Cubes of cottage cheese marinated in yogurt and spices, grilled to perfection. Served with mint sauce.', price: 10.00, spicyLevel: 1, preparationTime: 12, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Chicken 65', category: 'Appetizers', description: 'Tender chicken pieces marinated in spiced yogurt, deep-fried and tossed with fresh herbs and chilies.', price: 9.50, spicyLevel: 3, preparationTime: 10, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten', 'dairy'] },
      { name: 'Spring Rolls (Veg)', category: 'Appetizers', description: 'Crispy golden rolls filled with cabbage, carrots, and spices. Served with sweet and spicy sauce.', price: 6.00, spicyLevel: 1, preparationTime: 8, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten'] },
      { name: 'Aloo Tikki', category: 'Appetizers', description: 'Shallow-fried potato patties seasoned with cumin and spices. Topped with yogurt, tamarind, and mint chutney.', price: 5.50, spicyLevel: 1, preparationTime: 10, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Shrimp Pakora (Kolambi Pakora)', category: 'Appetizers', description: 'Fresh shrimp coated in spiced chickpea flour and fried until golden. Served with chutneys.', price: 10.50, spicyLevel: 2, preparationTime: 9, dietary: { vegetarian: false, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten', 'shellfish'] },

      // Indian Cuisine - Mains
      { name: 'Butter Chicken (Murgh Makhani)', category: 'Mains', description: 'Tender chicken pieces in a creamy tomato and butter sauce with fenugreek leaves. A classic favorite!', price: 16.00, spicyLevel: 2, preparationTime: 20, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Chicken Tikka Masala', category: 'Mains', description: 'Tandoori chicken in a rich and aromatic tomato-cream sauce with coconut and spices.', price: 15.50, spicyLevel: 2, preparationTime: 22, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'coconut'] },
      { name: 'Biryani (Chicken)', category: 'Mains', description: 'Basmati rice cooked with marinated chicken, mint, and spices using dum pukht method. Fragrant and flavorful.', price: 14.00, spicyLevel: 2, preparationTime: 25, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: [] },
      { name: 'Paneer Butter Masala', category: 'Mains', description: 'Cottage cheese in a smooth, buttery tomato sauce with cream and fenugreek. Vegetarian delight!', price: 13.00, spicyLevel: 1, preparationTime: 18, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Dal Makhani', category: 'Mains', description: 'Creamy black lentils and kidney beans slow-cooked with butter and spices. Rich and comforting.', price: 10.50, spicyLevel: 1, preparationTime: 30, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Lamb Rogan Josh', category: 'Mains', description: 'Tender lamb pieces in a fragrant tomato-based curry with aromatic Kashmiri spices.', price: 17.00, spicyLevel: 2, preparationTime: 28, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: [] },
      { name: 'Tandoori Fish (Pomfret)', category: 'Mains', description: 'Whole fish marinated in yogurt and tandoori spices, grilled in clay oven. Delicate and flavorful.', price: 18.50, spicyLevel: 2, preparationTime: 20, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['fish', 'dairy'] },
      { name: 'Chole Bhature', category: 'Mains', description: 'Fluffy fried bread served with spiced chickpea curry. A North Indian comfort classic.', price: 11.00, spicyLevel: 2, preparationTime: 25, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['gluten'] },
      { name: 'Palak Paneer', category: 'Mains', description: 'Creamy spinach sauce with cubes of cottage cheese and spices. Nutritious and delicious.', price: 12.50, spicyLevel: 1, preparationTime: 18, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Shrimp Curry (Kolambi Masala)', category: 'Mains', description: 'Fresh shrimp in a coconut-based curry with chili, cumin, and cloves. Light yet flavorful.', price: 16.50, spicyLevel: 3, preparationTime: 16, dietary: { vegetarian: false, vegan: false, glutenFree: true, dairyFree: true }, allergens: ['shellfish', 'coconut'] },

      // Indian Cuisine - Desserts
      { name: 'Gulab Jamun', category: 'Desserts', description: 'Soft milk solids fried and soaked in rose-flavored sugar syrup. A traditional Indian sweet treat.', price: 6.50, spicyLevel: 0, preparationTime: 8, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: false }, allergens: ['dairy', 'gluten'] },
      { name: 'Kheer (Rice Pudding)', category: 'Desserts', description: 'Creamy rice pudding made with milk, condensed milk, and cardamom. Topped with almonds and raisins.', price: 7.00, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'nuts'] },
      { name: 'Rasmalai', category: 'Desserts', description: 'Soft paneer patties in creamy, cardamom-flavored condensed milk. A Bengali specialty.', price: 7.50, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Jalebi', category: 'Desserts', description: 'Pretzel-shaped pastry soaked in sugar syrup with a crispy exterior and sweet, sticky interior.', price: 5.50, spicyLevel: 0, preparationTime: 10, dietary: { vegetarian: true, vegan: false, glutenFree: false, dairyFree: true }, allergens: ['gluten'] },

      // Indian Cuisine - Beverages
      { name: 'Mango Lassi', category: 'Beverages', description: 'Sweet and creamy yogurt-based drink with fresh mango pulp. Refreshing and tropical.', price: 5.50, spicyLevel: 0, preparationTime: 3, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Chai (Indian Tea)', category: 'Beverages', description: 'Aromatic black tea brewed with milk, spices like cardamom, cinnamon, and ginger.', price: 4.00, spicyLevel: 0, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'caffeine'] },
      { name: 'Sweet Lassi', category: 'Beverages', description: 'Creamy yogurt drink sweetened with sugar and cardamom. A perfect cooling beverage.', price: 4.50, spicyLevel: 0, preparationTime: 2, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy'] },
      { name: 'Masala Chai', category: 'Beverages', description: 'Spiced chai with warming spices like ginger, cloves, and black pepper. Comfort in a cup!', price: 4.50, spicyLevel: 1, preparationTime: 5, dietary: { vegetarian: true, vegan: false, glutenFree: true, dairyFree: false }, allergens: ['dairy', 'caffeine'] },
    ]);
    console.log(`✅ Created ${menuItems.length} menu items`);

    // Add more customers for reviews
    const additionalUsers = await User.create([
      {
        email: 'aditi.tyagi@example.com',
        username: 'aditi_tyagi',
        password: 'User@123',
        firstName: 'Aditi',
        lastName: 'Tyagi',
        phone: '555-111-2222',
        role: 'user',
        isActive: true,
        emailVerified: true,
      },
      {
        email: 'yadwinder.singh@example.com',
        username: 'yadwinder_singh',
        password: 'User@123',
        firstName: 'Yadwinder',
        lastName: 'Singh',
        phone: '555-222-3333',
        role: 'user',
        isActive: true,
        emailVerified: true,
      },
      {
        email: 'bipasha.chatterjee@example.com',
        username: 'bipasha_chatterjee',
        password: 'User@123',
        firstName: 'Bipasha',
        lastName: 'Chatterjee',
        phone: '555-333-4444',
        role: 'user',
        isActive: true,
        emailVerified: true,
      },
    ]);
    console.log(`✅ Created ${additionalUsers.length} additional users`);

    // Create completed bookings for reviews
    const completedBookings = await Booking.create([
      {
        bookingId: 'BK-2024-REV-01',
        userId: additionalUsers[0]._id,
        tableId: tables[0]._id,
        guestName: 'Aditi Tyagi',
        guestEmail: 'aditi.tyagi@example.com',
        guestPhone: '+1 (555) 111-2222',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        startTime: '19:00',
        endTime: '20:30',
        durationMinutes: 90,
        specialRequests: 'Romantic dinner',
        status: 'completed',
        confirmedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2024-REV-02',
        userId: additionalUsers[1]._id,
        tableId: tables[3]._id,
        guestName: 'Yadwinder Singh',
        guestEmail: 'yadwinder.singh@example.com',
        guestPhone: '+1 (555) 222-3333',
        numberOfGuests: 4,
        bookingDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        startTime: '20:00',
        endTime: '21:30',
        durationMinutes: 90,
        specialRequests: 'Family gathering',
        status: 'completed',
        confirmedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-2024-REV-03',
        userId: additionalUsers[2]._id,
        tableId: tables[6]._id,
        guestName: 'Bipasha Chatterjee',
        guestEmail: 'bipasha.chatterjee@example.com',
        guestPhone: '+1 (555) 333-4444',
        numberOfGuests: 2,
        bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        startTime: '19:30',
        endTime: '21:00',
        durationMinutes: 90,
        specialRequests: 'Business dinner',
        status: 'completed',
        confirmedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ Created ${completedBookings.length} completed bookings for reviews`);

    // Create customer reviews with specific names
    const reviews = await Review.create([
      {
        bookingId: completedBookings[0]._id,
        userId: additionalUsers[0]._id,
        tableId: tables[0]._id,
        ratings: { food: 5, service: 5, ambiance: 5, overall: 5 },
        comment: 'Simply exceptional! The Prime Rib Eye was cooked to perfection with a beautiful crust and tender inside. The service was impeccable and the ambiance was absolutely romantic. We felt like we were in a five-star establishment. Will definitely return!',
        verified: true,
        helpful: 12,
        unhelpful: 0,
      },
      {
        bookingId: completedBookings[1]._id,
        userId: additionalUsers[1]._id,
        tableId: tables[3]._id,
        ratings: { food: 4, service: 5, ambiance: 4, overall: 4 },
        comment: 'Great steakhouse experience! The Wagyu was incredible, probably the best beef I\'ve ever had. The service team was very attentive and knowledgeable about wine pairings. The only small issue was the wait time, but the quality made it worthwhile.',
        verified: true,
        helpful: 8,
        unhelpful: 1,
      },
      {
        bookingId: completedBookings[2]._id,
        userId: additionalUsers[2]._id,
        tableId: tables[6]._id,
        ratings: { food: 5, service: 4, ambiance: 5, overall: 5 },
        comment: 'Outstanding dining experience! The Lobster Bisque was velvety and rich, and the Filet Mignon was absolutely stunning. The dessert crème brûlée had the perfect caramelized top. This is the perfect spot for special occasions and business meetings.',
        verified: true,
        helpful: 15,
        unhelpful: 0,
      },
      {
        bookingId: completedBookings[0]._id,
        userId: additionalUsers[0]._id,
        tableId: tables[0]._id,
        ratings: { food: 5, service: 5, ambiance: 5, overall: 5 },
        comment: 'My husband and I celebrated our 10th anniversary here, and it was absolutely memorable! The Molten Chocolate Cake with the served ice cream was divine. Every detail was perfect, from the table setting to the wine recommendations.',
        verified: true,
        helpful: 20,
        unhelpful: 0,
      },
    ]);
    console.log(`✅ Created ${reviews.length} customer reviews`);

    // Create demo orders with payment
    const demoOrder = await Order.create({
      orderId: `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
      bookingId: bookings[0]._id,
      userId: users[1]._id,
      items: [
        {
          menuItemId: menuItems[0]._id, // Prime Rib Eye
          quantity: 2,
          price: 58.00,
          specialInstructions: 'Medium-rare, one medium',
        },
        {
          menuItemId: menuItems[14]._id, // Sparkling Citrus Cooler
          quantity: 2,
          price: 6.00,
        },
        {
          menuItemId: menuItems[9]._id, // Crème Brûlée
          quantity: 2,
          price: 10.00,
        },
        {
          menuItemId: menuItems[35]._id, // Cabernet Sauvignon
          quantity: 1,
          price: 18.00,
        },
      ],
      totalAmount: 166.00,
      status: 'completed',
      paymentStatus: 'paid',
      orderType: 'dine-in',
      notes: 'Premium dining experience - celebratory dinner',
      completedAt: new Date(),
    });
    console.log(`✅ Created demo order 1 with payment: ${demoOrder.orderId}`);
    console.log(`   Total Amount: $${demoOrder.totalAmount.toFixed(2)}`);
    console.log(`   Payment Status: ${demoOrder.paymentStatus.toUpperCase()}`);

    // Create additional demo orders
    const demoOrder2 = await Order.create({
      orderId: `ORD-${Date.now() + 1}-${uuidv4().slice(0, 8)}`,
      bookingId: bookings[1]._id,
      userId: users[2]._id,
      items: [
        {
          menuItemId: menuItems[1]._id, // Wagyu Tenderloin
          quantity: 1,
          price: 72.00,
          specialInstructions: 'Rare',
        },
        {
          menuItemId: menuItems[18]._id, // Lobster Bisque
          quantity: 1,
          price: 18.00,
        },
        {
          menuItemId: menuItems[24]._id, // Tiramisu
          quantity: 1,
          price: 10.50,
        },
        {
          menuItemId: menuItems[36]._id, // Pinot Noir
          quantity: 1,
          price: 16.00,
        },
      ],
      totalAmount: 116.50,
      status: 'completed',
      paymentStatus: 'paid',
      orderType: 'dine-in',
      notes: 'Fine dining experience',
      completedAt: new Date(),
    });
    console.log(`✅ Created demo order 2 with payment: ${demoOrder2.orderId}`);
    console.log(`   Total Amount: $${demoOrder2.totalAmount.toFixed(2)}`);
    console.log(`   Payment Status: ${demoOrder2.paymentStatus.toUpperCase()}`);

    // Create a pending order for demo
    const demoOrder3 = await Order.create({
      orderId: `ORD-${Date.now() + 2}-${uuidv4().slice(0, 8)}`,
      bookingId: bookings[3]._id,
      userId: users[1]._id,
      items: [
        {
          menuItemId: menuItems[2]._id, // New York Strip
          quantity: 2,
          price: 52.00,
          specialInstructions: 'Medium',
        },
        {
          menuItemId: menuItems[20]._id, // Pan-Seared Duck Breast
          quantity: 1,
          price: 24.00,
        },
        {
          menuItemId: menuItems[15]._id, // Virgin Mojito
          quantity: 2,
          price: 7.00,
        },
        {
          menuItemId: menuItems[25]._id, // Chocolate Soufflé
          quantity: 2,
          price: 13.00,
        },
      ],
      totalAmount: 204.00,
      status: 'pending',
      paymentStatus: 'pending',
      orderType: 'dine-in',
      notes: 'Anniversary celebration',
    });
    console.log(`✅ Created demo order 3 (pending): ${demoOrder3.orderId}`);
    console.log(`   Total Amount: $${demoOrder3.totalAmount.toFixed(2)}`);
    console.log(`   Payment Status: ${demoOrder3.paymentStatus.toUpperCase()}`);

    console.log('\n🌱 Seeding complete!\n');
    console.log('📝 Test Credentials:');
    console.log('   Admin: admin@hotel.com / Admin@123');
    console.log('   User: john@example.com / User@123');
    console.log('   User: jane@example.com / User@123');
    console.log('   Reviewer (Aditi): aditi.tyagi@example.com / User@123');
    console.log('   Reviewer (Yadwinder): yadwinder.singh@example.com / User@123');
    console.log('   Reviewer (Bipasha): bipasha.chatterjee@example.com / User@123\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
