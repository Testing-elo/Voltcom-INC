
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, AlertTriangle, Phone } from 'lucide-react';
import Logo from './Logo';
import { SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('voltcom_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check for expiry on promo message
      if (parsed.promoActive && parsed.promoExpiry) {
        const expiryDate = new Date(parsed.promoExpiry);
        if (new Date() > expiryDate) {
          parsed.promoActive = false;
          localStorage.setItem('voltcom_settings', JSON.stringify(parsed));
        }
      }
      setSettings(parsed);
    }
  }, [location]);

  const navLinks = [
    { name: 'SERVICES', path: '/services' },
    { name: 'PROJETS', path: '/projets' },
    { name: 'AVIS', path: '/avis' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* Emergency Banner */}
      {settings.emergencyActive && (
        <div className="bg-voltcomRed text-white py-2 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 animate-pulse">
          <AlertTriangle size={14} />
          <span>Service d'urgence disponible — Appelez {settings.phone}</span>
        </div>
      )}

      {/* Promo Banner - White Background, Black Text */}
      {settings.promoActive && !settings.emergencyActive && (
        <div className="bg-white text-voltcomCharcoal border-b border-voltcomRed/20 py-2.5 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-[0.15em] shadow-sm">
          {settings.promoText}
        </div>
      )}

      <nav className="border-b border-voltcomRed shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center">
              <Logo size="md" className="h-10 w-auto" />
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path}
                  className={({ isActive }) => 
                    isActive 
                      ? "text-voltcomRed border-b-2 border-voltcomRed font-bold pb-1" 
                      : "text-voltcomCharcoal hover:text-voltcomRed transition-colors font-semibold"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Link 
                to="/contact" 
                className="bg-voltcomRed text-white px-6 py-2 rounded-sm font-bold hover:bg-voltcomCharcoal transition-all uppercase text-sm tracking-wide"
              >
                Soumission Gratuite
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-voltcomCharcoal p-2">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block py-2 text-sm font-bold tracking-widest ${isActive ? 'text-voltcomRed' : 'text-voltcomCharcoal'}`}
              >
                {link.name}
              </NavLink>
            ))}
            <Link 
              to="/contact" 
              onClick={() => setIsOpen(false)}
              className="block bg-voltcomRed text-white text-center py-4 rounded-sm font-black text-sm tracking-widest"
            >
              SOUMISSION GRATUITE
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
