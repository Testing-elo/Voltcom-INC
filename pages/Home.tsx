
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Car, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="animate-in fade-in">
      {/* Hero Section */}
      <section className="bg-voltcomCharcoal text-white py-20 px-4 md:py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-2/3 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-tighter">
              Votre électricien certifié à <span className="text-voltcomRed">Montréal</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl font-light">
              Travaux résidentiels, mise aux normes, bornes VE — rapide, propre, certifié.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="bg-voltcomRed text-white px-8 py-4 rounded-sm font-black text-center hover:bg-opacity-90 transition-all text-lg uppercase tracking-widest"
              >
                Obtenir une soumission gratuite
              </Link>
              <Link 
                to="/services" 
                className="border-2 border-white text-white px-8 py-4 rounded-sm font-black text-center hover:bg-white hover:text-voltcomCharcoal transition-all text-lg uppercase tracking-widest"
              >
                Voir nos services
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-64 h-64 border-4 border-voltcomRed rounded-full flex items-center justify-center opacity-20 absolute -right-20 top-20">
              <Zap size={100} />
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-white text-voltcomCharcoal py-4 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center font-black text-xs tracking-[0.2em] uppercase">
            <div className="flex items-center gap-2">
              <Star className="text-voltcomRed fill-current" size={20} />
              <span>5.0 / 298 AVIS GOOGLE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-voltcomRed">✓</span>
              <span>MEMBRE CMEQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-voltcomRed">✓</span>
              <span>R.B.Q. 5618-6505</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter text-voltcomCharcoal">Services populaires</h2>
            <div className="h-1 w-20 bg-voltcomRed mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group bg-voltcomLightGray">
              <Zap className="text-voltcomRed mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-black mb-3 uppercase tracking-tighter text-voltcomCharcoal">Remplacement de panneau</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 mb-4 text-sm leading-relaxed">Passage des fusibles aux disjoncteurs pour une sécurité maximale.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group bg-voltcomLightGray">
              <Car className="text-voltcomRed mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-black mb-3 uppercase tracking-tighter text-voltcomCharcoal">Borne de recharge VE</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 mb-4 text-sm leading-relaxed">Installation rapide de bornes Niveau 2 (240V) à domicile.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group bg-voltcomLightGray">
              <ShieldCheck className="text-voltcomRed mb-4 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-xl font-black mb-3 uppercase tracking-tighter text-voltcomCharcoal">Rénovation électrique</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 mb-4 text-sm leading-relaxed">Mise aux normes et ajouts de circuits pour vos projets.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="text-voltcomRed font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:gap-4 transition-all">
              Voir tous nos services <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Voltcom */}
      <section className="py-20 bg-voltcomLightGray px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-voltcomRed text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-voltcomCharcoal">Réponse rapide</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 leading-relaxed text-sm">
                Nous comprenons l'importance de vos besoins électriques. Notre équipe intervient dans les meilleurs délais.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-voltcomRed text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-voltcomCharcoal">Travail certifié</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 leading-relaxed text-sm">
                Chaque projet est réalisé selon les normes du Code de l'électricité et assuré par notre licence RBQ.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-voltcomRed text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-voltcomCharcoal">Devis gratuit</h3>
              <p className="text-voltcomCharcoal font-medium opacity-80 leading-relaxed text-sm">
                Aucune surprise sur la facture. Nous fournissons des devis détaillés et transparents avant chaque intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-voltcomRed text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Prêt à démarrer votre projet?</h2>
          <p className="text-xl mb-10 opacity-90 font-light">Contactez-nous aujourd'hui pour une estimation gratuite et sans engagement.</p>
          <Link 
            to="/contact" 
            className="bg-white text-voltcomRed px-10 py-4 rounded-sm font-black text-lg hover:bg-opacity-90 transition-all uppercase tracking-widest"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
