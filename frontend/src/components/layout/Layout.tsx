import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '../common';
import { Moon, Sun } from 'lucide-react';

import { AnimatePresence, motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference from document element class or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark) || document.documentElement.classList.contains('dark');
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
              <span className="text-primary text-sm font-serif font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface text-sm font-serif font-semibold tracking-[0.15em] uppercase leading-none">
                Prime Cut
              </span>
              <span className="text-on-surface-variant text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">
                Steakhouse
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Replaced with Sidebar Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-on-surface-variant hover:text-on-surface p-2 transition-colors z-[60]"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 flex flex-col gap-1.5 items-end relative">
                <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`} />
                <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileOpen ? 'w-0 opacity-0' : 'w-4'}`} />
                <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Elegant Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-surface shadow-2xl z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex flex-col h-full px-8 py-10 pt-24">
                <nav className="flex flex-col gap-6 flex-1 text-2xl font-serif">
                  <SidebarLink to="/" label="Home" active={location.pathname === '/'} onClick={() => setMobileOpen(false)} />
                  <SidebarLink to="/menu" label="Menu" active={location.pathname === '/menu'} onClick={() => setMobileOpen(false)} />
                  <SidebarLink to="/reviews" label="Reviews" active={location.pathname === '/reviews'} onClick={() => setMobileOpen(false)} />
                  <SidebarLink to="/book" label="Reserve a Table" active={location.pathname === '/book'} onClick={() => setMobileOpen(false)} />
                  
                  {isAuthenticated && (
                    <>
                      <SidebarLink to="/bookings" label="My Bookings" active={location.pathname === '/bookings'} onClick={() => setMobileOpen(false)} />
                      <SidebarLink to="/loyalty" label="Loyalty Program" active={location.pathname === '/loyalty'} onClick={() => setMobileOpen(false)} />
                    </>
                  )}
                  <SidebarLink to="/group-events" label="Group Events" active={location.pathname === '/group-events'} onClick={() => setMobileOpen(false)} />
                  
                  {user?.role === 'admin' && (
                    <SidebarLink to="/admin" label="Dashboard" active={location.pathname === '/admin'} onClick={() => setMobileOpen(false)} />
                  )}
                </nav>

                <div className="mt-8 border-t border-outline-variant/30 pt-8 space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium tracking-widest uppercase text-on-surface-variant">Theme</span>
                    <button
                      onClick={toggleTheme}
                      className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                  </div>

                  {/* Auth Actions */}
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="text-on-surface font-medium">{user?.firstName}</span>
                      </div>
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="text-sm border border-error/50 text-error px-4 py-2 hover:bg-error hover:text-white rounded-full transition-all uppercase tracking-wider font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link 
                        to="/login" 
                        onClick={() => setMobileOpen(false)}
                        className="w-full text-center py-3 border border-outline-variant/50 rounded-full text-on-surface hover:border-primary hover:text-primary transition-colors font-medium tracking-wide uppercase text-sm"
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={() => setMobileOpen(false)}
                        className="w-full text-center py-3 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors font-medium tracking-wide uppercase text-sm"
                      >
                         Join Us
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const SidebarLink: React.FC<{ to: string; label: string; active?: boolean; onClick: () => void }> = ({
  to,
  label,
  active,
  onClick
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group flex items-center justify-between transition-colors ${
      active ? 'text-primary' : 'text-on-surface hover:text-primary'
    }`}
  >
    <span className="relative overflow-hidden">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 italic text-primary">
        {label}
      </span>
    </span>
    {active && <span className="w-2 h-2 rounded-full bg-primary" />}
  </Link>
);

const NavLink: React.FC<{ to: string; label: string; active: boolean }> = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 text-sm tracking-wide transition-all duration-300 rounded-lg ${
      active
        ? 'text-primary bg-primary/8'
        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink: React.FC<{ to: string; label: string; onClick: () => void }> = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-on-surface-variant hover:text-on-surface text-sm tracking-wide py-2 transition-colors"
  >
    {label}
  </Link>
);


export const Footer: React.FC = () => (
  <footer className="bg-surface-container-lowest border-t border-outline-variant/20 mt-0">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-xs font-serif font-bold">P</span>
            </div>
            <span className="text-on-surface font-serif text-sm tracking-[0.15em] uppercase">Prime Cut</span>
          </div>
          <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs">
            An elevated steakhouse experience where every detail is curated for perfection.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-on-surface text-xs uppercase tracking-[0.2em] font-medium mb-4">Features</h4>
          <div className="space-y-3">
            <Link to="/" className="text-on-surface-variant hover:text-primary text-sm block transition-colors">Home</Link>
            <Link to="/menu" className="text-on-surface-variant hover:text-primary text-sm block transition-colors">Menu</Link>
            <Link to="/reviews" className="text-on-surface-variant hover:text-primary text-sm block transition-colors">Reviews</Link>
            <Link to="/book" className="text-on-surface-variant hover:text-primary text-sm block transition-colors">Reservations</Link>
            <Link to="/group-events" className="text-on-surface-variant hover:text-primary text-sm block transition-colors">Group Events</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-on-surface text-xs uppercase tracking-[0.2em] font-medium mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-on-surface-variant">
            <p>info@theprimecut.com</p>
            <p>+91 98765 43210</p>
            <p>GT Road, Kharar, Punjab</p>
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-on-surface text-xs uppercase tracking-[0.2em] font-medium mb-4">Hours</h4>
          <div className="space-y-3 text-sm text-on-surface-variant">
            <p>Mon – Thu: 5pm – 11pm</p>
            <p>Fri – Sat: 5pm – 12am</p>
            <p>Sunday: 4pm – 10pm</p>
          </div>
        </div>
      </div>

      <div className="py-6 border-t border-outline-variant/15 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-xs tracking-wider">&copy; 2024 The Prime Cut. All rights reserved.</p>
        <div className="flex gap-6 text-on-surface-variant text-xs">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Accessibility</span>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 pt-24">{children}</main>
    <Footer />
  </div>
);
