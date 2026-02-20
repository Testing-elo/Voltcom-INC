
import React from 'react';

export enum ProjectCategory {
  RESIDENTIAL = 'RÉSIDENTIEL',
  EV_STATION = 'VE·BORNE',
  RENOVATION = 'RÉNOVATION',
  UPGRADE = 'MISE AUX NORMES'
}

export interface Project {
  id: string;
  title: string;
  neighbourhood: string;
  category: string;
  imageUrl?: string;
  isPlaceholder?: boolean;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  hours: string;
  license: string;
  promoActive: boolean;
  promoText: string;
  promoExpiry: string;
  emergencyActive: boolean;
  showCategories: boolean;
}

export const DEFAULT_CATEGORIES = [
  'TOUS',
  ProjectCategory.RESIDENTIAL,
  ProjectCategory.EV_STATION,
  ProjectCategory.RENOVATION,
  ProjectCategory.UPGRADE
];

export interface Review {
  id: number;
  rating: number;
  quote: string;
  author: string;
  neighbourhood: string;
}

export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}
