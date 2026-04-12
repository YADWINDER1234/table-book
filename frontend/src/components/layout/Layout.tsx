import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '../common';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isHome = location.pathname === '/';
  const navBg = scrolled || !isHome
    ? 'bg-surface/95 backdrop-blur-xl shadow-nav-glow border-b border-outline-variant/30'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" active={location.pathname === '/'} />
            <NavLink to="/menu" label="Menu" active={location.pathname === '/menu'} />
            <NavLink to="/reviews" label="Reviews" active={location.pathname === '/reviews'} />
            <NavLink to="/book" label="Reserve" active={location.pathname === '/book'} />
            
            {isAuthenticated && (
              <>
                <NavLink to="/bookings" label="My Bookings" active={location.pathname === '/bookings'} />
                <NavLink to="/loyalty" label="Loyalty" active={location.pathname === '/loyalty'} />
              </>
            )}
            
            <NavLink to="/group-events" label="Events" active={location.pathname === '/group-events'} />
            
            {user?.role === 'admin' && (
              <NavLink to="/admin" label="Dashboard" active={location.pathname === '/admin'} />
            )}

            <div className="w-px h-5 bg-outline-variant/40 mx-3" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary text-xs font-medium">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-sm hidden lg:block">{user?.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-on-surface-variant hover:text-error transition-colors uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all duration-300 tracking-wide"
                >
                  Join Us
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-on-surface-variant hover:text-on-surface p-2 transition-colors"
            aria-label="Toggle navigation"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface/98 backdrop-blur-xl border-t border-outline-variant/20 animate-fade-in">
          <div className="px-6 py-6 space-y-4">
            <MobileNavLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
            <MobileNavLink to="/menu" label="Menu" onClick={() => setMobileOpen(false)} />
            <MobileNavLink to="/reviews" label="Reviews" onClick={() => setMobileOpen(false)} />
            <MobileNavLink to="/book" label="Reserve a Table" onClick={() => setMobileOpen(false)} />
            {isAuthenticated && (
              <>
                <MobileNavLink to="/bookings" label="My Bookings" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to="/loyalty" label="Loyalty Program" onClick={() => setMobileOpen(false)} />
              </>
            )}
            <MobileNavLink to="/group-events" label="Group Events" onClick={() => setMobileOpen(false)} />
            {user?.role === 'admin' && (
              <MobileNavLink to="/admin" label="Dashboard" onClick={() => setMobileOpen(false)} />
            )}
            <div className="border-t border-outline-variant/20 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="text-sm text-on-surface-variant hover:text-error uppercase tracking-wider"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-on-surface-variant">Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-primary">Join Us</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

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
