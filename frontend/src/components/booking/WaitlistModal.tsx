import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common';
import { apiClient } from '../../services/api';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  guests: number;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, date, guests }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleJoin = async () => {
    setLoading(true);
    try {
      await apiClient.post('/waitlist', { requestedDate: date, partySize: guests });
      setStatus('success');
    } catch (err: any) {
      if (err.response?.data?.error?.code === 'ALREADY_WAITLISTED') {
         setStatus('success'); // Degrade gracefully visually
      } else {
         setStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-container-highest/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-surface-container p-8 rounded-3xl shadow-luxury-ambient max-w-sm w-full mx-auto pointer-events-auto border border-outline-variant/30 flex flex-col items-center text-center">
              
              <div className="text-secondary text-4xl mb-4">🔔</div>
              <h3 className="headline text-2xl mb-2 text-on-surface">Fully Committed</h3>
              
              {status === 'idle' && (
                <>
                  <p className="text-on-surface-variant mb-8 text-sm">
                    We currently have no availability for a party of {guests} on {date}. Priority access opens if cancellations occur.
                  </p>
                  <Button 
                    type="button" 
                    variant="primary" 
                    className="w-full mb-3" 
                    onClick={handleJoin}
                    isLoading={loading}
                  >
                    Join the Priority Waitlist
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
                    Explore Other Dates
                  </Button>
                </>
              )}

              {status === 'success' && (
                <>
                  <p className="text-on-surface-variant mb-8 text-sm">
                    You've been added to the Priority Waitlist for {date}. We will notify you immediately if a table opens up.
                  </p>
                  <Button type="button" variant="primary" className="w-full" onClick={onClose}>
                    Return to Booking
                  </Button>
                </>
              )}

              {status === 'error' && (
                <>
                  <p className="text-error mb-8 text-sm">
                    There was an issue joining the waitlist. Please try again.
                  </p>
                  <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
                    Close
                  </Button>
                </>
              )}

            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
