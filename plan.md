# CityVault — Plan Complet de Développement
## "Google Maps mais pour tout ce qui est gratuit dans ta ville"

---

## 🎯 VISION

Une carte interactive recensant TOUTES les ressources gratuites de Genève : aide alimentaire, juridique, médicale, cours de langue, wifi public, douches, vêtements, hébergement d'urgence, aides financières, etc. Utile dès le jour 1 grâce à une base de données pré-remplie. Zéro coût sauf hébergement.

---

## 🏗️ STACK TECHNIQUE (100% Gratuit)

| Composant | Technologie | Coût |
|-----------|------------|------|
| Frontend | React 18 + Vite + TypeScript | Gratuit |
| Carte | Leaflet + OpenStreetMap tiles | Gratuit (pas d'API key) |
| CSS | Tailwind CSS | Gratuit |
| Backend / DB | Supabase Free Tier (500MB, 50k rows) | Gratuit |
| Auth | Supabase Auth (Google + email) | Gratuit |
| Search | Supabase Full-Text Search (pg_trgm) | Gratuit |
| Icônes | Lucide React | Gratuit |
| i18n | react-i18next | Gratuit |
| Hosting Frontend | Vercel Free Tier | Gratuit |
| Scraping initial | Node.js scripts (one-shot) | Gratuit |
| Domaine | cityvault.ch ou cityvault.app (optionnel) | ~10 CHF/an |

---

## 📁 STRUCTURE DU PROJET

```
cityvault/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── locales/
│       ├── fr/translation.json
│       └── en/translation.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.ts              # Client Supabase
│   │   ├── types.ts                 # Types TypeScript
│   │   └── constants.ts             # Catégories, couleurs, icônes
│   ├── hooks/
│   │   ├── useResources.ts          # Fetch + filtre des ressources
│   │   ├── useGeolocation.ts        # Position utilisateur
│   │   ├── useSearch.ts             # Recherche full-text
│   │   └── useAuth.ts              # Auth Supabase
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Logo + nav + langue + auth
│   │   │   ├── MobileNav.tsx        # Nav bottom mobile
│   │   │   └── Footer.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx          # Carte Leaflet principale
│   │   │   ├── ResourceMarker.tsx   # Marqueur custom par catégorie
│   │   │   ├── MarkerCluster.tsx    # Clustering des pins
│   │   │   ├── UserLocationMarker.tsx
│   │   │   └── MapControls.tsx      # Zoom, recentrer, fullscreen
│   │   ├── resources/
│   │   │   ├── ResourceCard.tsx     # Card dans la liste
│   │   │   ├── ResourceDetail.tsx   # Modal/panel de détail
│   │   │   ├── ResourceList.tsx     # Liste scrollable
│   │   │   └── ResourceForm.tsx     # Formulaire de suggestion
│   │   ├── filters/
│   │   │   ├── CategoryFilter.tsx   # Filtres par catégorie (pills)
│   │   │   ├── SearchBar.tsx        # Barre de recherche
│   │   │   └── FilterPanel.tsx      # Filtres avancés (horaires, distance)
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Spinner.tsx
│   │       └── EmptyState.tsx
│   └── pages/
│       ├── HomePage.tsx             # Map + liste split view
│       ├── AboutPage.tsx            # Mission + crédits
│       └── SuggestPage.tsx          # Suggérer une ressource
├── scripts/
│   ├── seed-database.ts             # Script pour peupler la DB
│   └── data/
│       └── geneva-resources.json    # Données pré-scrapées
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Schema SQL complet
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── README.md
```

---

## 🗄️ SCHEMA BASE DE DONNÉES (Supabase/PostgreSQL)

```sql
-- ===========================================
-- MIGRATION 001: Schema initial CityVault
-- ===========================================

-- Extension pour recherche full-text et distance géo
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS postgis;

-- ---- CATÉGORIES ----
CREATE TYPE resource_category AS ENUM (
  'food',           -- Aide alimentaire (distributions, frigos solidaires, épiceries sociales)
  'health',         -- Santé (consultations gratuites, santé mentale, dentaire)
  'legal',          -- Aide juridique gratuite
  'housing',        -- Hébergement (urgence, foyers, logement social)
  'language',       -- Cours de langue gratuits
  'education',      -- Formation, cours, ateliers
  'employment',     -- Aide à l'emploi, insertion
  'clothing',       -- Vêtements, vestiaire
  'hygiene',        -- Douches, toilettes publiques, laverie
  'wifi',           -- WiFi gratuit, accès internet
  'finance',        -- Aides financières, bourses, allocations
  'children',       -- Aide enfance/famille
  'elderly',        -- Services personnes âgées
  'women',          -- Services spécifiques femmes
  'addiction',      -- Addictions, soutien
  'social',         -- Lien social, activités gratuites, sport
  'admin',          -- Aide administrative, formulaires
  'emergency',      -- Urgences, numéros utiles
  'other'           -- Autre
);

-- ---- TABLE PRINCIPALE ----
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Infos de base
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category resource_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Localisation
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geog GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  
  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Horaires (format JSON flexible)
  opening_hours JSONB DEFAULT '{}',
  -- Format: { "monday": "9:00-17:00", "tuesday": "9:00-17:00", ... }
  -- Peut aussi contenir: "notes": "Fermé les jours fériés"
  
  -- Conditions d'accès
  access_conditions TEXT,        -- "Sur rendez-vous", "Avec pièce d'identité", etc.
  target_audience TEXT,          -- "Tous", "Femmes uniquement", "Jeunes 18-25", etc.
  languages_spoken TEXT[] DEFAULT '{fr}',
  wheelchair_accessible BOOLEAN DEFAULT NULL,
  
  -- Méta
  source TEXT,                   -- D'où vient l'info (site web, etc.)
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  -- Communauté
  upvotes INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

-- ---- INDEX ----
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_geog ON resources USING GIST(geog);
CREATE INDEX idx_resources_name_trgm ON resources USING GIN(name gin_trgm_ops);
CREATE INDEX idx_resources_description_trgm ON resources USING GIN(description gin_trgm_ops);
CREATE INDEX idx_resources_verified ON resources(verified);

-- ---- SUGGESTIONS COMMUNAUTAIRES ----
CREATE TABLE suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Peut être une nouvelle ressource ou une correction
  type TEXT CHECK (type IN ('new', 'correction', 'closed')) NOT NULL,
  resource_id UUID REFERENCES resources(id),  -- NULL si nouvelle suggestion
  
  -- Données suggérées
  name TEXT NOT NULL,
  description TEXT,
  category resource_category,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  email TEXT,
  website TEXT,
  opening_hours JSONB,
  
  -- Méta
  submitted_by UUID,  -- NULL si anonyme
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- UPVOTES (un par user par ressource) ----
CREATE TABLE upvotes (
  user_id UUID NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- ---- SIGNALEMENTS ----
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  reason TEXT CHECK (reason IN ('closed', 'wrong_info', 'wrong_location', 'duplicate', 'inappropriate')) NOT NULL,
  details TEXT,
  submitted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---- RLS (Row Level Security) ----
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Lecture publique des ressources
CREATE POLICY "Resources are viewable by everyone" ON resources
  FOR SELECT USING (true);

-- Tout le monde peut suggérer
CREATE POLICY "Anyone can submit suggestions" ON suggestions
  FOR INSERT WITH CHECK (true);

-- Tout le monde peut voir les suggestions approuvées
CREATE POLICY "Approved suggestions are viewable" ON suggestions
  FOR SELECT USING (status = 'approved' OR submitted_by = auth.uid());

-- Upvotes par users authentifiés
CREATE POLICY "Authenticated users can upvote" ON upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see their upvotes" ON upvotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their upvotes" ON upvotes
  FOR DELETE USING (auth.uid() = user_id);

-- Reports par tout le monde
CREATE POLICY "Anyone can report" ON reports
  FOR INSERT WITH CHECK (true);

-- ---- FONCTIONS ----

-- Recherche par proximité
CREATE OR REPLACE FUNCTION nearby_resources(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 2000,
  cat resource_category DEFAULT NULL
)
RETURNS SETOF resources AS $$
  SELECT *
  FROM resources
  WHERE ST_DWithin(
    geog,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  AND (cat IS NULL OR category = cat)
  ORDER BY geog <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
$$ LANGUAGE SQL STABLE;

-- Recherche full-text
CREATE OR REPLACE FUNCTION search_resources(search_query TEXT)
RETURNS SETOF resources AS $$
  SELECT *
  FROM resources
  WHERE 
    name ILIKE '%' || search_query || '%'
    OR description ILIKE '%' || search_query || '%'
    OR search_query = ANY(tags)
  ORDER BY
    CASE WHEN name ILIKE '%' || search_query || '%' THEN 0 ELSE 1 END,
    upvotes DESC;
$$ LANGUAGE SQL STABLE;

-- Incrémenter upvotes
CREATE OR REPLACE FUNCTION increment_upvotes(rid UUID)
RETURNS VOID AS $$
  UPDATE resources SET upvotes = upvotes + 1 WHERE id = rid;
$$ LANGUAGE SQL VOLATILE;

CREATE OR REPLACE FUNCTION decrement_upvotes(rid UUID)
RETURNS VOID AS $$
  UPDATE resources SET upvotes = upvotes - 1 WHERE id = rid;
$$ LANGUAGE SQL VOLATILE;
```

---

## 📦 DONNÉES PRÉ-CHARGÉES (Exemples pour le seed)

Voici la structure + exemples réels de Genève. Le script de seed doit contenir MINIMUM 100 ressources réelles.

```json
[
  {
    "name": "Carrefour Rue de Lausanne (Armée du Salut)",
    "description": "Distribution alimentaire, repas chauds, vestiaire, douches, aide sociale. Accueil inconditionnel sans rendez-vous.",
    "category": "food",
    "tags": ["repas", "distribution", "sans-abri", "douche", "vêtements"],
    "address": "Rue de Lausanne 63, 1202 Genève",
    "latitude": 46.2107,
    "longitude": 6.1438,
    "phone": "+41 22 338 22 00",
    "website": "https://www.armeedusalut.ch",
    "opening_hours": {
      "monday": "8:00-16:00",
      "tuesday": "8:00-16:00",
      "wednesday": "8:00-16:00",
      "thursday": "8:00-16:00",
      "friday": "8:00-16:00",
      "notes": "Repas de midi servis de 11:30 à 13:00"
    },
    "access_conditions": "Sans rendez-vous, aucune condition",
    "target_audience": "Tous",
    "languages_spoken": ["fr", "en", "ar"],
    "wheelchair_accessible": true,
    "source": "https://www.armeedusalut.ch",
    "verified": true
  },
  {
    "name": "Consultation juridique gratuite - Ordre des Avocats",
    "description": "Consultation juridique gratuite de 20 minutes avec un avocat. Tous domaines du droit.",
    "category": "legal",
    "tags": ["avocat", "juridique", "droit", "gratuit", "consultation"],
    "address": "Rue de l'Hôtel-de-Ville 1, 1204 Genève",
    "latitude": 46.2000,
    "longitude": 6.1479,
    "phone": "+41 22 310 35 35",
    "website": "https://www.odage.ch",
    "opening_hours": {
      "wednesday": "17:00-19:00",
      "notes": "Uniquement le mercredi soir, premier arrivé premier servi"
    },
    "access_conditions": "Premier arrivé, premier servi. Apporter les documents pertinents.",
    "target_audience": "Résidents genevois",
    "languages_spoken": ["fr"],
    "wheelchair_accessible": true,
    "source": "https://www.odage.ch",
    "verified": true
  },
  {
    "name": "Frigo solidaire - Plainpalais",
    "description": "Frigo en libre-service. Déposez ou prenez de la nourriture gratuitement. Accessible 24h/24.",
    "category": "food",
    "tags": ["frigo", "solidaire", "anti-gaspi", "nourriture", "24h"],
    "address": "Rue de l'École-de-Médecine 3, 1205 Genève",
    "latitude": 46.1983,
    "longitude": 6.1406,
    "phone": null,
    "website": null,
    "opening_hours": {
      "monday": "00:00-23:59",
      "tuesday": "00:00-23:59",
      "wednesday": "00:00-23:59",
      "thursday": "00:00-23:59",
      "friday": "00:00-23:59",
      "saturday": "00:00-23:59",
      "sunday": "00:00-23:59"
    },
    "access_conditions": "Libre accès",
    "target_audience": "Tous",
    "languages_spoken": ["fr"],
    "wheelchair_accessible": true,
    "source": "Relevé terrain",
    "verified": true
  }
]
```

**SOURCES À SCRAPER / COMPILER pour le seed (TOUTES PUBLIQUES ET GRATUITES) :**

1. **Ville de Genève** — https://www.geneve.ch/fr/themes/social — Liste des prestations sociales
2. **Hospice Général** — https://www.hospicegeneral.ch — Aide sociale cantonale  
3. **Caritas Genève** — https://www.caritas-geneve.ch — Aide alimentaire, vêtements, cours
4. **CSP Genève** — https://www.csp-ge.ch — Centre Social Protestant, aide juridique/admin
5. **Croix-Rouge genevoise** — https://www.croix-rouge-ge.ch — Multiples services
6. **Colis du Cœur** — https://www.colisducoeur.ch — Distribution alimentaire
7. **SOS Femmes** — Hébergement d'urgence femmes
8. **Café Cornavin / Café de la Gare** — Accueil sans-abri
9. **Université Ouvrière de Genève** — Cours gratuits/pas chers
10. **Maisons de quartier de Genève** — Activités gratuites
11. **Point d'Eau** — Douches, consignes, laverie pour précaires
12. **WiFi Ville de Genève** — Points d'accès wifi gratuits
13. **Médecins du Monde** — Consultations médicales gratuites
14. **AGORA** — Accueil de nuit
15. **Programme PAPYRUS** (si encore actif) — Régularisation
16. **Service social de la Ville** — Aides financières ponctuelles
17. **Partage** — Récupération alimentaire
18. **Emmaüs Genève** — Vêtements, meubles, aide
19. **Camarada** — Cours de français pour femmes migrantes
20. **Bureau d'intégration des étrangers (BIE)** — Cours, orientation

Le script de seed doit inclure au minimum ces 20 organisations avec leurs points de service détaillés, ce qui donnera facilement 100-200 entrées.

---

## 🎨 DESIGN & UX

### Layout principal (Desktop)
```
┌──────────────────────────────────────────────────┐
│  🏛️ CityVault Genève    [FR|EN]  [Suggérer]     │
├──────────────────────────────────────────────────┤
│ [🔍 Rechercher une ressource...              ]   │
│ [🍽️ Alimentaire] [⚕️ Santé] [⚖️ Juridique]     │
│ [🏠 Logement] [📚 Langue] [👕 Vêtements] [+]    │
├─────────────────────┬────────────────────────────┤
│                     │                            │
│   Liste scrollable  │     Carte Leaflet          │
│                     │     (OpenStreetMap)         │
│   ┌───────────┐     │                            │
│   │ Resource 1│     │        📍  📍              │
│   └───────────┘     │     📍       📍            │
│   ┌───────────┐     │          📍                │
│   │ Resource 2│     │       📍    📍             │
│   └───────────┘     │                            │
│   ┌───────────┐     │     📍         📍          │
│   │ Resource 3│     │                            │
│   └───────────┘     │                            │
│                     │                            │
├─────────────────────┴────────────────────────────┤
│  Un projet open-source pour Genève 🇨🇭           │
└──────────────────────────────────────────────────┘
```

### Layout Mobile
```
┌─────────────────────┐
│ 🏛️ CityVault   [≡]  │
├─────────────────────┤
│ [🔍 Rechercher... ] │
│ [🍽️][⚕️][⚖️][🏠][+]│
├─────────────────────┤
│                     │
│   Carte Leaflet     │
│   (60% hauteur)     │
│      📍  📍         │
│   📍       📍       │
│                     │
├─────────────────────┤
│ ↕️ Drag handle      │
│ ┌─────────────────┐ │
│ │ Resource 1      │ │
│ │ 📍 250m • 🍽️    │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Resource 2      │ │
│ └─────────────────┘ │
├─────────────────────┤
│ [🗺️] [📋] [➕] [ℹ️] │
└─────────────────────┘
```

### Couleurs par catégorie
```typescript
const CATEGORY_CONFIG = {
  food:       { color: '#EF4444', icon: 'UtensilsCrossed', label: 'Alimentaire' },
  health:     { color: '#EC4899', icon: 'Heart',           label: 'Santé' },
  legal:      { color: '#8B5CF6', icon: 'Scale',           label: 'Juridique' },
  housing:    { color: '#F97316', icon: 'Home',            label: 'Logement' },
  language:   { color: '#06B6D4', icon: 'Languages',       label: 'Langues' },
  education:  { color: '#3B82F6', icon: 'GraduationCap',   label: 'Formation' },
  employment: { color: '#6366F1', icon: 'Briefcase',       label: 'Emploi' },
  clothing:   { color: '#A855F7', icon: 'Shirt',           label: 'Vêtements' },
  hygiene:    { color: '#14B8A6', icon: 'Droplets',        label: 'Hygiène' },
  wifi:       { color: '#22C55E', icon: 'Wifi',            label: 'WiFi' },
  finance:    { color: '#EAB308', icon: 'Coins',           label: 'Finances' },
  children:   { color: '#F472B6', icon: 'Baby',            label: 'Enfance' },
  elderly:    { color: '#78716C', icon: 'UserRound',       label: 'Aînés' },
  women:      { color: '#E11D48', icon: 'Shield',          label: 'Femmes' },
  addiction:  { color: '#DC2626', icon: 'HeartHandshake',  label: 'Addictions' },
  social:     { color: '#10B981', icon: 'Users',           label: 'Social' },
  admin:      { color: '#64748B', icon: 'FileText',        label: 'Administratif' },
  emergency:  { color: '#FF0000', icon: 'Siren',           label: 'Urgences' },
  other:      { color: '#9CA3AF', icon: 'MapPin',          label: 'Autre' },
};
```

### Principes UX
- **Mobile-first** — 80% des utilisateurs cibles sont sur mobile
- **Offline-capable** — Les données principales doivent être cachées (service worker)
- **Multilingue dès le jour 1** — Français + Anglais minimum (les migrants parlent souvent anglais)
- **Accessibilité** — WCAG 2.1 AA, navigation clavier, screen reader friendly
- **Zéro friction** — Pas besoin de compte pour consulter, seulement pour suggérer/upvoter
- **Thème** — Fond blanc/gris clair, clean, sérieux mais chaleureux. Pas de dark mode pour l'instant (simplicité).

---

## ⚙️ FONCTIONNALITÉS MVP (V1)

### Must-Have (Ce soir)
1. ✅ Carte interactive avec marqueurs colorés par catégorie
2. ✅ Liste des ressources avec scroll synchronisé avec la carte
3. ✅ Filtrage par catégorie (toggle pills)
4. ✅ Recherche full-text (nom, description, tags)
5. ✅ Fiche détaillée d'une ressource (modal ou panel latéral)
6. ✅ Géolocalisation utilisateur + tri par distance
7. ✅ 100+ ressources réelles pré-chargées pour Genève
8. ✅ Responsive mobile/desktop
9. ✅ FR/EN

### Should-Have (Semaine 1)
10. Auth Supabase (Google Sign-In)
11. Formulaire "Suggérer une ressource" (modéré)
12. Upvote/downvote par ressource
13. Signalement (fermé, info incorrecte)
14. Filtres avancés (ouvert maintenant, accessible PMR, distance)
15. Clustering des marqueurs au zoom arrière
16. PWA (installable, splash screen)
17. SEO (meta tags, sitemap, structured data)

### Nice-to-Have (V2)
18. Partage d'une ressource (lien direct, WhatsApp, copie)
19. Mode "Urgence" — les 5 ressources les plus proches toutes catégories
20. Widget embarquable pour sites d'assos
21. Export PDF d'une fiche (pour imprimer et donner à quelqu'un)
22. Dashboard admin pour modérer les suggestions
23. API publique pour que d'autres apps consomment les données
24. Ajout Lausanne, Zurich, Berne...

