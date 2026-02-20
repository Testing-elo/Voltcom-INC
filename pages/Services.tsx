
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_LIST } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="animate-in fade-in">
      {/* Hero */}
      <section className="bg-voltcomCharcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Nos Services</h1>
          <div className="h-1.5 w-24 bg-voltcomRed mx-auto"></div>
        </div>
      </section>

      {/* List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_LIST.map((service, index) => (
              <div 
                key={service.id} 
                className={`p-10 border rounded-lg shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center ${index % 2 === 0 ? 'bg-white' : 'bg-voltcomLightGray'}`}
              >
                <div className="mb-6 transform hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black mb-4 text-voltcomCharcoal uppercase tracking-tighter">{service.title}</h3>
                <p className="text-voltcomCharcoal font-medium opacity-80 mb-8 leading-relaxed flex-grow text-sm">
                  {service.description}
                </p>
                <Link 
                  to={`/contact?service=${service.title}`}
                  className="bg-voltcomRed text-white px-6 py-3 rounded-sm font-black hover:bg-opacity-90 transition-all text-sm uppercase tracking-widest"
                >
                  Demander une soumission
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Service Callout */}
      <section className="bg-voltcomLightGray py-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter text-voltcomCharcoal">Un problème urgent à Montréal?</h2>
          <p className="text-voltcomCharcoal font-medium opacity-80 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
            Nos électriciens sont disponibles pour des interventions rapides. Ne laissez pas un problème électrique s'aggraver.
          </p>
          <a 
            href="tel:5145076847" 
            className="inline-flex items-center gap-3 bg-voltcomCharcoal text-white px-8 py-4 rounded-sm font-black text-lg hover:bg-voltcomRed transition-all uppercase tracking-widest"
          >
            Appeler maintenant : (514) 507-6847
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
