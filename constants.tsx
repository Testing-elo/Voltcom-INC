
import React from 'react';
import { Zap, Car, ShieldCheck, Hammer, PenTool, AlertTriangle } from 'lucide-react';
import { ProjectCategory, SiteSettings } from './types';

export const COMPANY_INFO = {
  name: "Voltcom Inc.",
  phone: "(514) 507-6847",
  email: "info@electricitevoltcom.com",
  address: "6882 24e Avenue, Montréal, QC H1T 3M9",
  license: "R.B.Q. 5618-6505 | Membre CMEQ",
  hours: "Lundi–Vendredi, 7h00–17h00",
  rating: "5.0 ⭐ / 298 avis Google"
};

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "(514) 507-6847",
  email: "info@electricitevoltcom.com",
  address: "6882 24e Avenue, Montréal, QC H1T 3M9",
  hours: "Lundi–Vendredi, 7h00–17h00",
  license: "R.B.Q. 5618-6505 | Membre CMEQ",
  promoActive: false,
  promoText: "Rabais 15% sur les bornes VE ce mois-ci!",
  promoExpiry: "",
  emergencyActive: false,
  showCategories: true
};

export const INITIAL_PROJECTS = [
  { id: '1', title: 'Modernisation Rosemont', neighbourhood: 'Rosemont', category: ProjectCategory.RESIDENTIAL, isPlaceholder: true },
  { id: '2', title: 'Entrée Électrique 200A', neighbourhood: 'Villeray', category: ProjectCategory.RESIDENTIAL, isPlaceholder: true },
  { id: '3', title: 'Borne Tesla Niv 2', neighbourhood: 'Plateau', category: ProjectCategory.EV_STATION, isPlaceholder: true },
  { id: '4', title: 'Rénovation Cuisine', neighbourhood: 'Ahuntsic', category: ProjectCategory.RENOVATION, isPlaceholder: true },
  { id: '5', title: 'Mise aux Normes RBQ', neighbourhood: 'Verdun', category: ProjectCategory.UPGRADE, isPlaceholder: true },
  { id: '6', title: 'Nouveau Éclairage LED', neighbourhood: 'Anjou', category: ProjectCategory.RENOVATION, isPlaceholder: true },
];

export const SERVICES_LIST = [
  {
    id: 'panel',
    icon: <Zap size={48} className="text-voltcomRed" />,
    title: "Remplacement de panneau électrique",
    description: "Modernisez votre système en passant des fusibles aux disjoncteurs. Nous installons des panneaux de 100A ou 200A pour une sécurité accrue et une fiabilité optimale de votre réseau électrique."
  },
  {
    id: 'upgrade',
    icon: <ShieldCheck size={48} className="text-voltcomRed" />,
    title: "Mise à niveau du service électrique",
    description: "Que ce soit pour un service aérien ou souterrain, nous effectuons la mise à niveau de votre capacité électrique à 100A, 200A ou même 400A pour répondre à vos nouveaux besoins énergétiques."
  },
  {
    id: 'minor',
    icon: <PenTool size={48} className="text-voltcomRed" />,
    title: "Rénovations mineures",
    description: "Besoin de nouvelles prises, d'installer un luminaire ou d'ajouter un circuit pour un nouvel appareil? Nos électriciens interviennent rapidement pour tous vos petits travaux et améliorations."
  },
  {
    id: 'major',
    icon: <Hammer size={48} className="text-voltcomRed" />,
    title: "Rénovations majeures",
    description: "Pour vos projets de construction ou de rénovation complète, nous gérons le recâblage total et la mise aux normes complète de votre résidence, assurant un travail propre et certifié."
  },
  {
    id: 'ev',
    icon: <Car size={48} className="text-voltcomRed" />,
    title: "Installation de borne de recharge VE",
    description: "Experts en mobilité électrique, nous installons votre borne de recharge de niveau 2 (240V) à domicile. Installation sécuritaire, efficace et compatible avec tous les modèles de véhicules."
  },
  {
    id: 'emergency',
    icon: <AlertTriangle size={48} className="text-voltcomRed" />,
    title: "Dépannage d'urgence",
    description: "Un problème électrique ne peut pas attendre. Nous offrons un service de diagnostic et de réparation rapide pour sécuriser votre domicile et rétablir votre courant dans les plus brefs délais."
  }
];

export const REVIEWS = [
  { id: 1, rating: 5, quote: "Travail rapide, propre et professionnel. Le technicien a bien expliqué chaque étape. Je recommande fortement!", author: "Marc A.", neighbourhood: "Rosemont" },
  { id: 2, rating: 5, quote: "Ponctuel, honnête et compétent. Prix juste et aucune mauvaise surprise sur la facture.", author: "Sophie L.", neighbourhood: "Villeray" },
  { id: 3, rating: 5, quote: "Installation de ma borne VE faite en une matinée. Impeccable du début à la fin.", author: "Kevin T.", neighbourhood: "Plateau-Mont-Royal" },
  { id: 4, rating: 5, quote: "Remplacement du panneau électrique effectué rapidement et dans les normes. Très satisfait.", author: "Jean-François B.", neighbourhood: "Mercier" },
  { id: 5, rating: 5, quote: "Équipe sérieuse et transparente. J'ai eu mon devis le jour même de mon appel.", author: "Isabelle R.", neighbourhood: "Saint-Léonard" },
  { id: 6, rating: 5, quote: "Excellent service d'urgence un dimanche soir. Problème réglé en moins d'une heure.", author: "David M.", neighbourhood: "Anjou" },
];
