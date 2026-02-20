import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';
import { SiteSettings } from '../types';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, servicesRes] = await Promise.all([
        supabase.from('settings').select('*').eq('id', 1).single(),
        supabase.from('services').select('title').eq('is_visible', true).order('display_order'),
      ]);

      if (settingsRes.data) {
        const d = settingsRes.data;
        setSettings({
          phone: d.phone,
          email: d.email,
          address: d.address,
          hours: d.hours,
          license: d.license,
          promoActive: d.promo_active,
          promoText: d.promo_text,
          promoExpiry: d.promo_expiry ?? '',
          emergencyActive: d.emergency_active,
          showCategories: d.show_categories,
        });
      }

      if (servicesRes.data) {
        setServices(servicesRes.data.map((s: any) => s.title));
      }
    };

    fetchData();

    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('contact_submissions').insert([
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        description: formData.description,
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', service: '', description: '' });
  };

  return (
    <div className="animate-in fade-in">
      <section className="bg-voltcomCharcoal text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Contactez-Nous</h1>
          <div className="h-1.5 w-20 bg-voltcomRed mx-auto"></div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-voltcomCharcoal uppercase tracking-tighter">
              Demander une soumission
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div className="text-green-600 text-5xl mb-4">✅</div>
                <h3 className="font-black text-voltcomCharcoal uppercase tracking-tighter text-xl mb-2">Demande envoyée!</h3>
                <p className="text-gray-500 text-sm">Nous vous contacterons sous peu.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-voltcomRed font-black text-xs uppercase tracking-widest underline"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">Nom complet</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Tremblay"
                      className="p-4 bg-voltcomLightGray rounded-sm focus:outline-none focus:ring-1 focus:ring-voltcomRed text-sm font-semibold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">Téléphone</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(514) 000-0000"
                      className="p-4 bg-voltcomLightGray rounded-sm focus:outline-none focus:ring-1 focus:ring-voltcomRed text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">Courriel</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@courriel.com"
                    className="p-4 bg-voltcomLightGray rounded-sm focus:outline-none focus:ring-1 focus:ring-voltcomRed text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">Type de travaux</label>
                  <select
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="p-4 bg-voltcomLightGray rounded-sm focus:outline-none focus:ring-1 focus:ring-voltcomRed text-sm font-semibold uppercase appearance-none"
                  >
                    <option value="" disabled>Sélectionnez un service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Détails de votre demande..."
                    className="p-4 bg-voltcomLightGray rounded-sm focus:outline-none focus:ring-1 focus:ring-voltcomRed text-sm font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-voltcomRed text-white py-5 rounded-sm font-black text-lg uppercase tracking-widest hover:bg-voltcomCharcoal transition-all shadow-xl disabled:opacity-60"
                >
                  {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-voltcomCharcoal text-white p-8 rounded-lg shadow-xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={200} />
              </div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
                <div className="w-1.5 bg-voltcomRed h-6"></div> Coordonnées
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <MapPin className="text-voltcomRed shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-black text-voltcomRed text-[9px] uppercase tracking-widest">Adresse</h4>
                    <p className="text-lg font-medium">{settings.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="text-voltcomRed shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-black text-voltcomRed text-[9px] uppercase tracking-widest">Téléphone</h4>
                    <p className="text-xl font-bold">{settings.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="text-voltcomRed shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-black text-voltcomRed text-[9px] uppercase tracking-widest">Courriel</h4>
                    <p className="text-lg font-medium">{settings.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock className="text-voltcomRed shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-black text-voltcomRed text-[9px] uppercase tracking-widest">Heures d'ouverture</h4>
                    <p className="text-lg font-medium">{settings.hours}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-700 text-[10px] font-black text-gray-500 tracking-widest uppercase">
                {settings.license}
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100 h-[300px] md:h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.755490795493!2d-73.5791244!3d45.5753041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91ecf681a29f5%3A0xe5435017df783777!2s6882%2024e%20Av.%2C%20Montr%C3%A9al%2C%20QC%20H1T%203M9%2C%20Canada!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