---

## 📋 INSTRUCTIONS POUR CLAUDE CODE

### Étape 1 : Setup du projet
```bash
npm create vite@latest cityvault -- --template react-ts
cd cityvault
npm install leaflet react-leaflet @supabase/supabase-js react-i18next i18next lucide-react react-router-dom
npm install -D tailwindcss @tailwindcss/vite @types/leaflet
```

### Étape 2 : Configuration
- Configurer Tailwind avec @tailwindcss/vite
- Configurer Supabase client avec les env vars : VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
- Configurer i18next avec FR (défaut) et EN
- Configurer React Router avec routes : /, /about, /suggest

### Étape 3 : Implémenter les composants
Suivre la structure de fichiers ci-dessus. L'ordre de développement est :
1. Layout (Header, MobileNav)
2. Map (MapView avec Leaflet centré sur Genève : lat 46.2044, lng 6.1432, zoom 13)
3. ResourceMarker avec icônes/couleurs par catégorie
4. ResourceCard + ResourceList
5. ResourceDetail (modal)
6. SearchBar + CategoryFilter
7. useResources hook (fetch Supabase + filtres)
8. useGeolocation hook
9. Page d'accueil avec split view (liste | carte)
10. Responsive mobile (carte en haut, liste draggable en bas)

### Étape 4 : Seed de la base de données
Créer le script scripts/seed-database.ts qui :
1. Lit geneva-resources.json
2. Insère toutes les ressources dans Supabase
3. Pour les adresses sans lat/lng, utiliser le geocoding Nominatim (gratuit, OpenStreetMap)

