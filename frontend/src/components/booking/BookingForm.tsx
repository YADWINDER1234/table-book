import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Alert, LoadingSpinner } from '../common';
import { FloorMap } from './FloorMap';
import { WaitlistModal } from './WaitlistModal';
import { useBooking } from '../../hooks/useBooking';
import { useTables } from '../../hooks/useTables';
import { validatePhone } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';

export const BookingForm: React.FC<{ onSuccess?: (bookingId: string) => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    bookingDate: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    numberOfGuests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    tableId: '',
    specialRequests: '',
  });
  
  const [showMap, setShowMap] = useState(false);

  const { createBooking, isLoading: bookingLoading, error: bookingError } = useBooking();
  const { fetchAvailableTables, availableTables, isLoading: tablesLoading } = useTables();

  // Derived backend needs
  const startTime = formData.time;
  // Assume a standard 2 hour dinner duration for simple booking
  const endTime = startTime ? `${String((parseInt(startTime.split(':')[0]) + 2) % 24).padStart(2, '0')}:${startTime.split(':')[1]}` : '';

  useEffect(() => {
    if (formData.bookingDate && startTime && endTime && formData.numberOfGuests) {
      fetchAvailableTables(formData.bookingDate, startTime, endTime, formData.numberOfGuests);
    }
  }, [formData.bookingDate, startTime, endTime, formData.numberOfGuests, fetchAvailableTables]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value, tableId: field === 'time' || field === 'bookingDate' ? '' : prev.tableId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(formData.guestPhone)) {
      alert('Invalid phone number format');
      return;
    }
    
    // Auto-assign table if user didn't pick one manually
    let finalTableId = formData.tableId;
    if (!finalTableId && availableTables.length > 0) {
      finalTableId = availableTables[0]._id; // Just grab first available
    }

    if (!finalTableId) {
      alert("No tables available for this selection.");
      return;
    }

    try {
      const booking = await createBooking({
        ...formData,
        startTime,
        endTime,
        tableId: finalTableId,
        numberOfGuests: Number(formData.numberOfGuests),
      });
      onSuccess?.(booking.bookingId);
    } catch (err) {
      // Error is handled by hook
    }
  };

  // Generate date chips (next 14 days)
  const dateChips = Array.from({ length: 14 }).map((_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      displayDay: format(date, 'EEE'),
      displayDate: format(date, 'MMM d')
    };
  });

  const timeSlots = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto pb-24">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* SECTION: Party Size */}
        <section>
          <h3 className="headline text-2xl mb-6">The Guest List</h3>
          <div className="flex items-center gap-6">
            <button 
              type="button" 
              onClick={() => setField('numberOfGuests', Math.max(1, formData.numberOfGuests - 1))}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-xl hover:bg-surface-container-highest transition-colors"
            >
              -
            </button>
            <div className="text-3xl font-light w-16 text-center">{formData.numberOfGuests}</div>
            <button 
              type="button" 
              onClick={() => setField('numberOfGuests', Math.min(12, formData.numberOfGuests + 1))}
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-xl hover:bg-surface-container-highest transition-colors"
            >
              +
            </button>
            <span className="text-on-surface-variant text-sm uppercase tracking-widest">Guests</span>
          </div>
        </section>

        {/* SECTION: Date */}
        <section>
          <h3 className="headline text-2xl mb-6">Select Evening</h3>
          <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {dateChips.map((chip) => {
              const isSelected = formData.bookingDate === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setField('bookingDate', chip.value)}
                  className={`snap-start min-w-[5rem] px-4 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-primary text-on-primary font-medium border-primary shadow-luxury-ambient scale-105' 
                      : 'bg-surface border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-lowest'
                  }`}
                >
                  <span className="text-xs uppercase tracking-widest opacity-80 mb-1">{chip.displayDay}</span>
                  <span className="text-lg">{chip.displayDate.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION: Time */}
        <section>
          <h3 className="headline text-2xl mb-6">Reservation Time</h3>
          <div className="flex flex-wrap gap-3">
            {timeSlots.map((t) => {
              const isSelected = formData.time === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setField('time', t)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${
                    isSelected
                      ? 'bg-secondary text-on-secondary border-secondary shadow-md'
                      : 'bg-surface border-outline-variant/40 hover:border-secondary/60 hover:bg-surface-container-lowest'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION: Status & Floor Map */}
        <AnimatePresence>
          {formData.time && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="headline text-xl">Table Availability</h4>
                    {tablesLoading ? (
                      <div className="text-sm text-on-surface-variant flex items-center gap-2 mt-1">
                        <LoadingSpinner /> Checking floor plan...
                      </div>
                    ) : availableTables.length > 0 ? (
                      <div className="text-sm text-primary mt-1">We can accommodate you.</div>
                    ) : (
                      <div className="flex flex-col items-start gap-2 mt-2">
                        <div className="text-sm text-error">No tables available at this time.</div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowMap(true)}>
                          Join the Waitlist
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {availableTables.length > 0 && (
                    <Button type="button" variant="ghost" onClick={() => setShowMap(!showMap)}>
                      {showMap ? 'Hide Map' : 'Select Specific Table'}
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {showMap && availableTables.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <FloorMap 
                        availableTables={availableTables} 
                        selectedTableId={formData.tableId} 
                        onSelectTable={(id) => setField('tableId', id)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <WaitlistModal 
                  isOpen={showMap && availableTables.length === 0} 
                  onClose={() => setShowMap(false)} 
                  date={formData.bookingDate} 
                  guests={formData.numberOfGuests} 
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SECTION: Dossier */}
        <AnimatePresence>
          {formData.time && availableTables.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6 pt-6 border-t border-outline-variant/20"
            >
              <h3 className="headline text-2xl mb-8">Guest Dossier</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Full Name" name="guestName" value={formData.guestName} onChange={handleInputChange} required />
                <Input label="Email" type="email" name="guestEmail" value={formData.guestEmail} onChange={handleInputChange} required />
                <Input label="Phone" name="guestPhone" value={formData.guestPhone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" required />
              </div>
              <div className="mt-6">
                <label className="block text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-3">Special Occasions & Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Anniversary? Dietary restrictions? Let us know..."
                  className="input-quiet w-full min-h-[100px] text-lg"
                />
              </div>

              <div className="pt-8">
                {bookingError && <div className="mb-4"><Alert type="error" message={bookingError} /></div>}
                <Button type="submit" variant="primary" size="lg" className="w-full h-16 text-lg tracking-wider" isLoading={bookingLoading}>
                  Confirm Reservation →
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

      </form>
    </motion.div>
  );
};

import { QRCodeSVG } from 'qrcode.react';

export const BookingConfirmation: React.FC<{ bookingId: string }> = ({ bookingId }) => (
  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center mt-12 bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/30 shadow-luxury-ambient relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
    <div className="text-secondary mb-6 text-5xl">✦</div>
    <h2 className="headline text-4xl mb-2 text-on-surface">Reservation Confirmed</h2>
    <p className="text-sm uppercase tracking-widest text-on-surface-variant font-bold mb-8">The Prime Cut</p>
    
    <div className="bg-surface-bright p-6 rounded-2xl flex flex-col items-center justify-center border border-outline-variant/20 mb-8 w-64 mx-auto">
      <QRCodeSVG 
        value={`primecut-booking-${bookingId}`} 
        size={160}
        bgColor={"#ffffff"}
        fgColor={"#0a0a0a"}
        level={"H"}
        includeMargin={true}
        className="rounded-lg shadow-sm"
      />
      <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-4 font-mono">{bookingId}</p>
    </div>

    <p className="text-sm uppercase tracking-widest text-on-surface-variant/70">A formal itinerary has been sent to your email.</p>
    <p className="text-xs uppercase tracking-widest text-primary font-bold mt-4">Present this code upon arrival</p>
  </motion.div>
);
