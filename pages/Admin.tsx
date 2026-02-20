import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, Plus, Trash2, Lock, Edit2, X,
  Image as ImageIcon, LogOut, CheckCircle,
  LayoutDashboard, FolderKanban, Settings, Bell,
  Phone, Mail, Clock, ShieldCheck, MapPin, AlertTriangle,
  Star, MessageSquare, Eye, EyeOff, Inbox, GripVertical
} from 'lucide-react';
import { Project, SiteSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';
import { supabase } from '../lib/supabase';

// Admin uses service role client for write operations
import { createClient } from '@supabase/supabase-js';
const adminSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY as string
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  author: string;
  neighbourhood: string;
  rating: number;
  quote: string;
  is_visible: boolean;
  created_at: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_visible: boolean;
}

interface Submission {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

// ─── Admin Component ──────────────────────────────────────────────────────────
const Admin: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<'projects' | 'categories' | 'info' | 'messages' | 'reviews' | 'services' | 'submissions'>('projects');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [projectForm, setProjectForm] = useState({ title: '', neighbourhood: '', category: '', imageUrl: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ author: '', neighbourhood: '', rating: 5, quote: '' });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [serviceForm, setServiceForm] = useState({ id: '', title: '', description: '', icon_name: 'Zap', display_order: 0 });
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const session = sessionStorage.getItem('voltcom_admin_session');
    if (session === 'active') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAll();
    }
  }, [isLoggedIn]);

  const fetchAll = async () => {
    await Promise.all([
      fetchProjects(),
      fetchCategories(),
      fetchSettings(),
      fetchReviews(),
      fetchServices(),
      fetchSubmissions(),
    ]);
  };

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminPassword === correctPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem('voltcom_admin_session', 'active');
      showNotify('Session active');
    } else {
      showNotify('Code invalide', 'error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('voltcom_admin_session');
  };

  // ─── Projects ────────────────────────────────────────────────────────────────
  const fetchProjects = async () => {
    const { data } = await adminSupabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data.map((p: any) => ({ id: p.id, title: p.title, neighbourhood: p.neighbourhood, category: p.category, imageUrl: p.image_url ?? '', isPlaceholder: p.is_placeholder })));
  };

  const fetchCategories = async () => {
    const { data } = await adminSupabase.from('categories').select('name').order('created_at');
    if (data) setCategories(data.map((c: any) => c.name));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProjectForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      await adminSupabase.from('projects').update({
        title: projectForm.title,
        neighbourhood: projectForm.neighbourhood,
        category: projectForm.category,
        image_url: projectForm.imageUrl || null,
        is_placeholder: !projectForm.imageUrl,
      }).eq('id', editingProject.id);
      showNotify('Mise à jour OK');
    } else {
      await adminSupabase.from('projects').insert([{
        title: projectForm.title,
        neighbourhood: projectForm.neighbourhood,
        category: projectForm.category,
        image_url: projectForm.imageUrl || null,
        is_placeholder: !projectForm.imageUrl,
      }]);
      showNotify('Projet publié');
    }
    await fetchProjects();
    closeProjectModal();
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet ?')) return;
    await adminSupabase.from('projects').delete().eq('id', id);
    showNotify('Projet supprimé');
    await fetchProjects();
  };

  const openAddModal = () => {
    setEditingProject(null);
    setProjectForm({ title: '', neighbourhood: '', category: categories.find((c) => c !== 'TOUS') || '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ title: p.title, neighbourhood: p.neighbourhood, category: p.category, imageUrl: p.imageUrl || '' });
    setIsModalOpen(true);
  };

  const closeProjectModal = () => { setIsModalOpen(false); setEditingProject(null); };

  const handleAddCategory = async () => {
    const cleanName = newCategoryName.trim().toUpperCase();
    if (!cleanName) return showNotify('Nom invalide', 'error');
    const { error } = await adminSupabase.from('categories').insert([{ name: cleanName }]);
    if (error) return showNotify('Nom existant ou invalide', 'error');
    await fetchCategories();
    setNewCategoryName('');
    showNotify('Catégorie ajoutée');
  };

  const handleRemoveCategory = async (name: string) => {
    if (name === 'TOUS') return showNotify('Action interdite', 'error');
    const inUse = projects.some((p) => p.category === name);
    if (inUse) return showNotify('Utilisée par des projets', 'error');
    await adminSupabase.from('categories').delete().eq('name', name);
    await fetchCategories();
    showNotify('Catégorie supprimée');
  };

  // ─── Settings ────────────────────────────────────────────────────────────────
  const fetchSettings = async () => {
    const { data } = await adminSupabase.from('settings').select('*').eq('id', 1).single();
    if (data) {
      setSettings({
        phone: data.phone, email: data.email, address: data.address,
        hours: data.hours, license: data.license,
        promoActive: data.promo_active, promoText: data.promo_text,
        promoExpiry: data.promo_expiry ?? '', emergencyActive: data.emergency_active,
        showCategories: data.show_categories,
      });
    }
  };

  const saveSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await adminSupabase.from('settings').update({
      phone: newSettings.phone,
      email: newSettings.email,
      address: newSettings.address,
      hours: newSettings.hours,
      license: newSettings.license,
      promo_active: newSettings.promoActive,
      promo_text: newSettings.promoText,
      promo_expiry: newSettings.promoExpiry || null,
      emergency_active: newSettings.emergencyActive,
      show_categories: newSettings.showCategories,
    }).eq('id', 1);
  };

  // ─── Reviews ─────────────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    const { data } = await adminSupabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminSupabase.from('reviews').insert([{ ...reviewForm }]);
    showNotify('Avis ajouté');
    setReviewForm({ author: '', neighbourhood: '', rating: 5, quote: '' });
    setIsReviewModalOpen(false);
    await fetchReviews();
  };

  const toggleReviewVisibility = async (id: string, current: boolean) => {
    await adminSupabase.from('reviews').update({ is_visible: !current }).eq('id', id);
    await fetchReviews();
    showNotify(!current ? 'Avis affiché' : 'Avis masqué');
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Supprimer cet avis?')) return;
    await adminSupabase.from('reviews').delete().eq('id', id);
    await fetchReviews();
    showNotify('Avis supprimé');
  };

  // ─── Services ────────────────────────────────────────────────────────────────
  const fetchServices = async () => {
    const { data } = await adminSupabase.from('services').select('*').order('display_order');
    if (data) setServices(data);
  };

  const openServiceModal = (s?: Service) => {
    if (s) {
      setEditingService(s);
      setServiceForm({ id: s.id, title: s.title, description: s.description, icon_name: s.icon_name, display_order: s.display_order });
    } else {
      setEditingService(null);
      setServiceForm({ id: '', title: '', description: '', icon_name: 'Zap', display_order: services.length + 1 });
    }
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await adminSupabase.from('services').update({
        title: serviceForm.title,
        description: serviceForm.description,
        icon_name: serviceForm.icon_name,
        display_order: serviceForm.display_order,
      }).eq('id', editingService.id);
      showNotify('Service mis à jour');
    } else {
      await adminSupabase.from('services').insert([{
        id: serviceForm.id || serviceForm.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20),
        title: serviceForm.title,
        description: serviceForm.description,
        icon_name: serviceForm.icon_name,
        display_order: serviceForm.display_order,
      }]);
      showNotify('Service ajouté');
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
    await fetchServices();
  };

  const toggleServiceVisibility = async (id: string, current: boolean) => {
    await adminSupabase.from('services').update({ is_visible: !current }).eq('id', id);
    await fetchServices();
    showNotify(!current ? 'Service affiché' : 'Service masqué');
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Supprimer ce service?')) return;
    await adminSupabase.from('services').delete().eq('id', id);
    await fetchServices();
    showNotify('Service supprimé');
  };

  // ─── Submissions ─────────────────────────────────────────────────────────────
  const fetchSubmissions = async () => {
    const { data } = await adminSupabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (data) {
      setSubmissions(data);
      setUnreadCount(data.filter((s: Submission) => !s.is_read).length);
    }
  };

  const markAsRead = async (id: string) => {
    await adminSupabase.from('contact_submissions').update({ is_read: true }).eq('id', id);
    await fetchSubmissions();
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Supprimer cette demande?')) return;
    await adminSupabase.from('contact_submissions').delete().eq('id', id);
    await fetchSubmissions();
    showNotify('Demande supprimée');
  };

  // ─── Login Screen ─────────────────────────────────────────────────────────────
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
            <input
              type="password"
              placeholder="Code"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-center bg-voltcomLightGray text-xs font-bold text-voltcomCharcoal"
              autoFocus
            />
            <button type="submit" className="w-full bg-voltcomCharcoal text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest">
              Connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Main Admin ───────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'projects', icon: <FolderKanban size={16} />, label: 'Projets' },
    { id: 'categories', icon: <LayoutDashboard size={16} />, label: 'Catégories' },
    { id: 'reviews', icon: <Star size={16} />, label: 'Avis' },
    { id: 'services', icon: <Zap size={16} />, label: 'Services' },
    { id: 'submissions', icon: <Inbox size={16} />, label: `Demandes${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { id: 'info', icon: <Settings size={16} />, label: 'Infos' },
    { id: 'messages', icon: <Bell size={16} />, label: 'Bannière' },
  ];

  return (
    <div className="min-h-screen bg-voltcomLightGray flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-56 bg-voltcomCharcoal text-white hidden md:flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-voltcomRed font-black uppercase tracking-tighter text-xl">VOLTCOM</h2>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mt-1">Admin</span>
        </div>
        <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-bold text-xs transition-all ${activeView === item.id ? 'bg-voltcomRed text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-3 p-3 text-gray-400 hover:text-voltcomRed font-bold text-xs flex items-center gap-2 border-t border-white/5">
          <LogOut size={16} /> Quitter
        </button>
      </aside>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-voltcomCharcoal text-white z-50 flex border-t border-white/10 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`flex-1 min-w-[14%] flex flex-col items-center py-2 transition-colors ${activeView === item.id ? 'text-voltcomRed' : 'text-gray-400'}`}
          >
            {item.icon}
            <span className="text-[6px] font-black uppercase mt-1 truncate w-full text-center px-0.5">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      <main className="flex-grow p-2 md:p-8 pb-20 md:pb-8 w-full max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-16 md:top-6 right-2 left-2 md:left-auto md:right-6 z-[210] px-3 py-2 rounded-lg shadow-xl flex items-center justify-between gap-3 border-l-4 animate-in slide-in-from-top-4 bg-voltcomCharcoal text-white border-voltcomRed">
            <span className="font-bold text-[9px] uppercase tracking-wide">{notification.message}</span>
            <button onClick={() => setNotification(null)}><X size={12} /></button>
          </div>
        )}

        <header className="flex justify-between items-end mb-6 p-2 text-voltcomCharcoal">
          <div>
            <h1 className="text-xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              {navItems.find((n) => n.id === activeView)?.label ?? activeView}
            </h1>
            <p className="text-voltcomCharcoal font-black uppercase text-[7px] tracking-widest mt-1 opacity-60">PANNEAU ADMIN</p>
          </div>
          {activeView === 'projects' && (
            <button onClick={openAddModal} className="hidden md:flex bg-voltcomRed text-white px-4 py-2 rounded-md font-black items-center gap-2 hover:bg-voltcomCharcoal transition-all text-[9px] tracking-widest uppercase">
              <Plus size={12} /> Nouveau
            </button>
          )}
          {activeView === 'reviews' && (
            <button onClick={() => setIsReviewModalOpen(true)} className="hidden md:flex bg-voltcomRed text-white px-4 py-2 rounded-md font-black items-center gap-2 hover:bg-voltcomCharcoal transition-all text-[9px] tracking-widest uppercase">
              <Plus size={12} /> Ajouter
            </button>
          )}
          {activeView === 'services' && (
            <button onClick={() => openServiceModal()} className="hidden md:flex bg-voltcomRed text-white px-4 py-2 rounded-md font-black items-center gap-2 hover:bg-voltcomCharcoal transition-all text-[9px] tracking-widest uppercase">
              <Plus size={12} /> Ajouter
            </button>
          )}
        </header>

        {/* ── PROJECTS ── */}
        {activeView === 'projects' && (
          <div className="animate-in fade-in space-y-2">
            <div className="md:hidden space-y-1.5 px-1">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 flex items-center gap-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-voltcomLightGray">
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Zap size={18} /></div>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-voltcomCharcoal text-[10px] truncate uppercase">{p.title}</h3>
                    <p className="text-[7px] text-voltcomCharcoal font-bold uppercase truncate">{p.neighbourhood} • {p.category}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditModal(p)} className="p-1.5 bg-gray-50 rounded-md"><Edit2 size={10} /></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 bg-red-50 text-voltcomRed rounded-md"><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
              <button onClick={openAddModal} className="fixed bottom-14 right-4 bg-voltcomRed text-white w-10 h-10 rounded-full shadow-2xl flex items-center justify-center z-[60]"><Plus size={20} /></button>
            </div>
            <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 text-voltcomCharcoal text-[9px] uppercase tracking-widest font-black border-b"><th className="p-4">Projet</th><th className="p-4">Service</th><th className="p-4">Visuel</th><th className="p-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-red-50/10">
                      <td className="p-4 font-black text-voltcomCharcoal text-sm">{p.title}<br /><span className="text-[9px] opacity-60 uppercase">{p.neighbourhood}</span></td>
                      <td className="p-4"><span className="bg-voltcomCharcoal text-white text-[8px] font-black px-2 py-1 rounded uppercase">{p.category}</span></td>
                      <td className="p-4">{p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg border" /> : <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-200"><Zap size={16} /></div>}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(p)} className="p-2 text-voltcomCharcoal hover:bg-gray-50 rounded-lg"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-voltcomRed hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {activeView === 'categories' && (
          <div className="animate-in fade-in space-y-3 px-2">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[9px] font-black uppercase tracking-widest mb-3 text-voltcomCharcoal">Ajouter une catégorie</h3>
              <div className="flex gap-2">
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-grow p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase text-voltcomCharcoal border border-gray-200" placeholder="EX: RÉSIDENTIEL" />
                <button onClick={handleAddCategory} className="bg-voltcomRed text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase">Ajouter</button>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-voltcomCharcoal">Filtre sur le site</h4>
                  <p className="text-[8px] text-voltcomCharcoal opacity-60 uppercase font-bold">Afficher la barre de filtrage</p>
                </div>
                <button onClick={() => saveSettings({ ...settings, showCategories: !settings.showCategories })} className={`w-12 h-6 rounded-full relative transition-colors ${settings.showCategories ? 'bg-voltcomRed' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.showCategories ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <div key={cat} className="bg-white p-3 rounded-xl shadow-md border border-gray-50 flex flex-col items-center text-center relative group">
                  {cat !== 'TOUS' && <button onClick={() => handleRemoveCategory(cat)} className="absolute top-1.5 right-1.5 text-gray-300 hover:text-voltcomRed"><Trash2 size={12} /></button>}
                  <div className="w-8 h-8 bg-voltcomLightGray rounded-lg flex items-center justify-center mb-2 text-voltcomRed"><Zap size={16} /></div>
                  <h3 className="text-[9px] font-black text-voltcomCharcoal uppercase truncate w-full px-1">{cat}</h3>
                  <p className="text-[7px] text-voltcomCharcoal opacity-60 font-bold uppercase mt-0.5">{projects.filter((p) => p.category === cat).length} Projets</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {activeView === 'reviews' && (
          <div className="animate-in fade-in space-y-3 px-2">
            <button onClick={() => setIsReviewModalOpen(true)} className="md:hidden fixed bottom-14 right-4 bg-voltcomRed text-white w-10 h-10 rounded-full shadow-2xl flex items-center justify-center z-[60]"><Plus size={20} /></button>
            <div className="space-y-2">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 items-start">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-voltcomCharcoal text-xs uppercase">{r.author}</span>
                      <span className="text-[8px] text-gray-400 uppercase font-bold">{r.neighbourhood}</span>
                      <div className="flex ml-auto">{[...Array(r.rating)].map((_, i) => <Star key={i} size={10} className="text-voltcomRed fill-current" />)}</div>
                    </div>
                    <p className="text-[10px] text-gray-500 italic leading-relaxed">"{r.quote}"</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => toggleReviewVisibility(r.id, r.is_visible)} className={`p-1.5 rounded-md ${r.is_visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`} title={r.is_visible ? 'Masquer' : 'Afficher'}>
                      {r.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button onClick={() => handleDeleteReview(r.id)} className="p-1.5 bg-red-50 text-voltcomRed rounded-md"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-center text-[10px] uppercase font-black text-gray-300 py-10">Aucun avis</p>}
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {activeView === 'services' && (
          <div className="animate-in fade-in space-y-2 px-2">
            <button onClick={() => openServiceModal()} className="md:hidden fixed bottom-14 right-4 bg-voltcomRed text-white w-10 h-10 rounded-full shadow-2xl flex items-center justify-center z-[60]"><Plus size={20} /></button>
            {services.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 items-start">
                <div className="flex-grow min-w-0">
                  <h3 className="font-black text-voltcomCharcoal text-xs uppercase mb-1">{s.title}</h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">{s.description}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => toggleServiceVisibility(s.id, s.is_visible)} className={`p-1.5 rounded-md ${s.is_visible ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {s.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => openServiceModal(s)} className="p-1.5 bg-gray-50 rounded-md"><Edit2 size={12} /></button>
                  <button onClick={() => handleDeleteService(s.id)} className="p-1.5 bg-red-50 text-voltcomRed rounded-md"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SUBMISSIONS ── */}
        {activeView === 'submissions' && (
          <div className="animate-in fade-in space-y-2 px-2">
            {submissions.length === 0 && <p className="text-center text-[10px] uppercase font-black text-gray-300 py-10">Aucune demande</p>}
            {submissions.map((s) => (
              <div key={s.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${s.is_read ? 'border-gray-200' : 'border-voltcomRed'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-black text-voltcomCharcoal text-xs uppercase">{s.name}</span>
                    {!s.is_read && <span className="ml-2 bg-voltcomRed text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Nouveau</span>}
                    <p className="text-[8px] text-gray-400 mt-0.5">{new Date(s.created_at).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex gap-1">
                    {!s.is_read && (
                      <button onClick={() => markAsRead(s.id)} className="p-1.5 bg-green-50 text-green-600 rounded-md" title="Marquer comme lu"><CheckCircle size={12} /></button>
                    )}
                    <button onClick={() => handleDeleteSubmission(s.id)} className="p-1.5 bg-red-50 text-voltcomRed rounded-md"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[9px] font-bold text-voltcomCharcoal uppercase mb-2">
                  <span className="flex items-center gap-1"><Phone size={8} className="text-voltcomRed" /><a href={`tel:${s.phone}`} className="hover:text-voltcomRed">{s.phone}</a></span>
                  <span className="flex items-center gap-1"><Mail size={8} className="text-voltcomRed" /><a href={`mailto:${s.email}`} className="hover:text-voltcomRed truncate">{s.email}</a></span>
                  <span className="flex items-center gap-1 col-span-2 md:col-span-1"><Zap size={8} className="text-voltcomRed shrink-0" />{s.service}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed bg-voltcomLightGray p-2 rounded-lg">{s.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── INFO ── */}
        {activeView === 'info' && (
          <div className="animate-in fade-in space-y-4 px-2">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Phone size={10} /> Téléphone</label>
                  <input type="text" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Mail size={10} /> Courriel</label>
                  <input type="text" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><MapPin size={10} /> Adresse</label>
                  <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><Clock size={10} /> Heures</label>
                  <input type="text" value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-voltcomCharcoal flex items-center gap-2"><ShieldCheck size={10} /> Licences / RBQ</label>
                <input type="text" value={settings.license} onChange={(e) => setSettings({ ...settings, license: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold text-voltcomCharcoal border border-gray-200" />
              </div>
              <button onClick={() => { saveSettings(settings); showNotify('Coordonnées enregistrées'); }} className="w-full bg-voltcomCharcoal text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest">
                Enregistrer les infos
              </button>
            </div>
          </div>
        )}

        {/* ── MESSAGES/BANNER ── */}
        {activeView === 'messages' && (
          <div className="animate-in fade-in space-y-6 px-2">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-voltcomCharcoal"><Bell className="text-voltcomRed" size={14} /> Message Promotionnel</h3>
              <div className="flex items-center justify-between mb-4 bg-voltcomLightGray p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] font-bold uppercase text-voltcomCharcoal">Afficher un message spécial?</span>
                <button onClick={() => saveSettings({ ...settings, promoActive: !settings.promoActive })} className={`w-12 h-6 rounded-full relative transition-colors ${settings.promoActive ? 'bg-voltcomRed' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.promoActive ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
              {settings.promoActive && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-voltcomCharcoal ml-1">Message</label>
                    <textarea value={settings.promoText} onChange={(e) => setSettings({ ...settings, promoText: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold h-20 text-voltcomCharcoal border border-gray-200" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-voltcomCharcoal ml-1">Expiration</label>
                    <input type="date" value={settings.promoExpiry} onChange={(e) => setSettings({ ...settings, promoExpiry: e.target.value })} className="w-full p-3 bg-voltcomLightGray rounded-xl text-[10px] font-bold uppercase text-voltcomCharcoal border border-gray-200" />
                  </div>
                  <button onClick={() => { saveSettings(settings); showNotify('Message publié'); }} className="w-full bg-voltcomCharcoal text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest">
                    ✅ Publier
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-voltcomCharcoal"><Zap className="text-voltcomRed" size={14} /> Mode Urgence</h3>
              <button
                onClick={() => {
                  const newState = !settings.emergencyActive;
                  saveSettings({ ...settings, emergencyActive: newState });
                  showNotify(newState ? "Service d'urgence ACTIVÉ" : "Service d'urgence DÉSACTIVÉ", newState ? 'success' : 'error');
                }}
                className={`w-full py-6 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${settings.emergencyActive ? 'bg-green-600 text-white' : 'bg-voltcomRed text-white hover:bg-voltcomCharcoal'}`}
              >
                {settings.emergencyActive ? <><CheckCircle size={20} /> ✅ Urgences activées — Cliquez pour désactiver</> : <><AlertTriangle size={20} /> 🚨 Activer le service d'urgence</>}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: Add/Edit Project ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-voltcomCharcoal/90 backdrop-blur-sm" onClick={closeProjectModal}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 border-t-4 border-voltcomRed">
            <div className="bg-voltcomCharcoal p-3 flex justify-between items-center text-white">
              <h3 className="text-xs font-black uppercase">Fiche Projet</h3>
              <button onClick={closeProjectModal}><X size={18} /></button>
            </div>
            <form onSubmit={handleProjectSubmit} className="p-4 space-y-3 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-voltcomCharcoal">
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Titre</label><input required type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase border border-gray-200" /></div>
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Quartier</label><input required type="text" value={projectForm.neighbourhood} onChange={(e) => setProjectForm({ ...projectForm, neighbourhood: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase border border-gray-200" /></div>
              </div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Catégorie</label>
                <select required value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold uppercase appearance-none border border-gray-200">
                  <option value="">Sélectionner</option>
                  {categories.filter((c) => c !== 'TOUS').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Photo</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-3 h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-voltcomLightGray relative overflow-hidden">
                  {projectForm.imageUrl ? (
                    <><img src={projectForm.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-voltcomCharcoal/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[8px] font-black">Changer</div></>
                  ) : (
                    <><ImageIcon className="text-gray-300 mb-1" size={24} /><span className="text-[7px] font-black uppercase text-voltcomCharcoal opacity-50">Téléverser</span></>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow bg-voltcomRed text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest">Valider</button>
                <button type="button" onClick={closeProjectModal} className="px-5 text-voltcomCharcoal font-black text-[8px] uppercase">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Review ── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-voltcomCharcoal/90 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 border-t-4 border-voltcomRed">
            <div className="bg-voltcomCharcoal p-3 flex justify-between items-center text-white">
              <h3 className="text-xs font-black uppercase">Ajouter un Avis</h3>
              <button onClick={() => setIsReviewModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddReview} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-voltcomCharcoal">
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Nom</label><input required type="text" value={reviewForm.author} onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" /></div>
                <div className="space-y-1"><label className="text-[7px] font-black uppercase">Quartier</label><input required type="text" value={reviewForm.neighbourhood} onChange={(e) => setReviewForm({ ...reviewForm, neighbourhood: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" /></div>
              </div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Note</label>
                <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
                </select>
              </div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Avis</label>
                <textarea required rows={3} value={reviewForm.quote} onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow bg-voltcomRed text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest">Publier</button>
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="px-5 text-voltcomCharcoal font-black text-[8px] uppercase">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add/Edit Service ── */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2">
          <div className="absolute inset-0 bg-voltcomCharcoal/90 backdrop-blur-sm" onClick={() => setIsServiceModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 border-t-4 border-voltcomRed">
            <div className="bg-voltcomCharcoal p-3 flex justify-between items-center text-white">
              <h3 className="text-xs font-black uppercase">{editingService ? 'Modifier Service' : 'Ajouter Service'}</h3>
              <button onClick={() => setIsServiceModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleServiceSubmit} className="p-4 space-y-3 max-h-[85vh] overflow-y-auto">
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Titre</label>
                <input required type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" />
              </div>
              <div className="space-y-1 text-voltcomCharcoal">
                <label className="text-[7px] font-black uppercase">Description</label>
                <textarea required rows={4} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-voltcomCharcoal">
                <div className="space-y-1">
                  <label className="text-[7px] font-black uppercase">Icône (Lucide)</label>
                  <select value={serviceForm.icon_name} onChange={(e) => setServiceForm({ ...serviceForm, icon_name: e.target.value })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200">
                    {['Zap', 'ShieldCheck', 'Car', 'Hammer', 'PenTool', 'AlertTriangle', 'Wrench', 'Home', 'Star'].map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[7px] font-black uppercase">Ordre d'affichage</label>
                  <input type="number" value={serviceForm.display_order} onChange={(e) => setServiceForm({ ...serviceForm, display_order: Number(e.target.value) })} className="w-full p-2.5 bg-voltcomLightGray rounded-lg text-[10px] font-bold border border-gray-200" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow bg-voltcomRed text-white font-black py-3 rounded-lg text-[10px] uppercase tracking-widest">Valider</button>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-5 text-voltcomCharcoal font-black text-[8px] uppercase">Annuler</button>
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
