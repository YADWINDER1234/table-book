import React from 'react';
import { LoginForm, SignupForm } from '../components/auth/AuthForms';
import { BookingForm, BookingConfirmation } from '../components/booking/BookingForm';
import { BookingCard } from '../components/booking/BookingCard';
import { LoadingSpinner, Alert } from '../components/common';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { BookingManagement } from '../components/admin/BookingManagement';
import { useBooking } from '../hooks/useBooking';

import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

// Home page component
export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
  <div className="w-full">
    {/* Hero Section */}
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-8af9983f4fec?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 text-center px-4 max-w-4xl pt-20"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-primary text-xs uppercase tracking-[0.4em] font-medium mb-6 block"
        >
          Est. 2018 · Kharar
        </motion.span>
        <h1 className="headline text-5xl md:text-7xl lg:text-8xl font-bold text-on-surface mb-6 leading-[0.95] uppercase tracking-[0.15em]">
          The Prime Cut
        </h1>
        <div className="w-16 h-px bg-primary/40 mx-auto mb-6" />
        <p className="text-base md:text-lg text-on-surface-variant mb-12 max-w-xl mx-auto font-light leading-relaxed">
          An elevated steakhouse experience where heritage meets craft. Secure your table.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/book" className="px-10 py-4 bg-primary text-on-primary rounded-full font-medium text-sm tracking-[0.1em] uppercase hover:shadow-luxury-ambient hover:scale-[1.02] transition-all duration-300">
            Reserve a Table
          </a>
          {!isAuthenticated ? (
            <a href="/login" className="px-10 py-4 border border-outline-variant/60 text-on-surface rounded-full font-medium text-sm tracking-[0.1em] uppercase hover:border-primary/40 hover:text-primary transition-all duration-300">
              Sign In
            </a>
          ) : (
            <a href="/bookings" className="px-10 py-4 border border-outline-variant/60 text-on-surface rounded-full font-medium text-sm tracking-[0.1em] uppercase hover:border-primary/40 hover:text-primary transition-all duration-300">
              My Reservations
            </a>
          )}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border border-outline-variant/40 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-primary/60"
          />
        </div>
      </motion.div>
    </section>

    {/* Featured Highlights */}
    <section className="py-28 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-xs uppercase tracking-[0.4em] font-medium mb-4 block">The Experience</span>
          <h2 className="headline text-3xl md:text-4xl uppercase tracking-[0.12em] text-on-surface">Crafted for Distinction</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'The Dining Room', desc: 'Auto-assigned tables based on party size, or explore the dimly lit dining room via our Eagle Eye selector.', icon: '◆', delay: 0.1 },
            { title: 'The Priority Queue', desc: 'If your preferred cut or time is booked, join our queue to receive priority alerts from the Maître d\'.', icon: '◇', delay: 0.2 },
            { title: 'The Guest Dossier', desc: 'Build your profile with dietary restrictions and occasions so we can prepare your experience ahead of time.', icon: '○', delay: 0.3 }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.6 }}
              className="p-8 rounded-xl bg-surface-container border border-outline-variant/15 hover:border-primary/20 hover:shadow-luxury-ambient transition-all duration-500 group"
            >
              <div className="text-primary/60 mb-5 text-lg group-hover:text-primary transition-colors">{feature.icon}</div>
              <h3 className="headline text-lg mb-3 text-on-surface tracking-wide">{feature.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* The Menu Preview */}
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-xs uppercase tracking-[0.4em] font-medium mb-4 block">Our Offerings</span>
          <h2 className="headline text-3xl md:text-4xl uppercase tracking-[0.12em] text-on-surface">Signature Cuts</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {/* Menu Item 1 */}
          <div className="border-b border-outline-variant/20 pb-6 group">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="headline text-xl text-on-surface group-hover:text-primary transition-colors">Dry-Aged Tomahawk</h4>
              <span className="text-primary font-medium tracking-wide">$145</span>
            </div>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed">40oz bone-in ribeye, dry-aged in-house for 35 days. Served with roasted garlic bone marrow butter.</p>
          </div>

          {/* Menu Item 2 */}
          <div className="border-b border-outline-variant/20 pb-6 group">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="headline text-xl text-on-surface group-hover:text-primary transition-colors">A5 Wagyu Striploin</h4>
              <span className="text-primary font-medium tracking-wide">$220</span>
            </div>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed">6oz Kagoshima Prefecture A5. Seared tableside over binchotan charcoal. Grated fresh wasabi.</p>
          </div>

          {/* Menu Item 3 */}
          <div className="border-b border-outline-variant/20 pb-6 group">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="headline text-xl text-on-surface group-hover:text-primary transition-colors">Alaskan King Crab</h4>
              <span className="text-primary font-medium tracking-wide">$95</span>
            </div>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed">1lb split legs, wild-caught. Drawn Meyer lemon butter, smoked sea salt, chives.</p>
          </div>

          {/* Menu Item 4 */}
          <div className="border-b border-outline-variant/20 pb-6 group">
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="headline text-xl text-on-surface group-hover:text-primary transition-colors">The Prime Filet</h4>
              <span className="text-primary font-medium tracking-wide">$85</span>
            </div>
            <p className="text-on-surface-variant text-sm font-light leading-relaxed">10oz center-cut filet mignon, black truffle demi-glace, confit wild mushrooms.</p>
          </div>
        </div>

        <div className="text-center mt-16">
          <a href="/book" className="text-sm uppercase tracking-[0.2em] font-medium text-primary hover:text-on-surface transition-colors underline underline-offset-8">
            Secure a Table to Dine
          </a>
        </div>
      </div>
    </section>

    {/* Celebrity Reviews */}
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-xs uppercase tracking-[0.4em] font-medium mb-4 block">Testimonials</span>
          <h2 className="headline text-3xl md:text-4xl text-center uppercase tracking-[0.12em] text-on-surface">Critique & Acclaim</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface-container p-10 rounded-xl relative border border-outline-variant/15">
            <div className="text-4xl text-primary absolute top-6 left-6 opacity-20">"</div>
            <p className="text-on-surface italic text-lg leading-relaxed relative z-10">
              The Tomahawk was an absolute religious experience. The Prime Cut has redefined what a modern steakhouse should feel like—effortless, dark, and perfectly curated.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest content-center text-center text-xl">👨‍🍳</div>
              <div>
                <p className="font-bold text-on-surface uppercase tracking-wider text-sm">Gordon Ramsay</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">Michelin Star Chef</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container p-10 rounded-xl relative border border-outline-variant/15">
            <div className="text-4xl text-primary absolute top-6 left-6 opacity-20">"</div>
            <p className="text-on-surface italic text-lg leading-relaxed relative z-10">
              From the VIP priority queue to the ambient lighting, everything here screams exclusivity. I requested a specific window booth using their Eagle-Eye system, and it was waiting for me flawlessly.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest content-center text-center text-xl">🎬</div>
              <div>
                <p className="font-bold text-on-surface uppercase tracking-wider text-sm">Leonardo DiCaprio</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">Actor & Environmentalist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

