
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Plus, Trash2, Lock, Edit2, X, 
  Image as ImageIcon, Save, LogOut, CheckCircle, 
  LayoutDashboard, FolderKanban, Settings, Bell, 
  Phone, Mail, Clock, ShieldCheck, MapPin, AlertTriangle
} from 'lucide-react';
import { Project, DEFAULT_CATEGORIES, SiteSettings } from '../types';
import { INITIAL_PROJECTS, DEFAULT_SETTINGS } from '../constants';

const Admin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [activeView, setActiveView] = useState<'projects' | 'categories' | 'info' | 'messages'>('projects');
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    neighbourhood: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('voltcom_projects');
    setProjects(savedProjects ? JSON.parse(savedProjects) : INITIAL_PROJECTS);

    const savedCats = localStorage.getItem('voltcom_categories');
    setCategories(savedCats ? JSON.parse(savedCats) : DEFAULT_CATEGORIES);

    const savedSettings = localStorage.getItem('voltcom_settings');
    setSettings(savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS);
    
    const session = sessionStorage.getItem('voltcom_admin_session');
    if (session === 'active') setIsLoggedIn(true);
  }, []);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'voltcom2025') {
      setIsLoggedIn(true);
      sessionStorage.setItem('voltcom_admin_session', 'active');
      showNotify('Session active');
    } else {
      showNotify('Code invalide', 'error');
    }
  };

  const saveSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('voltcom_settings', JSON.stringify(newSettings));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('voltcom_admin_session');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Project[];
    if (editingProject) {
      updated = projects.map(p => p.id === editingProject.id ? { ...p, ...formData, isPlaceholder: !formData.imageUrl } : p);
      showNotify('Mise à jour OK');
    } else {
      const project: Project = { id: Date.now().toString(), ...formData, isPlaceholder: !formData.imageUrl };
      updated = [project, ...projects];
      showNotify('Projet publié');
    }
    setProjects(updated);
    localStorage.setItem('voltcom_projects', JSON.stringify(updated));
    closeModal();
  };

  const handleAddCategory = () => {
    const cleanName = newCategoryName.trim().toUpperCase();
    if (!cleanName || categories.includes(cleanName)) return showNotify('Nom invalide ou existant', 'error');
    const updated = [...categories, cleanName];
    setCategories(updated);
    localStorage.setItem('voltcom_categories', JSON.stringify(updated));
    setNewCategoryName('');
    showNotify('Catégorie ajoutée');
  };

  const handleRemoveCategory = (cat: string) => {
    if (cat === 'TOUS') return showNotify('Action interdite', 'error');
    if (projects.some(p => p.category === cat)) return showNotify('Utilisée par des projets', 'error');
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('voltcom_categories', JSON.stringify(updated));
    showNotify('Catégorie supprimée');
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: '', neighbourhood: '', category: categories.find(c => c !== 'TOUS') || categories[0], imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({ title: p.title, neighbourhood: p.neighbourhood, category: p.category, imageUrl: p.imageUrl || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingProject(null); };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== id);
        localStorage.setItem('voltcom_projects', JSON.stringify(updated));
        return updated;
      });
      showNotify('Projet supprimé avec succès');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-voltcomLightGray px-4">
        <div className="max-w-xs w-full bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-voltcomCharcoal rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-voltcomRed">
              <Lock className="text-voltcomRed" size={24} />
            </div>
            <h1 className="text-xl font-black text-voltcomCharcoal uppercase">Admin Portal</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Code" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full p-4 border-2 border-gray-200 rounded-xl text-center bg-voltcomLightGray text-xs font-bold text-voltcomCharcoal" autoFocus />
            <button type="submit" className="w-full bg-voltcomCharcoal text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest active:scale-95 transition-transform">Connecter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-voltcomLightGray flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-56 bg-voltcomCharcoal text-white hidden md:flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-voltcomRed font-black uppercase tracking-tighter text-xl">VOLTCOM</h2>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mt-1">Admin</span>
        </div>
        <nav className="flex-grow p-3 space-y-1">
          <button onClick={() => setActiveView('projects')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold text-xs transition-all ${activeView === 'projects' ? 'bg-voltcomRed text-white' : 'text-gray-400 hover:text-white'}`}>
            <FolderKanban size={16} /> Projets
          </button>
          <button onClick={() => setActiveView('categories')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold text-xs transition-all ${activeView === 'categories' ? 'bg-voltcomRed text-white' : 'text-gray-400 hover:text-white'}`}>
            <LayoutDashboard size={16} /> Catégories
          </button>
          <button onClick={() => setActiveView('info')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold text-xs transition-all ${activeView === 'info' ? 'bg-voltcomRed text-white' : 'text-gray-400 hover:text-white'}`}>
            <Settings size={16} /> Infos Contact
          </button>
          <button onClick={() => setActiveView('messages')} className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold text-xs transition-all ${activeView === 'messages' ? 'bg-voltcomRed text-white' : 'text-gray-400 hover:text-white'}`}>
            <Bell size={16} /> Urgences / Banner
          </button>
        </nav>
        <button onClick={handleLogout} className="m-3 p-3 text-gray-400 hover:text-voltcomRed font-bold text-xs flex items-center gap-2 border-t border-white/5">
          <LogOut size={16} /> Quitter
        </button>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-voltcomCharcoal text-white z-50 flex border-t border-white/10 shadow-2xl overflow-x-auto no-scrollbar">
        {[
          {id: 'projects', icon: <FolderKanban size={18}/>, label: 'Projets'},
          {id: 'categories', icon: <LayoutDashboard size={18}/>, label: 'Cats'},
          {id: 'info', icon: <Settings size={18}/>, label: 'Infos'},
          {id: 'messages', icon: <Bell size={18}/>, label: 'Banner'}
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex-1 min-w-[25%] flex flex-col items-center py-2 transition-colors ${activeView === tab.id ? 'text-voltcomRed' : 'text-gray-400'}`}>
            {tab.icon}
            <span className="text-[7px] font-black uppercase mt-1">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-grow p-2 md:p-8 pb-16 md:pb-8 w-full max-w-6xl mx-auto">
        {notification && (
          <div className="fixed top-16 md:top-6 right-2 left-2 md:left-auto md:right-6 z-[210] px-3 py-2 rounded-lg shadow-xl flex items-center justify-between gap-3 border-l-4 animate-in slide-in-from-top-4 bg-voltcomCharcoal text-white border-voltcomRed">
            <span className="font-bold text-[9px] uppercase tracking-wide">{notification.message}</span>
            <button onClick={() => setNotification(null)}><X size={12} /></button>
          </div>
        )}

        <header className="flex justify-between items-end mb-4 md:mb-10 p-2 text-voltcomCharcoal">
          <div>
            <h1 className="text-xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              {activeView === 'projects' && 'Portfolio'}
              {activeView === 'categories' && 'Catégories'}
              {activeView === 'info' && 'Contact'}
              {activeView === 'messages' && 'Urgence'}
            </h1>
            <p className="text-voltcomCharcoal font-black uppercase text-[7px] tracking-widest mt-1 opacity-60">PANNEAU ADMIN</p>
          </div>
          {activeView === 'projects' && (
            <button onClick={openAddModal} className="hidden md:flex bg-voltcomRed text-white px-4 py-2 rounded-md font-black items-center gap-2 hover:bg-voltcomCharcoal transition-all text-[9px] tracking-widest active:scale-95 uppercase">
              <Plus size={12} /> Nouveau
            </button>
          )}
        </header>

        {/* PROJECTS VIEW */}
        {activeView === 'projects' && (
          <div className="animate-in fade-in space-y-2">
            <div className="md:hidden space-y-1.5 px-1">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 flex items-center gap-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-voltcomLightGray">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Zap size={18} /></div>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-voltcomCharcoal text-[10px] truncate uppercase leading-tight">{p.title}</h3>
                    <p className="text-[7px] text-voltcomCharcoal font-bold uppercase truncate">{p.neighbourhood} • {p.category}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditModal(p)} className="p-1.5 bg-gray-50 text-voltcomCharcoal rounded-md"><Edit2 size={10}/></button>
                    <button 
                      onClick={() => handleDeleteProject(p.id)} 
                      className="p-1.5 bg-red-50 text-voltcomRed rounded-md active:scale-90 transition-transform"
                    >
                      <Trash2 size={10} className="pointer-events-none" />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={openAddModal} className="fixed bottom-14 right-4 bg-voltcomRed text-white w-10 h-10 rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 md:hidden"><Plus size={20} /></button>
            </div>
            <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-voltcomCharcoal text-[9px] uppercase tracking-widest font-black border-b"><th className="p-4">Projet</th><th className="p-4">Service</th><th className="p-4">Visuel</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-red-50/10 transition-colors group">
                      <td className="p-4 font-black text-voltcomCharcoal text-sm">{p.title}<br/><span className="text-[9px] text-voltcomCharcoal uppercase opacity-60">{p.neighbourhood}</span></td>
                      <td className="p-4"><span className="bg-voltcomCharcoal text-white text-[8px] font-black px-2 py-1 rounded uppercase">{p.category}</span></td>
                      <td className="p-4">{p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border" /> : <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-200"><Zap size={16} /></div>}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(p)} className="p-2 text-voltcomCharcoal hover:bg-white rounded-lg border border-transparent hover:border-gray-100"><Edit2 size={16} /></button>
                          <button 
                            onClick={() => handleDeleteProject(p.id)} 
                            className="p-2 text-voltcomRed hover:bg-white rounded-lg border border-transparent hover:border-voltcomRed/10 transition-all active:scale-90"
                            title="Supprimer"
                          >
                            <Trash2 size={16} className="pointer-events-none" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {activeView === 'categories' && (
          <div className="animate-in fade-in space-y-3 px-2">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest mb-3 text-voltcomCharcoal">Gérer les Catégories</h3>
              <div className="flex gap-2">
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-grow p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase text-voltcomCharcoal focus:outline-none border border-gray-200" placeholder="EX: RÉSIDENTIEL" />
                <button onClick={handleAddCategory} className="bg-voltcomRed text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase">Ajouter</button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                   <h4 className="text-[10px] font-black uppercase text-voltcomCharcoal">Filtre sur le site</h4>
                   <p className="text-[8px] text-voltcomCharcoal opacity-60 uppercase font-bold">Afficher la barre de filtrage sur la page Projets</p>
                </div>
                <button 
                  onClick={() => saveSettings({...settings, showCategories: !settings.showCategories})} 
                  className={`w-12 h-6 rounded-full relative transition-colors ${settings.showCategories ? 'bg-voltcomRed' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showCategories ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <div key={cat} className="bg-white p-3 rounded-xl shadow-md border border-gray-50 flex flex-col items-center text-center relative group">
                  {cat !== 'TOUS' && <button onClick={() => handleRemoveCategory(cat)} className="absolute top-1.5 right-1.5 text-gray-300 hover:text-voltcomRed transition-colors"><Trash2 size={12} /></button>}
                  <div className="w-8 h-8 bg-voltcomLightGray rounded-lg flex items-center justify-center mb-2 text-voltcomRed"><Zap size={16} /></div>
                  <h3 className="text-[9px] font-black text-voltcomCharcoal uppercase tracking-tighter truncate w-full px-1">{cat}</h3>
                  <p className="text-[7px] text-voltcomCharcoal opacity-60 font-bold uppercase mt-0.5">{projects.filter(p => p.category === cat).length} Projets</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INFO VIEW */}
        {activeView === 'info' && (
          <div className="animate-in fade-in space-y-4 px-2">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Phone size={10}/> Téléphone</label>
                  <input type="text" value={settings.phone} onChange={(e) => saveSettings({...settings, phone: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Mail size={10}/> Courriel</label>
                  <input type="text" value={settings.email} onChange={(e) => saveSettings({...settings, email: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><MapPin size={10}/> Adresse</label>
                  <input type="text" value={settings.address} onChange={(e) => saveSettings({...settings, address: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Clock size={10}/> Heures</label>
                  <input type="text" value={settings.hours} onChange={(e) => saveSettings({...settings, hours: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><ShieldCheck size={10}/> Licences / RBQ</label>
                <input type="text" value={settings.license} onChange={(e) => saveSettings({...settings, license: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
              </div>
              <button onClick={() => showNotify('Coordonnées enregistrées')} className="w-full bg-voltcomCharcoal text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">Enregistrer les infos</button>
            </div>
          </div>
        )}

        {/* MESSAGES VIEW */}
        {activeView === 'messages' && (
          <div className="animate-in fade-in space-y-6 px-2">
            {/* Promo Banner Control */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-voltcomCharcoal"><Bell className="text-voltcomRed" size={14}/> Message Promotionnel</h3>
              <div className="flex items-center justify-between mb-4 bg-voltcomLightGray p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] font-bold uppercase text-voltcomCharcoal">Afficher un message spécial?</span>
                <button onClick={() => saveSettings({...settings, promoActive: !settings.promoActive})} className={`w-12 h-6 rounded-full relative transition-colors ${settings.promoActive ? 'bg-voltcomRed' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.promoActive ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              {settings.promoActive && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-voltcomCharcoal ml-1">Écrivez votre message ici</label>
                    <textarea value={settings.promoText} onChange={(e) => saveSettings({...settings, promoText: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold h-20 text-voltcomCharcoal border border-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-voltcomCharcoal ml-1">Ce message disparaît automatiquement le:</label>
                    <input type="date" value={settings.promoExpiry} onChange={(e) => saveSettings({...settings, promoExpiry: e.target.value})} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold uppercase text-voltcomCharcoal border border-gray-200" />
                  </div>
                  
                  {/* Live Preview */}
                  <div className="p-3 border-2 border-dashed border-gray-100 rounded-xl space-y-2 bg-voltcomLightGray">
                    <p className="text-[7px] font-black text-voltcomCharcoal opacity-50 uppercase">Aperçu du bandeau :</p>
                    <div className="bg-white text-voltcomCharcoal p-2 rounded text-center text-[9px] font-black border border-voltcomRed/20 shadow-sm">
                      {settings.promoText || 'Message...'}
                    </div>
                  </div>
                  <button onClick={() => showNotify('Message publié avec succès')} className="w-full bg-voltcomCharcoal text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">✅ Publier mon message</button>
                </div>
              )}
            </div>

            {/* Emergency Mode Control */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-voltcomCharcoal"><Zap className="text-voltcomRed" size={14}/> Mode Urgence</h3>
              <p className="text-[10px] text-voltcomCharcoal opacity-70 mb-6 font-medium leading-relaxed">Êtes-vous disponible pour des urgences ce soir ou cette fin de semaine?</p>
              <button 
                onClick={() => {
                  const newState = !settings.emergencyActive;
                  saveSettings({...settings, emergencyActive: newState});
                  showNotify(newState ? 'Service d\'urgence ACTIVÉ' : 'Service d\'urgence DÉSACTIVÉ', newState ? 'success' : 'error');
                }} 
                className={`w-full py-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${settings.emergencyActive ? 'bg-green-600 text-white' : 'bg-voltcomRed text-white hover:bg-voltcomCharcoal'}`}
              >
                {settings.emergencyActive ? <><CheckCircle size={20}/> ✅ Urgences activées — Cliquez pour désactiver</> : <><AlertTriangle size={20}/> 🚨 Activer le service d'urgence</>}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-voltcomCharcoal/90 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 border-t-4 border-voltcomRed">
            <div className="bg-voltcomCharcoal p-3 flex justify-between items-center text-white"><h3 className="text-xs font-black uppercase">Fiche Projet</h3><button onClick={closeModal}><X size={18} /></button></div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-voltcomCharcoal">
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Titre</label><input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase focus:outline-none border border-gray-200" /></div>
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Quartier</label><input required type="text" value={formData.neighbourhood} onChange={(e) => setFormData({...formData, neighbourhood: e.target.value})} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase focus:outline-none border border-gray-200" /></div>
              </div>
              <div className="space-y-1 text-voltcomCharcoal"><label className="text-[7px] font-black uppercase">Catégorie</label><select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase appearance-none border border-gray-200"><option value="">Sélectionner</option>{categories.filter(c => c !== 'TOUS').map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Photo</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-3 h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-voltcomLightGray relative overflow-hidden">
                  {formData.imageUrl ? <><img src={formData.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-voltcomCharcoal/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[8px] font-black">Changer</div></> : <><ImageIcon className="text-gray-300 mb-1" size={24} /><span className="text-[7px] font-black uppercase text-voltcomCharcoal opacity-50">Téléverser</span></>}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow bg-voltcomRed text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest active:scale-95">Valider</button>
                <button type="button" onClick={closeModal} className="px-5 text-voltcomCharcoal font-black text-[8px] uppercase tracking-widest">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default Admin;
