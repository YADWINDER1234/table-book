import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

interface Review {
  _id: string;
  ratings: { food: number; service: number; ambiance: number; overall: number };
  comment: string;
  userId: { name: string };
  createdAt: string;
  helpful: number;
}

interface ReviewStats {
  totalReviews: number;
  averageRatings: { food: number; service: number; ambiance: number; overall: number };
}

const ReviewPage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [newReview, setNewReview] = useState({
    ratings: { food: 5, service: 5, ambiance: 5, overall: 5 },
    comment: '',
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // This would need the tableId or booking info
      // For now, we'll just load stats
      // const reviewsResponse = await bookingService.getReviews();
      // setReviews(reviewsResponse.data);

      const statsResponse = await bookingService.getReviewStats?.();
      if (statsResponse) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      alert('Please share your thoughts');
      return;
    }
    try {
      setSubmitting(true);
      await bookingService.submitReview?.('auto', newReview);
      setNewReview({ ratings: { food: 5, service: 5, ambiance: 5, overall: 5 }, comment: '' });
      setShowForm(false);
      fetchReviews();
      alert('✨ Thank you for your review!');
    } catch (error) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const RatingStars = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div className="space-y-3">
      <label className="block text-on-surface-variant text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredRating(`${label}-${star}`)}
            onMouseLeave={() => setHoveredRating(null)}
            className="transition-all duration-200"
          >
            <span
              className={`text-4xl transition-all ${
                star <= value ? 'text-primary drop-shadow-lg' : 'text-outline-variant'
              }`}
            >
              ★
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-2">Guest Reviews</h1>
          <p className="text-on-surface-variant text-lg">Share your dining experience</p>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 my-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 text-center group hover:border-primary/50 transition-all"
            >
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform">
                {stats.averageRatings.overall?.toFixed(1) || '—'}
              </div>
              <div className="text-on-surface-variant text-sm mt-2 font-medium">Overall</div>
              <div className="text-primary text-lg mt-2">
                {'★'.repeat(Math.round(stats.averageRatings.overall || 0))}
              </div>
            </motion.div>

            {['food', 'service', 'ambiance'].map((category, idx) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 text-center group hover:border-secondary/50 transition-all"
              >
                <div className="text-3xl font-bold text-secondary group-hover:text-primary transition-colors">
                  {stats.averageRatings[category as keyof typeof stats.averageRatings]?.toFixed(1)}
                </div>
                <div className="text-on-surface-variant text-sm mt-2 font-medium capitalize">{category}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-fit px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-on-primary rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:scale-125 transition-transform">✨</span>
            Leave Your Review
          </motion.button>
        </motion.div>

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: showForm ? 1 : 0, height: showForm ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-surface-container rounded-3xl p-8 md:p-12 border border-primary/20 backdrop-blur-xl mb-12">
            <h2 className="text-3xl font-serif font-bold text-on-surface mb-2">Share Your Experience</h2>
            <p className="text-on-surface-variant mb-8">Help others discover great dining moments</p>

            <div className="space-y-8">
              {['food', 'service', 'ambiance', 'overall'].map((type) => (
                <RatingStars
                  key={type}
                  label={`${type.charAt(0).toUpperCase() + type.slice(1)} Rating`}
                  value={newReview.ratings[type as keyof typeof newReview.ratings]}
                  onChange={(v) =>
                    setNewReview({
                      ...newReview,
                      ratings: { ...newReview.ratings, [type]: v },
                    })
                  }
                />
              ))}

              <div>
                <label className="block text-on-surface-variant text-sm font-medium mb-3">Your Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="What made your visit special? Any suggestions?"
                  className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all h-32 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-outline-variant/30 text-on-surface py-3 rounded-xl font-semibold hover:bg-outline-variant/50 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sample Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-serif font-bold text-on-surface mb-6">Recent Reviews</h3>
          <div className="space-y-4">
            {[
              { name: 'Aditi Tyagi', review: 'Absolutely exceptional dining experience. The perfect ambiance and impeccable service!' },
              { name: 'Bipasha Chatterjee', review: 'Outstanding steaks and an impressive wine selection. Highly recommended!' },
              { name: 'Yadwinder Singh', review: 'A truly memorable evening with friends. Everything was perfect.' },
            ].map((reviewer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-on-surface font-semibold">{reviewer.name}</h4>
                    <p className="text-on-surface-variant text-sm">A few days ago</p>
                  </div>
                  <div className="text-primary">★★★★★</div>
                </div>
                <p className="text-on-surface/80 leading-relaxed">
                  {reviewer.review}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewPage;
