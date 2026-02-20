import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';
import { SiteSettings } from '../types';
import Logo from './Logo';
import { supabase } from '../lib/supabase';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error || !data) return;

      setSettings({
        phone: data.phone,
        email: data.email,
        address: data.address,
        hours: data.hours,
        license: data.license,
        promoActive: data.promo_active,
        promoText: data.promo_text,
        promoExpiry: data.promo_expiry ?? '',
        emergencyActive: data.emergency_active,
        showCategories: data.show_categories,
      });
    };

    fetchSettings();
  }, [location]);

  return (
    <footer className="bg-voltcomCharcoal text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="mb-6 -ml-2">
              <Logo size="sm" className="brightness-0 invert opacity-90" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Votre partenaire électrique de confiance à Montréal. Travaux certifiés RBQ et membre de la CMEQ.
            </p>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {settings.license}
            </div>
          </div>

          <div className="md:pl-10">
            <h4 className="text-lg font-bold mb-6 text-voltcomRed uppercase tracking-tighter">Navigation</h4>
            <ul className="space-y-3 text-gray-300 font-medium text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/projets" className="hover:text-white transition-colors">Réalisations</Link></li>
              <li><Link to="/avis" className="hover:text-white transition-colors">Avis clients</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-voltcomRed uppercase tracking-tighter">Contact</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-voltcomRed" />
                <a href={`tel:${settings.phone.replace(/\D/g, '')}`}>{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-voltcomRed" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-voltcomRed mt-1 shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-gray-500 tracking-widest uppercase">
          <p>© 2025 Voltcom Inc. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-voltcomRed transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
