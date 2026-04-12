import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalINR, setTotalINR] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<LocationCoords | null>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    deliveryAddress: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    specialInstructions: '',
  });

  useEffect(() => {
    // Check authentication status
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        // Redirect to login after 2 seconds
        const timer = setTimeout(() => {
          navigate('/login');
        }, 2000);
        setLoading(false);
        return () => clearTimeout(timer);
      }

      const filledFields: string[] = [];
      
      // Initialize form with user data
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '';
      const userEmail = user.email || '';
      const userPhone = user.phone || '';

      if (userName) filledFields.push('Name');
      if (userEmail) filledFields.push('Email');
      if (userPhone) filledFields.push('Phone');

      setFormData((prev) => ({
        ...prev,
        guestName: userName,
        guestEmail: userEmail,
        guestPhone: userPhone,
      }));

      // Load cart data from localStorage
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData.items || []);
          setTotalINR(cartData.totalINR || 0);
        } catch (error) {
          console.error('Failed to load cart:', error);
          navigate('/menu');
        }
      } else {
        navigate('/menu');
      }
      
      setAutoFilledFields(filledFields);
      setLoading(false);

      // Request geolocation
      requestUserLocation();
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Auto-clear success messages after 4 seconds
  useEffect(() => {
    if (locationError && locationError.includes('✅')) {
      const timer = setTimeout(() => {
        setLocationError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

  const requestUserLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoordinates({ latitude, longitude, accuracy });

        // Update form with coordinates
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));

        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { 
              headers: { 'User-Agent': 'Restaurant-Web-App' }
            }
          );
          
          if (!response.ok) throw new Error('Reverse geocoding failed');
          
          const data = await response.json();
          const address = data.address || {};

          // Build complete address
          const streetAddress = `${address.road || address.street || ''} ${address.house_number || ''}`.trim() || 
                                address.neighbourhood || 
                                address.suburb ||
                                '';
          
          const city = address.city || 
                      address.town || 
                      address.village || 
                      address.county || 
                      address.district || 
                      '';
          
          const state = address.state || 
                       address.province || 
                       address.region || 
                       '';
          
          const postalCode = address.postcode || '';

          setFormData((prev) => ({
            ...prev,
            deliveryAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
          }));

          // Show success message with filled fields
            let filledAddressFields: string[] = [];
          if (streetAddress) filledAddressFields.push('Address');
          if (city) filledAddressFields.push('City');
          if (state) filledAddressFields.push('State');
          if (postalCode) filledAddressFields.push('Postal Code');

          // Add to existing auto-filled fields
          setAutoFilledFields((prev) => [...prev, ...filledAddressFields]);

          if (filledAddressFields.length > 0) {
            setLocationError(`✅ Auto-filled: ${filledAddressFields.join(', ')}`);
          } else {
            setLocationError('⚠️ Could not auto-fill address. Please enter manually.');
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setLocationError('⚠️ Could not fetch address from location. Please enter manually.');
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = '❌ Unable to get your location. ';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg += 'Please enable location services in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg += 'Location information unavailable in your area.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg += 'Location request timed out. Please try again.';
        }
        setLocationError(errorMsg);
        setLocationLoading(false);
      }
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = () => {
    if (!formData.deliveryAddress || !formData.city || !formData.postalCode) {
      alert('Please fill in all address fields (Street, City, Postal Code)');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }

    // Create delivery order data
    const orderData = {
      items: cartItems.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,  // Default quantity is 1, can be changed on confirmation page
      })),
      deliveryAddress: formData.deliveryAddress,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      latitude: formData.latitude,
      longitude: formData.longitude,
      deliveryNotes: formData.specialInstructions,
      recipientName: formData.guestName,
      recipientPhone: formData.guestPhone,
      specialOccasion: {
        type: 'regular',
        recipientName: formData.guestName,
      },
    };

    // Store order data in localStorage
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));

    // Navigate to confirmation page
    navigate('/order-confirmation', { state: { orderData } });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container rounded-3xl p-12 border border-outline-variant/30 max-w-md w-full mx-6 text-center"
        >
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-bold text-on-surface mb-4">Sign In Required</h2>
          <p className="text-on-surface-variant text-lg mb-8">
            You need to sign in to place an order. Please log in or create an account to continue.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary py-4 rounded-2xl font-bold text-lg mb-3 hover:shadow-lg transition-all"
          >
            Sign In / Sign Up
          </motion.button>
          <p className="text-sm text-on-surface-variant">Redirecting in 2 seconds...</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-on-surface-variant">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-2">Place Your Order</h1>
          <p className="text-on-surface-variant mb-8">Review items and enter delivery details</p>
        </motion.div>

        {/* Auto-filled Fields Banner */}
        {autoFilledFields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3"
          >
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-700">Auto-filled Successfully</p>
              <p className="text-sm text-green-600">{autoFilledFields.join(', ')}</p>
            </div>
          </motion.div>
        )}

        {/* User Info Card */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/30 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-3xl">👤</div>
          <div>
            <p className="text-sm text-on-surface-variant">Delivery for</p>
            <p className="text-xl font-semibold text-on-surface">{user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest'}</p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-8">

            {/* Order Items */}
            <motion.div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30">
              <h3 className="text-2xl font-bold text-on-surface mb-6">🍽️ Order Items ({cartItems.length})</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    className="flex justify-between items-center p-4 bg-surface rounded-xl border border-outline-variant/20"
                  >
                    <div>
                      <p className="font-semibold text-on-surface">{item.name}</p>
                      <p className="text-sm text-on-surface-variant">{item.category}</p>
                    </div>
                    <span className="text-primary font-bold">₹{(item.price * 83).toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-on-surface">📍 Delivery Address</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestUserLocation}
                  disabled={locationLoading}
                  className="text-sm px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  {locationLoading ? '📍 Detecting...' : '📍 Detect Location'}
                </motion.button>
              </div>

              {locationError && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className={`mb-4 p-3 border rounded-lg text-sm ${
                    locationError.includes('✅') 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {locationError}
                </motion.div>
              )}

              {coordinates && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  📍 Location detected: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)} (±{coordinates.accuracy.toFixed(0)}m)
                </motion.div>
              )}

              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <textarea
                  placeholder="Special Instructions (optional)"
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30">
              <h3 className="text-2xl font-bold text-on-surface mb-8">💳 Payment Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-3">Payment Method</label>
                  <select className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                    <option>💳 Credit/Debit Card</option>
                    <option>📱 Digital Wallet</option>
                    <option>🏦 Net Banking</option>
                    <option>💰 Cash on Delivery</option>
                  </select>
                </div>
                <p className="text-sm text-on-surface-variant bg-primary/5 p-4 rounded-lg border border-primary/10">
                  ✓ Your payment information is securely encrypted
                </p>
              </div>
            </motion.div>
          </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-surface-container to-surface-container/80 rounded-3xl p-8 border border-outline-variant/30 h-fit sticky top-24 shadow-lg"
        >
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">📋 Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-outline-variant/30">
              <div className="flex justify-between items-center py-2">
                <span className="text-on-surface-variant text-sm">Items Subtotal</span>
                <span className="text-on-surface font-semibold text-base">₹{Math.round(totalINR)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-on-surface-variant text-sm">📦 Delivery Fee</span>
                <span className="text-on-surface font-semibold text-base">₹{Math.round(25 * 83)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-on-surface-variant text-sm">🧾 Taxes (5%)</span>
                <span className="text-on-surface font-semibold text-base">₹{Math.round((Math.round(totalINR) + Math.round(25 * 83)) * 0.05)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 pb-8 border-b-2 border-primary/50">
              <span className="text-lg font-bold text-on-surface">Final Total</span>
              <span className="text-4xl font-bold text-primary">₹{Math.round(Math.round(totalINR) + Math.round(25 * 83) + Math.round((Math.round(totalINR) + Math.round(25 * 83)) * 0.05))}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-primary via-primary to-secondary text-on-primary py-4 rounded-2xl hover:shadow-2xl transition-all font-bold text-lg mb-3 flex items-center justify-center gap-2"
            >
              <span>🎉</span> Confirm Order
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/menu')}
              className="w-full bg-outline-variant/10 border border-outline-variant/30 text-on-surface py-3 rounded-2xl hover:bg-outline-variant/20 transition-all font-medium"
            >
              ← Continue Shopping
            </motion.button>

            <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-xs text-on-surface-variant text-center line-clamp-2">
                ⏱️ Est. delivery: 45 min | 📧 Sent to {user?.email}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
