import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculateOrderBreakdownINR, toINR } from '../utils/pricing';

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryData {
  items: OrderItem[];
  deliveryAddress: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  recipientName: string;
  recipientPhone: string;
  deliveryNotes: string;
  specialOccasion: {
    type: string;
    recipientName: string;
  };
}

const quantityOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5];

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [orderData, setOrderData] = useState<DeliveryData | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    // Get order data from navigation state or localStorage
    const data = location.state?.orderData || JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    
    if (!data) {
      navigate('/checkout');
      return;
    }

    setOrderData(data);
    setItems(data.items);
    setLoading(false);
  }, [location.state, navigate]);

  const baseSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { subtotal, deliveryFee, tax, total } = calculateOrderBreakdownINR(baseSubtotal);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      alert('Please add at least one item to your order');
      return;
    }

    setConfirming(true);

    try {
      const finalOrderData = {
        items: items,
        deliveryAddress: orderData?.deliveryAddress,
        city: orderData?.city,
        state: orderData?.state,
        postalCode: orderData?.postalCode,
        latitude: orderData?.latitude,
        longitude: orderData?.longitude,
        deliveryNotes: orderData?.deliveryNotes,
        recipientName: orderData?.recipientName,
        recipientPhone: orderData?.recipientPhone,
        specialOccasion: orderData?.specialOccasion,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://table-book-pilu.onrender.com/api/v1'}/delivery/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(finalOrderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      const result = await response.json();

      // Clear cart and pending order
      localStorage.removeItem('cartItems');
      localStorage.removeItem('pendingOrder');

      // Show success page
      setSuccessData({
        deliveryId: result.data.deliveryId,
        address: orderData?.deliveryAddress,
        city: orderData?.city,
        state: orderData?.state,
        postalCode: orderData?.postalCode,
        total: total.toFixed(2),
        recipient: orderData?.recipientName,
        email: orderData?.recipientPhone,
      });
    } catch (error) {
      console.error('Order confirmation error:', error);
      alert(`Failed to confirm order: ${error instanceof Error ? error.message : 'Please try again'}`);
    } finally {
      setConfirming(false);
    }
  };

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-on-surface">Loading order details...</div>
      </div>
    );
  }

  // Show success page if order was confirmed
  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-surface pt-24 pb-12 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container rounded-3xl p-12 border border-outline-variant/30 shadow-2xl text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-7xl mb-6"
            >
              ✓
            </motion.div>

            {/* Success Title */}
            <h1 className="text-4xl font-bold text-on-surface mb-2">Order Placed Successfully!</h1>
            <p className="text-on-surface-variant text-lg mb-8">Your delivery is being prepared</p>

            {/* Order Details Card */}
            <div className="bg-surface rounded-2xl p-8 mb-8 text-left border border-outline-variant/20">
              {/* Delivery ID */}
              <div className="mb-6 pb-6 border-b border-outline-variant">
                <p className="text-sm text-on-surface-variant mb-2">Delivery ID</p>
                <p className="text-2xl font-bold text-primary font-mono">{successData.deliveryId}</p>
              </div>

              {/* Delivery Address */}
              <div className="mb-6 pb-6 border-b border-outline-variant">
                <p className="text-sm text-on-surface-variant mb-2">Delivery To</p>
                <p className="text-lg font-semibold text-on-surface mb-1">{successData.address}</p>
                <p className="text-sm text-on-surface-variant">{successData.city}, {successData.state} {successData.postalCode}</p>
              </div>

              {/* Recipient */}
              <div className="mb-6 pb-6 border-b border-outline-variant">
                <p className="text-sm text-on-surface-variant mb-2">Recipient</p>
                <p className="text-lg font-semibold text-on-surface">{successData.recipient}</p>
              </div>

              {/* Total Amount */}
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{successData.total}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-surface rounded-2xl p-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold">✓</div>
                  <div className="text-left">
                    <p className="font-semibold text-on-surface">Order Confirmed</p>
                    <p className="text-sm text-on-surface-variant">Just now</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-outline-variant/50 rounded-full flex items-center justify-center text-on-surface-variant">→</div>
                  <div className="text-left">
                    <p className="font-semibold text-on-surface">Preparing Food</p>
                    <p className="text-sm text-on-surface-variant">In progress...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-outline-variant/50 rounded-full flex items-center justify-center text-on-surface-variant">→</div>
                  <div className="text-left">
                    <p className="font-semibold text-on-surface">On the Way</p>
                    <p className="text-sm text-on-surface-variant">Est. 45 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <p className="text-sm text-on-surface-variant mb-8">
              ✉️ Confirmation email sent to <span className="font-semibold text-on-surface">{orderData.recipientPhone}</span>
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/menu')}
                className="flex-1 bg-outline-variant/30 hover:bg-outline-variant/50 text-on-surface py-4 rounded-2xl font-bold text-lg transition-all"
              >
                Continue Shopping
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-on-primary py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
              >
                Go Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-on-surface mb-2">Order Review</h1>
            <p className="text-on-surface-variant">Adjust quantities or confirm your order</p>
          </div>

          {/* Order Items */}
          <div className="mb-8 bg-surface rounded-2xl p-6">
            <h2 className="text-xl font-bold text-on-surface mb-6">Items in Your Order</h2>
            
            {items.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8">No items in order</p>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-on-surface/5 rounded-xl p-4 border border-outline-variant/20"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-on-surface">{item.name}</h3>
                      <p className="text-sm text-on-surface-variant">₹{toINR(item.price).toFixed(0)} each</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-on-surface-variant font-medium">Qty:</label>
                        <select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseFloat(e.target.value))}
                          className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {quantityOptions.map((qty) => (
                            <option key={qty} value={qty}>
                              {qty % 1 === 0 ? qty : qty.toFixed(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-20">
                        <p className="text-lg font-bold text-primary">₹{toINR(item.price * item.quantity).toFixed(0)}</p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRemoveItem(index)}
                        className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <div className="mb-8 bg-surface rounded-2xl p-6">
            <h2 className="text-xl font-bold text-on-surface mb-4">Delivery Details</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Recipient:</span>
                <span className="font-semibold text-on-surface">{orderData.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Address:</span>
                <span className="font-semibold text-on-surface text-right max-w-xs">{orderData.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">City:</span>
                <span className="font-semibold text-on-surface">{orderData.city}, {orderData.state} {orderData.postalCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Est. Delivery:</span>
                <span className="font-semibold text-on-surface">45 minutes</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-8 bg-surface rounded-2xl p-6 border-2 border-primary/30">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant border-t border-outline-variant pt-3">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-t-2 border-primary/40 pt-4">
              <span className="text-lg font-bold text-on-surface">Final Total</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              disabled={confirming}
              className="flex-1 bg-outline-variant/30 hover:bg-outline-variant/50 text-on-surface py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50"
            >
              ← Back to Checkout
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmOrder}
              disabled={confirming || items.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-on-primary py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {confirming ? 'Confirming...' : '✓ Confirm & Place Order'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
