import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupEventForm {
  eventName: string;
  eventType: 'Corporate' | 'Wedding' | 'Birthday' | 'Conference' | 'Other';
  eventDate: string;
  estimatedGuests: number;
  specialRequirements: string;
  description: string;
}

const EventBookingPage: React.FC = () => {
  const [eventData, setEventData] = useState<GroupEventForm>({
    eventName: '',
    eventType: 'Corporate',
    eventDate: '',
    estimatedGuests: 20,
    specialRequirements: '',
    description: '',
  });

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState(0);

  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      minGuests: 10,
      maxGuests: 50,
      pricePerHead: 50,
      inclusions: ['Table reservations', 'Standard menu', 'Basic service'],
    },
    {
      id: 'premium',
      name: 'Premium Package',
      minGuests: 50,
      maxGuests: 150,
      pricePerHead: 75,
      inclusions: [
        'Table reservations',
        'Premium menu',
        'Dedicated coordinator',
        'Decorations',
      ],
    },
    {
      id: 'luxury',
      name: 'Luxury Package',
      minGuests: 100,
      maxGuests: 300,
      pricePerHead: 100,
      inclusions: [
        'Table reservations',
        'Luxury menu',
        'Dedicated team',
        'Full decorations',
        'Entertainment',
        'Custom menu',
      ],
    },
  ];

  const calculateCost = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setSelectedPackage(packageId);
      setEstimatedCost(pkg.pricePerHead * eventData.estimatedGuests);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: name === 'estimatedGuests' ? parseInt(value) : value,
    });
    if (selectedPackage) {
      calculateCost(selectedPackage);
    }
  };

  const handleSubmit = async () => {
    console.log('Event booking submitted:', {
      ...eventData,
      selectedPackage,
      estimatedCost,
    });
    alert('Event enquiry submitted! Our team will contact you soon.');
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-on-surface mb-2">Group Events</h1>
          <p className="text-on-surface-variant text-lg">Plan your perfect celebration with us</p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  s < step
                    ? 'bg-primary text-on-primary'
                    : s === step
                      ? 'bg-secondary text-on-secondary ring-4 ring-secondary/30'
                      : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {s < step ? '✓' : s}
              </motion.div>
              {s < 3 && (
                <motion.div
                  className={`flex-1 h-1 rounded-full transition-all ${
                    s < step ? 'bg-primary' : 'bg-outline-variant/30'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step 1: Event Details */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface-container rounded-3xl p-8 md:p-12 border border-outline-variant/30 backdrop-blur-xl"
            >
              <h2 className="text-3xl font-serif font-bold text-on-surface mb-8">Event Details</h2>
              <form className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-on-surface-variant text-sm font-medium mb-3">Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    value={eventData.eventName}
                    onChange={handleChange}
                    placeholder="e.g., Annual Company Dinner"
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <label className="block text-on-surface-variant text-sm font-medium mb-3">Event Type *</label>
                    <select
                      name="eventType"
                      value={eventData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                      <option value="Corporate">💼 Corporate</option>
                      <option value="Wedding">💒 Wedding</option>
                      <option value="Birthday">🎂 Birthday</option>
                      <option value="Conference">📊 Conference</option>
                      <option value="Other">✨ Other</option>
                    </select>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-on-surface-variant text-sm font-medium mb-3">Event Date *</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={eventData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <label className="block text-on-surface-variant text-sm font-medium mb-3">
                    Number of Guests * (Minimum: 10)
                  </label>
                  <input
                    type="number"
                    name="estimatedGuests"
                    value={eventData.estimatedGuests}
                    onChange={handleChange}
                    min="10"
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-on-surface-variant text-sm font-medium mb-3">Event Description</label>
                  <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your event vision..."
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-primary text-on-primary py-3 rounded-xl hover:bg-primary/90 font-semibold transition-all shadow-lg"
                >
                  Next: Choose Package
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Package Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-surface-container rounded-3xl p-8 md:p-12 border border-outline-variant/30 backdrop-blur-xl">
                <h2 className="text-3xl font-serif font-bold text-on-surface mb-2">Select Your Package</h2>
                <p className="text-on-surface-variant mb-8">Choose the perfect package for your event</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {packages.map((pkg, idx) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      onClick={() => calculateCost(pkg.id)}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all group ${
                        selectedPackage === pkg.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-outline-variant/30 hover:border-secondary/50 bg-surface-container/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">{pkg.name}</h3>
                      <p className="text-4xl font-bold text-primary mb-4">
                        <span className="text-lg">₹</span>{pkg.pricePerHead * 83}<span className="text-base text-on-surface-variant">/person</span>
                      </p>
                      <p className="text-sm text-on-surface-variant mb-6">
                        {pkg.minGuests}-{pkg.maxGuests} guests
                      </p>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((incl, i) => (
                          <li key={i} className="text-sm text-on-surface/80 flex gap-2">
                            <span className="text-primary">✓</span>
                            <span>{incl}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 mb-8"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-on-surface-variant text-sm mb-1">Estimated Total Cost</p>
                        <p className="text-5xl font-bold text-primary">₹{(estimatedCost * 83).toFixed(0)}</p>
                      </div>
                      <div className="text-right text-on-surface-variant text-sm">
                        <p>{eventData.estimatedGuests} guests</p>
                        <p className="text-primary font-semibold">₹{(packages.find((p) => p.id === selectedPackage)?.pricePerHead || 0) * 83}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="flex-1 bg-outline-variant/30 text-on-surface py-3 rounded-xl hover:bg-outline-variant/50 font-semibold transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    disabled={!selectedPackage}
                    className="flex-1 bg-primary text-on-primary py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 font-semibold transition-all shadow-lg"
                  >
                    Next: Special Requests
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Special Requests */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-surface-container rounded-3xl p-8 md:p-12 border border-outline-variant/30 backdrop-blur-xl">
                <h2 className="text-3xl font-serif font-bold text-on-surface mb-8">Special Requests</h2>

                <div className="mb-8">
                  <label className="block text-on-surface-variant text-sm font-medium mb-3">
                    Any special requirements?
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={eventData.specialRequirements}
                    onChange={handleChange}
                    placeholder="Dietary restrictions, decorations, entertainment, music preferences, etc..."
                    rows={6}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/30 rounded-xl text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                </div>

                {/* Booking Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/15 to-secondary/15 border-2 border-primary/30 rounded-2xl p-8 mb-8"
                >
                  <h3 className="text-2xl font-bold text-on-surface mb-6">📋 Booking Summary</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Event Name', value: eventData.eventName || '—' },
                      { label: 'Event Type', value: eventData.eventType },
                      { label: 'Date', value: eventData.eventDate || '—' },
                      { label: 'Guests', value: `${eventData.estimatedGuests} people` },
                      { label: 'Package', value: packages.find((p) => p.id === selectedPackage)?.name || '—' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center text-on-surface pb-3 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">{item.label}</span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-4 border-t-2 border-primary/40">
                    <span className="text-on-surface">Total Cost:</span>
                    <span className="text-primary text-4xl">${estimatedCost.toFixed(2)}</span>
                  </div>
                </motion.div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="flex-1 bg-outline-variant/30 text-on-surface py-3 rounded-xl hover:bg-outline-variant/50 font-semibold transition-all"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-on-primary py-3 rounded-xl hover:shadow-lg font-semibold transition-all shadow-lg"
                  >
                    ✨ Submit Event Enquiry
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventBookingPage;