// Login page wrapper
export const LoginPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
      <LoginForm />
    </div>
  );
};

// Signup page wrapper  
export const SignupPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
      <SignupForm />
    </div>
  );
};

// Booking page
export const BookingPage: React.FC = () => {
  const [bookingId, setBookingId] = React.useState<string | null>(null);

  if (bookingId) {
    return (
      <div className="py-16">
        <BookingConfirmation bookingId={bookingId} />
        <div className="text-center mt-8">
          <a href="/bookings" className="text-primary hover:underline">
            View My Bookings →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Table</h1>
      <BookingForm onSuccess={setBookingId} />
    </div>
  );
};

// My bookings page
export const MyBookingsPage: React.FC = () => {
  const { bookings, isLoading, error, fetchBookings, cancelBooking } = useBooking();

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-16">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      {error && <Alert type="error" message={error} />}
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">No bookings yet</p>
          <a href="/book" className="text-primary hover:underline">
            Book a table now →
          </a>
        </div>
      ) : (
        <div>
          {bookings.map((booking: any) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={() => cancelBooking(booking._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Admin page
export const AdminPage: React.FC = () => {
  const [tab, setTab] = React.useState('dashboard');

  return (
    <div className="py-16">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setTab('dashboard')}
          className={`px-4 py-2 rounded-lg text-sm tracking-wide transition-all ${ tab === 'dashboard' ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/20 hover:text-on-surface'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`px-4 py-2 rounded-lg text-sm tracking-wide transition-all ${tab === 'bookings' ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant border border-outline-variant/20 hover:text-on-surface'}`}
        >
          Manage Bookings
        </button>
      </div>
      {tab === 'dashboard' && <AdminDashboard />}
      {tab === 'bookings' && <BookingManagement />}
    </div>
  );
};