### Étape 5 : Deploy
```bash
# Build
npm run build

# Deploy sur Vercel
npx vercel --prod
```

---

## 🔧 CONFIGURATIONS SPÉCIFIQUES

### Variables d'environnement (.env)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhxxxxxxx
VITE_APP_NAME=CityVault
VITE_DEFAULT_CITY=geneva
VITE_DEFAULT_LAT=46.2044
VITE_DEFAULT_LNG=6.1432
VITE_DEFAULT_ZOOM=13
```

### Leaflet CSS (important, sinon la carte casse)
```typescript
// Dans main.tsx ou App.tsx
import 'leaflet/dist/leaflet.css';
```

### Fix icônes Leaflet avec Vite
```typescript
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

### Vercel config (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🚀 CRITÈRES DE SUCCÈS DU MVP

Le MVP est prêt quand :
- [ ] La carte s'affiche centrée sur Genève
- [ ] 100+ ressources réelles sont visibles sur la carte
- [ ] Chaque catégorie a sa couleur et son icône
- [ ] On peut filtrer par catégorie
- [ ] On peut chercher par texte
- [ ] On peut cliquer sur un marqueur et voir les détails
- [ ] La géoloc marche et trie par distance
- [ ] Ça marche parfaitement sur mobile
- [ ] FR et EN fonctionnent
- [ ] C'est déployé et accessible via une URL publique

---

## 📌 NOTES IMPORTANTES

1. **Ne PAS utiliser Mapbox** (payant après quota). Utiliser Leaflet + OpenStreetMap tiles (100% gratuit, illimité).
2. **Ne PAS utiliser Google Geocoding API**. Utiliser Nominatim (gratuit, OpenStreetMap) pour le geocoding des adresses.
3. **Supabase Free Tier** : 500MB DB, 50,000 rows, 2GB bandwidth — largement suffisant pour le MVP.
4. **Les données doivent être RÉELLES**. Pas de placeholder. Chaque ressource doit correspondre à un vrai lieu à Genève avec de vraies coordonnées.
5. **Le design doit être sobre et professionnel.** C'est un outil d'utilité publique, pas une startup flashy. Inspirations : Google Maps, Citymapper, Gov.uk.
6. **Toute la codebase doit être en anglais** (noms de variables, commentaires) mais l'UI en français par défaut.
7. **PostGIS** : Supabase supporte PostGIS nativement sur le free tier. L'activer dans le dashboard Supabase > Database > Extensions.