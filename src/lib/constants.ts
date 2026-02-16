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
}

export const CATEGORY_CONFIG: Record<ResourceCategory, CategoryConfig> = {
  food: { color: '#EF4444', icon: UtensilsCrossed },
  health: { color: '#EC4899', icon: Heart },
  legal: { color: '#8B5CF6', icon: Scale },
  housing: { color: '#F97316', icon: Home },
  language: { color: '#06B6D4', icon: Languages },
  education: { color: '#3B82F6', icon: GraduationCap },
  employment: { color: '#6366F1', icon: Briefcase },
  clothing: { color: '#A855F7', icon: Shirt },
  hygiene: { color: '#14B8A6', icon: Droplets },
  wifi: { color: '#22C55E', icon: Wifi },
  finance: { color: '#EAB308', icon: Coins },
  children: { color: '#F472B6', icon: Baby },
  elderly: { color: '#78716C', icon: UserRound },
  women: { color: '#E11D48', icon: Shield },
  addiction: { color: '#DC2626', icon: HeartHandshake },
  social: { color: '#10B981', icon: Users },
  admin: { color: '#64748B', icon: FileText },
  emergency: { color: '#FF0000', icon: Siren },
  other: { color: '#9CA3AF', icon: MapPin },
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

// Replace with your Stripe Payment Link URL
// Stripe Dashboard → Products → "Buy me a coffee" → Payment Link
export const STRIPE_DONATION_LINK = 'https://buy.stripe.com/dRm3cu36F7kgeJW6ex0VO00'
