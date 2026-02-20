
import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../constants';

const Reviews: React.FC = () => {
  return (
    <div className="animate-in fade-in">
      {/* Hero */}
      <section className="bg-voltcomCharcoal text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Avis Clients</h1>
          <div className="h-1.5 w-24 bg-voltcomRed mx-auto"></div>
        </div>
      </section>

      {/* Banner */}
      <section className="bg-voltcomRed py-8 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xl md:text-2xl font-black uppercase tracking-tighter">
            <span className="bg-white text-voltcomRed px-3 py-1 rounded-sm">5.0 / 5</span>
            <span>⭐ 298 avis Google</span>
          </div>
          <button className="border-2 border-white text-white px-8 py-3 rounded-sm font-black hover:bg-white hover:text-voltcomRed transition-all uppercase tracking-widest">
            Laisser un avis
          </button>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="p-8 border border-gray-100 bg-voltcomLightGray rounded-lg shadow-sm flex flex-col h-full relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-voltcomRed opacity-5 group-hover:rotate-12 transition-transform">
                <MessageSquare size={100} />
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-voltcomRed fill-current mr-1" />
                ))}
              </div>
              
              <blockquote className="text-voltcomCharcoal font-medium italic mb-6 leading-relaxed flex-grow opacity-90 text-sm">
                "{review.quote}"
              </blockquote>
              
              <div className="flex flex-col">
                <span className="font-black text-voltcomCharcoal uppercase text-sm tracking-tight">{review.author}</span>
                <span className="text-[10px] font-black uppercase text-voltcomCharcoal opacity-50 tracking-widest">{review.neighbourhood}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Reviews Matter */}
      <section className="py-16 bg-voltcomCharcoal text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-tighter">La satisfaction client avant tout</h2>
          <p className="text-gray-400 leading-relaxed font-light">
            Chez Voltcom Inc., nous croyons en la transparence et l'excellence. Chaque avis Google reflète notre engagement à fournir un service de qualité supérieure pour tous nos clients à Montréal.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
