import {
  UtensilsCrossed,
  Heart,
  Scale,
  Home,
  Languages,
  GraduationCap,
  Briefcase,
  Shirt,
  Droplets,
  Wifi,
  Coins,
  Baby,
  UserRound,
  Shield,
  HeartHandshake,
  Users,
  FileText,
  Siren,
  MapPin,
} from 'lucide-react'
import type { ResourceCategory } from './types'

export interface CategoryConfig {
  color: string
  icon: typeof MapPin
  label: string
  labelEn: string
}

export const CATEGORY_CONFIG: Record<ResourceCategory, CategoryConfig> = {
  food: { color: '#EF4444', icon: UtensilsCrossed, label: 'Alimentaire', labelEn: 'Food' },
  health: { color: '#EC4899', icon: Heart, label: 'Santé', labelEn: 'Health' },
  legal: { color: '#8B5CF6', icon: Scale, label: 'Juridique', labelEn: 'Legal' },
  housing: { color: '#F97316', icon: Home, label: 'Logement', labelEn: 'Housing' },
  language: { color: '#06B6D4', icon: Languages, label: 'Langues', labelEn: 'Languages' },
  education: { color: '#3B82F6', icon: GraduationCap, label: 'Formation', labelEn: 'Education' },
  employment: { color: '#6366F1', icon: Briefcase, label: 'Emploi', labelEn: 'Employment' },
  clothing: { color: '#A855F7', icon: Shirt, label: 'Vêtements', labelEn: 'Clothing' },
  hygiene: { color: '#14B8A6', icon: Droplets, label: 'Hygiène', labelEn: 'Hygiene' },
  wifi: { color: '#22C55E', icon: Wifi, label: 'WiFi', labelEn: 'WiFi' },
  finance: { color: '#EAB308', icon: Coins, label: 'Finances', labelEn: 'Finance' },
  children: { color: '#F472B6', icon: Baby, label: 'Enfance', labelEn: 'Children' },
  elderly: { color: '#78716C', icon: UserRound, label: 'Aînés', labelEn: 'Elderly' },
  women: { color: '#E11D48', icon: Shield, label: 'Femmes', labelEn: 'Women' },
  addiction: { color: '#DC2626', icon: HeartHandshake, label: 'Addictions', labelEn: 'Addiction' },
  social: { color: '#10B981', icon: Users, label: 'Social', labelEn: 'Social' },
  admin: { color: '#64748B', icon: FileText, label: 'Administratif', labelEn: 'Admin' },
  emergency: { color: '#FF0000', icon: Siren, label: 'Urgences', labelEn: 'Emergency' },
  other: { color: '#9CA3AF', icon: MapPin, label: 'Autre', labelEn: 'Other' },
}

export const CATEGORY_EMOJI: Record<ResourceCategory, string> = {
  food: '🍽',
  health: '❤',
  legal: '⚖',
  housing: '🏠',
  language: '💬',
  education: '📚',
  employment: '💼',
  clothing: '👕',
  hygiene: '💧',
  wifi: '📶',
  finance: '💰',
  children: '👶',
  elderly: '🧓',
  women: '🛡',
  addiction: '🤝',
  social: '👥',
  admin: '📋',
  emergency: '🚨',
  other: '📍',
}

export const MAP_CENTER = {
  lat: 46.2044,
  lng: 6.1432,
}

export const MAP_DEFAULT_ZOOM = 13

export const GENEVA_BOUNDS = {
  north: 46.28,
  south: 46.15,
  east: 6.22,
  west: 6.05,
}
