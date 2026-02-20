
import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { Project, DEFAULT_CATEGORIES, SiteSettings } from '../types';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [filter, setFilter] = useState<string>('TOUS');

  useEffect(() => {
    const savedProjects = localStorage.getItem('voltcom_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem('voltcom_projects', JSON.stringify(INITIAL_PROJECTS));
    }

    const savedCats = localStorage.getItem('voltcom_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }

    const savedSettings = localStorage.getItem('voltcom_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleFilter = (cat: string) => {
    setFilter(cat);
  };

  const filteredProjects = projects.filter(p => 
    filter === 'TOUS' || p.category === filter
  );

  return (
    <div className="animate-in fade-in pb-20">
      {/* Hero */}
      <section className="bg-voltcomCharcoal text-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black uppercase mb-4">Nos Réalisations</h1>
          <div className="h-1.5 w-16 md:w-24 bg-voltcomRed mx-auto"></div>
        </div>
      </section>

      {/* Public Filters & Grid */}
      <section className="py-8 md:py-12 bg-white px-4">
        {/* Horizontal scrollable categories on mobile - only if enabled */}
        {settings.showCategories && (
          <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar mb-8 pb-2">
            <div className="flex justify-start md:justify-center gap-2 md:gap-3 min-w-max px-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  className={`px-4 py-2 border-2 border-voltcomRed font-bold rounded-sm transition-all text-[10px] md:text-sm whitespace-nowrap uppercase tracking-widest ${
                    filter === cat 
                      ? 'bg-voltcomRed text-white' 
                      : 'bg-white text-voltcomCharcoal hover:bg-voltcomRed hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((p) => (
            <div 
              key={p.id} 
              className="bg-voltcomCharcoal rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative min-h-[320px] md:min-h-[350px] flex flex-col"
            >
              <div className="absolute top-3 left-3 z-10 bg-voltcomRed text-white text-[9px] md:text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-md uppercase">
                {p.category}
              </div>

              {/* Placeholder/Image Area */}
              <div className="h-48 md:h-56 bg-gray-800 flex items-center justify-center border-b border-gray-700 relative overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <>
                    <Zap className="text-voltcomRed opacity-20 group-hover:opacity-40 transition-opacity duration-300" size={60} />
                    <span className="absolute text-gray-500 font-bold uppercase tracking-widest text-[9px] bottom-3">Photo en attente</span>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 group-hover:text-voltcomRed transition-colors duration-300 uppercase leading-tight">{p.title}</h3>
                  <p className="text-gray-400 flex items-center gap-2 text-xs md:text-sm uppercase tracking-wide">
                    <span className="text-voltcomRed">•</span> {p.neighbourhood}
                  </p>
                </div>
                <div className="mt-4 pt-3 md:pt-4 border-t border-gray-700 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-voltcomRed text-[9px] md:text-xs font-bold tracking-widest uppercase">Voir détails</span>
                  <ChevronRight size={14} className="text-voltcomRed" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-voltcomCharcoal font-black uppercase tracking-widest text-xs opacity-40">
            Aucun projet ne correspond à cette catégorie.
          </div>
        )}
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Projects;
