import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { bookingService } from '../services/bookingService';
import { toINR } from '../utils/pricing';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  allergens: string[];
  availability: boolean;
  ratings: number;
  image?: string;
}

interface MenuCategory {
  [key: string]: MenuItem[];
}

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuByCategory, setMenuByCategory] = useState<MenuCategory>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [inspectDish, setInspectDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      
      // Try to get all menu items and group by category
      const response = await bookingService.getAllMenuItems();
      
      // Handle the response safely
      let items = response?.data || response || [];
      
      // Ensure items is an array
      if (!Array.isArray(items)) {
        console.warn('Response is not an array:', response);
        items = [];
      }
      
      if (items.length === 0) {
        console.warn('No menu items received');
        setMenuByCategory({});
        setLoading(false);
        return;
      }
      
      // Group items by category
      const grouped: MenuCategory = {};
      items.forEach((item: MenuItem) => {
        const category = item.category || 'Other';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(item);
      });
      
      setMenuByCategory(grouped);
      const categories = Object.keys(grouped);
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      setMenuByCategory({});
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSelected = selectedItems.find((i) => i._id === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
      toast.success(`${item.name} removed`, { 
        style: { borderRadius: '16px', background: '#222', color: '#fff' },
        iconTheme: { primary: '#C9A96E', secondary: '#fff' }
      });
    } else {
      setSelectedItems([...selectedItems, item]);
      toast.success(`${item.name} added`, { 
        style: { borderRadius: '16px', background: '#222', color: '#fff' },
        iconTheme: { primary: '#C9A96E', secondary: '#fff' }
      });
    }
  };

  const getDietaryBadges = (dietary: MenuItem['dietary']) => {
    const badges: { text: string; icon: string; className: string }[] = [];
    if (dietary.vegetarian) badges.push({ text: 'Vegetarian', icon: '🌿', className: 'text-green-700 bg-green-100/50 border border-green-200' });
    if (dietary.vegan) badges.push({ text: 'Vegan', icon: '🌱', className: 'text-emerald-700 bg-emerald-100/50 border border-emerald-200' });
    if (dietary.glutenFree) badges.push({ text: 'GF', icon: '🌾', className: 'text-amber-700 bg-amber-100/50 border border-amber-200' });
    if (dietary.dairyFree) badges.push({ text: 'DF', icon: '🥛', className: 'text-blue-700 bg-blue-100/50 border border-blue-200' });
    return badges;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="h-12 w-64 bg-outline-variant/20 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-96 bg-outline-variant/20 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3 mb-12 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-32 bg-outline-variant/20 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-outline-variant/20"></div>
                <div className="p-5">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-outline-variant/20 rounded w-1/2"></div>
                    <div className="h-6 bg-outline-variant/20 rounded-full w-16"></div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-outline-variant/20 rounded w-full"></div>
                    <div className="h-4 bg-outline-variant/20 rounded w-4/5"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                    <div className="h-8 bg-outline-variant/20 rounded w-20"></div>
                    <div className="h-10 bg-outline-variant/20 rounded pl-4 pr-4 w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(menuByCategory);
  const displayItems = selectedCategory ? menuByCategory[selectedCategory] : [];

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-8">Our Menu</h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/30"
          >
            <p className="text-on-surface-variant text-lg mb-4">🍽️ Our menu is being prepared</p>
            <p className="text-on-surface-variant">Check back soon for our culinary offerings</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <Toaster 
        position="bottom-left" 
        toastOptions={{ 
          duration: 3000,
          className: 'shadow-xl font-medium tracking-wide border border-primary/20 backdrop-blur-md'
        }} 
      />
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-2">Our Menu</h1>
          <p className="text-on-surface-variant text-lg">Curated selections for your palate</p>
        </motion.div>

        {/* Category Navigation */}
        <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl py-4 -mx-6 px-6 -mt-4 mb-8 shadow-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide max-w-6xl mx-auto"
          >
            <AnimatePresence>
              {categories.map((category, idx) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${
                    selectedCategory === category
                      ? 'bg-primary text-on-primary shadow-primary/20 shadow-lg'
                      : 'bg-surface hover:bg-surface-bright text-on-surface border border-outline-variant/40 hover:border-primary/50'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Menu Items Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden hover:border-primary/50 transition-all group ${
                  !item.availability ? 'opacity-50' : ''
                }`}
              >
                {item.image && (
                  <div className="w-full h-40 bg-surface overflow-hidden group-hover:scale-105 transition-transform">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-on-surface font-semibold text-lg flex-1">{item.name}</h3>
                    {item.availability && (
                      <span className="text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded-full">AVAILABLE</span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{item.description}</p>

                  {/* Dietary Badges */}
                  {getDietaryBadges(item.dietary).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getDietaryBadges(item.dietary).map((badge) => (
                        <span 
                          key={badge.text} 
                          title={badge.text}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${badge.className}`}
                        >
                          <span className="text-sm leading-none">{badge.icon}</span>
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  {item.ratings > 0 && (
                    <div className="mb-4 text-primary text-sm">
                      <span className="font-semibold">{item.ratings.toFixed(1)}★</span> <span className="text-on-surface-variant">({Math.round(item.ratings * 10)})</span>
                    </div>
                  )}

                  {/* Price and Add Button */}
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                    <span className="text-2xl font-bold text-primary">₹{toINR(item.price).toFixed(0)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItemSelection(item)}
                      disabled={!item.availability}
                      className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                        selectedItems.find((i) => i._id === item._id)
                          ? 'bg-primary text-on-primary shadow-lg'
                          : item.availability
                            ? 'bg-primary/10 text-primary hover:bg-primary hover:text-on-primary'
                            : 'bg-outline-variant/20 text-on-surface-variant cursor-not-allowed'
                      }`}
                    >
                      {selectedItems.find((i) => i._id === item._id) ? '✓ Added' : 'Add'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Selected Items Summary */}
        <AnimatePresence>
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-8 right-8 bg-gradient-to-br from-surface-container to-surface rounded-3xl shadow-2xl p-6 max-w-sm border border-primary/20 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-on-surface mb-4">
                🍽️ {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </h3>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {selectedItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    className="flex justify-between text-sm text-on-surface/80 pb-2 border-b border-outline-variant/20"
                  >
                    <span className="flex-1">{item.name}</span>
                    <span className="font-semibold text-primary ml-2">₹{toINR(item.price).toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 pt-4">
                <div className="flex justify-between mb-4 font-semibold text-on-surface">
                  <span>Total:</span>
                  <span className="text-primary text-lg">
                    ₹{toINR(selectedItems.reduce((sum, item) => sum + item.price, 0)).toFixed(0)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      alert('Please select items first!');
                      return;
                    }
                    // Store in localStorage for checkout
                    const cartData = {
                      items: selectedItems,
                      total: selectedItems.reduce((sum, item) => sum + item.price, 0),
                      totalINR: toINR(selectedItems.reduce((sum, item) => sum + item.price, 0)),
                      addedAt: new Date().toISOString()
                    };
                    localStorage.setItem('cartItems', JSON.stringify(cartData));
                    // Navigate to checkout
                    navigate('/checkout');
                  }}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl hover:bg-primary/90 font-semibold transition-all shadow-lg"
                >
                  💳 Add to Order
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuPage;
