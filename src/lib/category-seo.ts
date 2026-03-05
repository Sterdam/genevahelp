import type { ResourceCategory } from './types'

interface CategorySEO {
  titleFr: string
  titleEn: string
  descriptionFr: string
  descriptionEn: string
  faqs: { question: string; answer: string }[]
}

export const CATEGORY_SEO: Record<ResourceCategory, CategorySEO> = {
  food: {
    titleFr: 'Aide alimentaire',
    titleEn: 'Food Aid',
    descriptionFr: 'Trouvez les distributions alimentaires gratuites, repas chauds, colis alimentaires et épiceries solidaires à Genève.',
    descriptionEn: 'Find free food distribution, hot meals, food parcels and solidarity grocery stores in Geneva.',
    faqs: [
      { question: 'Where can I get free food in Geneva?', answer: 'GenevaHelp lists all free food distribution points in Geneva including hot meals, food parcels, and solidarity grocery stores. Most services are open to everyone without conditions.' },
      { question: 'Are food aid services free?', answer: 'Yes, all food aid resources listed on GenevaHelp are free. Some may require registration or proof of residency in Geneva.' },
    ],
  },
  health: {
    titleFr: 'Santé',
    titleEn: 'Health',
    descriptionFr: 'Accédez aux soins médicaux gratuits, consultations, santé mentale et pharmacies solidaires à Genève.',
    descriptionEn: 'Access free medical care, consultations, mental health services and solidarity pharmacies in Geneva.',
    faqs: [
      { question: 'Can I see a doctor for free in Geneva?', answer: 'Yes, several organizations in Geneva offer free medical consultations, including for people without health insurance. Check the resources listed here for locations and hours.' },
      { question: 'Is there free mental health support in Geneva?', answer: 'Yes, multiple organizations offer free psychological support and counseling services in Geneva for people in difficult situations.' },
    ],
  },
  legal: {
    titleFr: 'Aide juridique',
    titleEn: 'Legal Aid',
    descriptionFr: 'Consultations juridiques gratuites, aide au droit des étrangers, droit du travail et accompagnement administratif à Genève.',
    descriptionEn: 'Free legal consultations, immigration law help, labor law and administrative support in Geneva.',
    faqs: [
      { question: 'Where can I get free legal advice in Geneva?', answer: 'Several organizations offer free or low-cost legal consultations in Geneva covering family law, immigration, employment, and more.' },
      { question: 'Can I get help with asylum procedures?', answer: 'Yes, specialized legal aid organizations in Geneva provide free assistance with asylum procedures and immigration matters.' },
    ],
  },
  housing: {
    titleFr: 'Logement',
    titleEn: 'Housing',
    descriptionFr: "Hébergement d'urgence, foyers, abris de nuit et aide au logement gratuits à Genève.",
    descriptionEn: 'Emergency shelters, night shelters, transitional housing and free housing assistance in Geneva.',
    faqs: [
      { question: 'Where can I sleep tonight in Geneva?', answer: 'Geneva has several emergency shelters and night shelters that provide free accommodation. Check the resources listed here for availability and conditions.' },
      { question: 'How do I find affordable housing in Geneva?', answer: 'Several organizations help with housing searches, provide transitional housing, or offer emergency shelter in Geneva. GenevaHelp lists all free options.' },
    ],
  },
  language: {
    titleFr: 'Cours de langue',
    titleEn: 'Language Courses',
    descriptionFr: 'Cours de français gratuits, ateliers de conversation et programmes linguistiques pour migrants à Genève.',
    descriptionEn: 'Free French courses, conversation workshops and language programs for migrants in Geneva.',
    faqs: [
      { question: 'Where can I learn French for free in Geneva?', answer: 'Multiple organizations in Geneva offer free French language courses for migrants and residents, ranging from beginner to advanced levels.' },
      { question: 'Do I need to register for free language courses?', answer: 'Most free language courses in Geneva require prior registration. Check each resource for specific enrollment procedures and available spots.' },
    ],
  },
  education: {
    titleFr: 'Formation',
    titleEn: 'Education',
    descriptionFr: 'Formations gratuites, aide aux devoirs, cours du soir et programmes éducatifs à Genève.',
    descriptionEn: 'Free training, homework help, evening courses and educational programs in Geneva.',
    faqs: [
      { question: 'Are there free training programs in Geneva?', answer: 'Yes, several organizations offer free vocational training, digital skills courses, and continuing education programs in Geneva.' },
      { question: 'Can my children get free homework help in Geneva?', answer: 'Yes, multiple associations provide free after-school homework support and tutoring for children in Geneva.' },
    ],
  },
  employment: {
    titleFr: 'Emploi',
    titleEn: 'Employment',
    descriptionFr: "Aide à la recherche d'emploi, ateliers CV, coaching professionnel et insertion professionnelle gratuits à Genève.",
    descriptionEn: 'Free job search help, CV workshops, professional coaching and job placement services in Geneva.',
    faqs: [
      { question: 'Where can I get help finding a job in Geneva?', answer: 'Several organizations in Geneva offer free employment support including CV writing workshops, interview preparation, and job placement assistance.' },
      { question: 'Are there free professional training programs?', answer: 'Yes, multiple programs offer free professional skills training and certifications to help you enter the job market in Geneva.' },
    ],
  },
  clothing: {
    titleFr: 'Vêtements',
    titleEn: 'Clothing',
    descriptionFr: 'Distribution de vêtements gratuits, vestiaires solidaires et friperies sociales à Genève.',
    descriptionEn: 'Free clothing distribution, solidarity wardrobes and social thrift stores in Geneva.',
    faqs: [
      { question: 'Where can I get free clothes in Geneva?', answer: 'Several organizations in Geneva distribute free clothing through solidarity wardrobes and social thrift stores. Most are open to everyone without conditions.' },
    ],
  },
  hygiene: {
    titleFr: 'Hygiène',
    titleEn: 'Hygiene',
    descriptionFr: 'Douches gratuites, laveries solidaires et distribution de produits d\'hygiène à Genève.',
    descriptionEn: 'Free showers, solidarity laundry services and hygiene product distribution in Geneva.',
    faqs: [
      { question: 'Where can I take a free shower in Geneva?', answer: 'Several day centers and solidarity organizations in Geneva offer free shower facilities and hygiene products for people in need.' },
    ],
  },
  wifi: {
    titleFr: 'WiFi gratuit',
    titleEn: 'Free WiFi',
    descriptionFr: 'Points WiFi gratuits, bibliothèques avec accès internet et espaces numériques à Genève.',
    descriptionEn: 'Free WiFi hotspots, libraries with internet access and digital spaces in Geneva.',
    faqs: [
      { question: 'Where can I find free WiFi in Geneva?', answer: 'Geneva offers free WiFi in many public spaces including libraries, community centers, and designated hotspots throughout the city.' },
    ],
  },
  finance: {
    titleFr: 'Aide financière',
    titleEn: 'Financial Aid',
    descriptionFr: 'Aide financière d\'urgence, gestion budgétaire et accompagnement social financier gratuit à Genève.',
    descriptionEn: 'Emergency financial aid, budget management and free financial social support in Geneva.',
    faqs: [
      { question: 'Can I get emergency financial help in Geneva?', answer: 'Yes, several organizations provide emergency financial assistance and budget counseling for people in difficulty in Geneva.' },
    ],
  },
  children: {
    titleFr: 'Enfance',
    titleEn: 'Children',
    descriptionFr: 'Activités gratuites pour enfants, garderies solidaires et soutien familial à Genève.',
    descriptionEn: 'Free activities for children, solidarity daycare and family support in Geneva.',
    faqs: [
      { question: 'Are there free activities for children in Geneva?', answer: 'Yes, many organizations offer free recreational activities, after-school programs, and family support services for children in Geneva.' },
    ],
  },
  elderly: {
    titleFr: 'Aînés',
    titleEn: 'Elderly',
    descriptionFr: 'Services gratuits pour personnes âgées, visites à domicile et activités seniors à Genève.',
    descriptionEn: 'Free services for elderly people, home visits and senior activities in Geneva.',
    faqs: [
      { question: 'What free services exist for elderly people in Geneva?', answer: 'Geneva offers various free services for seniors including home visits, companionship programs, meal delivery, and social activities.' },
    ],
  },
  women: {
    titleFr: 'Femmes',
    titleEn: 'Women',
    descriptionFr: 'Aide spécialisée pour les femmes : hébergement, soutien juridique, accompagnement et écoute gratuits à Genève.',
    descriptionEn: 'Specialized support for women: shelter, legal aid, counseling and free helplines in Geneva.',
    faqs: [
      { question: 'Where can women get help in Geneva?', answer: 'Several organizations in Geneva provide specialized free support for women including emergency shelter, legal aid, counseling, and hotlines for victims of violence.' },
    ],
  },
  addiction: {
    titleFr: 'Addictions',
    titleEn: 'Addiction Support',
    descriptionFr: 'Aide gratuite pour les addictions : suivi médical, groupes de parole et accompagnement à Genève.',
    descriptionEn: 'Free addiction support: medical follow-up, support groups and counseling in Geneva.',
    faqs: [
      { question: 'Where can I get free addiction help in Geneva?', answer: 'Geneva has several organizations offering free addiction support including medical treatment, counseling, harm reduction services, and support groups.' },
    ],
  },
  social: {
    titleFr: 'Aide sociale',
    titleEn: 'Social Support',
    descriptionFr: 'Accompagnement social, centres communautaires et aide aux démarches sociales gratuits à Genève.',
    descriptionEn: 'Social support, community centers and free social assistance in Geneva.',
    faqs: [
      { question: 'Where can I get social support in Geneva?', answer: 'Many community centers and social organizations in Geneva offer free social support, guidance with administrative procedures, and community activities.' },
    ],
  },
  admin: {
    titleFr: 'Aide administrative',
    titleEn: 'Administrative Help',
    descriptionFr: 'Aide gratuite pour les démarches administratives, formulaires et permis à Genève.',
    descriptionEn: 'Free help with administrative procedures, forms and permits in Geneva.',
    faqs: [
      { question: 'Where can I get help with administrative procedures in Geneva?', answer: 'Several organizations in Geneva offer free assistance with paperwork, permit applications, and other administrative procedures.' },
    ],
  },
  emergency: {
    titleFr: 'Urgences',
    titleEn: 'Emergency',
    descriptionFr: 'Services d\'urgence gratuits à Genève : hébergement, nourriture, aide psychologique et numéros d\'urgence.',
    descriptionEn: 'Free emergency services in Geneva: shelter, food, psychological help and emergency hotlines.',
    faqs: [
      { question: 'What emergency services are free in Geneva?', answer: 'Geneva provides free emergency shelter, crisis food distribution, psychological first aid, and emergency hotlines available 24/7.' },
      { question: 'What number should I call in an emergency in Geneva?', answer: 'Call 144 for medical emergencies, 117 for police, 118 for fire. For non-life-threatening situations, check the resources listed here for crisis support services.' },
    ],
  },
  disability: {
    titleFr: 'Handicap',
    titleEn: 'Disability Support',
    descriptionFr: 'Services gratuits pour personnes en situation de handicap à Genève : associations, soutien, groupes de parole et accompagnement.',
    descriptionEn: 'Free services for people with disabilities in Geneva: associations, support, peer groups and guidance.',
    faqs: [
      { question: 'Where can people with disabilities find support in Geneva?', answer: 'Geneva has several organizations offering free support, counseling, and advocacy for people with disabilities and their families. Check the resources listed here.' },
      { question: 'Are disability support services free in Geneva?', answer: 'Yes, many disability support organizations in Geneva offer free services including counseling, peer support groups, and information about rights and benefits.' },
    ],
  },
  other: {
    titleFr: 'Autres ressources',
    titleEn: 'Other Resources',
    descriptionFr: 'Autres ressources et services gratuits disponibles à Genève.',
    descriptionEn: 'Other free resources and services available in Geneva.',
    faqs: [],
  },
}
