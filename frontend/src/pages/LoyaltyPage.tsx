import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { bookingService } from '../services/bookingService';

interface UserLoyalty {
  points: number;
  tier: string;
  totalSpent: number;
  totalBookings: number;
  lastRedeemDate: string | null;
}

interface LoyaltyTransaction {
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description: string;
  createdAt: string;
}

const LoyaltyPage: React.FC = () => {
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemAmount, setRedeemAmount] = useState(100);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getLoyaltyData?.();
      if (response) {
        setLoyalty(response.data);
      }
      // Fetch transactions
      const txResponse = await bookingService.getLoyaltyTransactions?.();
      if (txResponse) {
        setTransactions(txResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    try {
      if (!loyalty || loyalty.points < redeemAmount) {
        alert('Insufficient points');
        return;
      }
      await bookingService.redeemPoints?.(redeemAmount);
      alert('Points redeemed successfully!');
      fetchLoyaltyData();
    } catch (error) {
      console.error('Failed to redeem points:', error);
    }
  };

  const getTierColor = (tier: string) => {
    const colors: { [key: string]: { bg: string; gradient: string; accent: string } } = {
      Platinum: { bg: 'bg-primary/20', gradient: 'from-primary to-primary/60', accent: 'text-primary' },
      Gold: { bg: 'bg-secondary/20', gradient: 'from-secondary to-secondary/60', accent: 'text-secondary' },
      Silver: { bg: 'bg-tertiary/20', gradient: 'from-tertiary to-tertiary/60', accent: 'text-tertiary' },
      Bronze: { bg: 'bg-on-surface-variant/10', gradient: 'from-on-surface-variant to-on-surface-variant/50', accent: 'text-on-surface-variant' },
    };
    return colors[tier] || colors.Bronze;
  };

  if (loading) {
    return <div className="min-h-screen bg-background pt-24 flex items-center justify-center"><div className="text-on-surface-variant">Loading your rewards...</div></div>;
  }

  if (!loyalty) {
    return <div className="min-h-screen bg-background pt-24 flex items-center justify-center"><div className="text-on-surface-variant">No loyalty data found</div></div>;
  }

  const pointsPercentage = (loyalty.points / 5000) * 100;
  const tierColor = getTierColor(loyalty.tier);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-2">Loyalty Rewards</h1>
          <p className="text-on-surface-variant text-lg">Unlock exclusive benefits with every visit</p>
        </motion.div>

        {/* Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-br ${tierColor.gradient} rounded-3xl p-8 md:p-12 text-on-surface border border-primary/20 mb-12 my-12 shadow-lg backdrop-blur-xl`}
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-2">YOUR TIER</p>
              <h2 className={`text-5xl font-serif font-bold ${tierColor.accent}`}>{loyalty.tier}</h2>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-sm font-medium mb-2">TOTAL POINTS</p>
              <p className={`text-5xl font-bold ${tierColor.accent}`}>{loyalty.points}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-surface/40 rounded-full h-3 overflow-hidden border border-outline-variant/30">
              <motion.div
                className={`h-full bg-gradient-to-r ${tierColor.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${pointsPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-on-surface-variant text-sm">
              <span className="font-semibold text-primary">{Math.max(0, 5000 - loyalty.points)}</span> points to Platinum
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Spent', value: `₹${(loyalty.totalSpent * 83).toLocaleString('en-IN')}`, icon: '💰' },
            { label: 'Total Bookings', value: loyalty.totalBookings, icon: '🍽️' },
            { label: 'Member Discount', value: `${loyalty.tier === 'Platinum' ? '20%' : loyalty.tier === 'Gold' ? '15%' : '10%'}`, icon: '⭐' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{stat.icon}</div>
              <p className="text-on-surface-variant text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Redeem Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container rounded-3xl p-8 border border-primary/20 backdrop-blur-xl mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-on-surface mb-6">Redeem Your Points</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="number"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                max={loyalty.points}
                className="flex-1 px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRedeem}
                disabled={redeemAmount > loyalty.points || redeemAmount === 0}
                className="px-8 py-3 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
              >
                Redeem
              </motion.button>
            </div>
            <p className="text-on-surface-variant text-sm">
              <span className="font-semibold text-primary">₹{((redeemAmount / 100) * 83).toFixed(0)}</span> discount on your next booking
            </p>
          </div>
        </motion.div>

        {/* Tier Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-serif font-bold text-on-surface mb-6">Tier Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { tier: 'Bronze', icon: '🥉', minPoints: 0, discount: '5%' },
              { tier: 'Silver', icon: '🥈', minPoints: 1000, discount: '10%' },
              { tier: 'Gold', icon: '🥇', minPoints: 3000, discount: '15%' },
              { tier: 'Platinum', icon: '💎', minPoints: 5000, discount: '20%' },
            ].map((tierInfo) => (
              <motion.div
                key={tierInfo.tier}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl p-4 border-2 transition-all text-center group ${
                  tierInfo.tier === loyalty.tier
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-outline-variant/30 hover:border-primary/50 bg-surface-container'
                }`}
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{tierInfo.icon}</div>
                <p className="font-semibold text-on-surface">{tierInfo.tier}</p>
                <p className="text-on-surface-variant text-xs my-2">
                  {tierInfo.minPoints === 0 ? 'Start here' : tierInfo.minPoints + ' pts'}
                </p>
                <p className="text-primary font-bold text-lg">{tierInfo.discount}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-serif font-bold text-on-surface mb-6">Recent Activity</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex justify-between items-center border-b border-outline-variant/30 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-on-surface">{tx.description}</p>
                    <p className="text-on-surface-variant text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      tx.type === 'earn' ? 'text-tertiary' : 'text-error'
                    }`}
                  >
                    {tx.type === 'earn' ? '+' : '-'}{tx.points}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-on-surface-variant text-center py-8">No transactions yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
