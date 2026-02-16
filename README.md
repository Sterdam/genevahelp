# GenevaHelp

Interactive map of all free resources in Geneva — food aid, legal help, healthcare, housing, language courses, public WiFi, and much more.

**[genevahelp.ch](https://genevahelp.ch)**

## What is this?

GenevaHelp is a free, open-source web app that maps **171 verified free resources** across Geneva. It helps anyone — residents, migrants, refugees, social workers — quickly find nearby help.

Available in **32 languages**: French, English, German, Spanish, Italian, Portuguese, Arabic, Turkish, Russian, Ukrainian, Croatian, Serbian, Bulgarian, Romanian, Polish, Albanian, Kurdish, Somali, Hindi, Farsi, Thai, Bengali, Amharic, Tigrinya, Swahili, Urdu, Nepali, Tamil, Japanese, Korean, Chinese, Vietnamese.

## Features

- Interactive map with categorized markers (Leaflet + OpenStreetMap)
- Search and filter by category (food, health, legal, housing, language, etc.)
- Geolocation — sort resources by distance
- Resource details: address, hours, phone, accessibility, conditions
- Community suggestions and report system
- Admin panel for resource management (edit, hide, delete, add)
- PWA — installable on mobile, works offline
- Visit counter via Supabase
- SEO-optimized with structured data and OG tags

## Categories

Food, Health, Legal, Housing, Language, Education, Employment, Clothing, Hygiene, WiFi, Finance, Children, Elderly, Women, Addiction, Social, Administrative, Emergency.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + TypeScript + Vite 7 |
| Styling | Tailwind CSS v4 |
| Map | Leaflet + OpenStreetMap |
| i18n | i18next (32 languages) |
| Backend | Supabase (optional — works without it) |
| Deployment | Docker (nginx:alpine) + Let's Encrypt |

## Getting Started

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

The app works fully without Supabase — all 171 resources are bundled as static data. To enable the visit counter and future features, copy `.env.example` to `.env` and add your Supabase credentials.

## Deployment

```bash
# Build locally
npm run build

# Deploy via Docker
docker compose -f docker-compose.prod.yml up -d --build
```

## Contributing

Know a free resource in Geneva that's missing? You can:
- Use the **Suggest** page on the site directly
- Open an issue on this repo
- Submit a PR adding the resource to `src/lib/demo-data.ts`

## License

MIT
