/**
 * Données centralisées des projets du Portfolio
 * Permet d'ajouter ou modifier un projet sans toucher au balisage HTML.
 */
export const projectsData = [
  // ---- Sites vitrines 3D à défilement (Three.js, GSAP, Vite) ----
  {
    id: 'brooklyn-burger',
    title: 'Brooklyn Burger — Site 3D & commande WhatsApp',
    description: "Site du restaurant Brooklyn Burger (ACI 2000, Bamako) : burger 3D qui se décompose au défilement, carte interactive et panier qui envoie la commande par WhatsApp.",
    image: 'assets/brooklyn-burger.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'WhatsApp'],
    demoUrl: 'https://brooklyne.onrender.com/',
    codeUrl: 'https://github.com/Yatt-us/Brooklyne',
    demoLabel: 'Démo Live',
    codeLabel: 'Code'
  },
  {
    id: 'tk-hub',
    title: 'TK HYBRID POD — Site bilingue FR / EN',
    description: "Site de présentation de TK HYBRID POD (énergie propre, espaces intelligents et opportunités numériques), bilingue, avec animations au défilement et projet découpé en modules.",
    image: 'assets/tk-hub.webp',
    categories: ['web', '3d'],
    tags: ['Vite', 'GSAP', 'Lenis', 'i18n FR/EN'],
    demoUrl: 'https://tk-hub-brower.onrender.com/',
    codeUrl: 'https://github.com/Yatt-us/Tk-Hub-brower',
    demoLabel: 'Démo Live',
    codeLabel: 'Code'
  },
  {
    id: 'arbachicken',
    title: 'Arbab Chicken — Site 3D du restaurant',
    description: "Site 3D du restaurant Arbab Chicken (ACI 2000) : poulet volant, menu horizontal avec visuels 3D des plats, galerie et contact, entièrement responsive.",
    image: 'assets/arbachicken.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Responsive'],
    demoUrl: 'https://arba-chicken.onrender.com/',
    codeUrl: null,
    demoLabel: 'Démo Live',
    codeLabel: null
  },
  {
    id: 'peugeot-mali',
    title: 'Peugeot Mali — Showroom 3D (concept)',
    description: "Concept de showroom virtuel pour Peugeot Mali : la gamme défile véhicule par véhicule sur des plateaux 3D, avec demande de devis.",
    image: 'assets/peugeot-mali.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Automobile'],
    demoUrl: null,
    codeUrl: null,
    demoLabel: null,
    codeLabel: null
  },
  {
    id: 'aya-immobiliere',
    title: 'AYA Immobilière — Site 3D',
    description: "Site de l'agence AYA Immobilière (Bamako, Groupe BAMA) : ville 3D animée, présentation du patrimoine, des services et des biens.",
    image: 'assets/aya-immobiliere.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Immobilier'],
    demoUrl: null,
    codeUrl: null,
    demoLabel: null,
    codeLabel: null
  },
  {
    id: 'diago',
    title: 'Diago — Eau minérale du Mali (SEMM)',
    description: "Site 3D de la Société des Eaux Minérales du Mali : bouteille Diago sur l'eau, source, composition, formats et qualité.",
    image: 'assets/diago.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Marque'],
    demoUrl: null,
    codeUrl: null,
    demoLabel: null,
    codeLabel: null
  },
  {
    id: 'achoura',
    title: 'Achoura — Thé vert supérieur',
    description: "Site 3D de la marque de thé vert Achoura : boîte de 250 g sur un plateau doré, rituel du thé et points de vente.",
    image: 'assets/achoura.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Marque'],
    demoUrl: null,
    codeUrl: null,
    demoLabel: null,
    codeLabel: null
  },
  {
    id: '3x-energy',
    title: '3X Energy — Site 3D',
    description: "Site 3D de la boisson énergisante 3X Energy : canettes sur scène, gamme de produits, univers de marque et contact.",
    image: 'assets/3x-energy.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Marque'],
    demoUrl: 'https://threexboisson.onrender.com/',
    codeUrl: null,
    demoLabel: 'Démo Live',
    codeLabel: null
  },
  {
    id: 'double-seven',
    title: 'Double Seven Energy Drink — Site 3D',
    description: "Site 3D de Double Seven : canette en rotation, gamme (Classic, Zéro…), ambassadeurs, actions sociales et fan zone.",
    image: 'assets/double-seven.webp',
    categories: ['web', '3d'],
    tags: ['Three.js', 'GSAP', 'Vite', 'Marque'],
    demoUrl: 'https://doubleseven.onrender.com/',
    codeUrl: null,
    demoLabel: 'Démo Live',
    codeLabel: null
  },
  // ---- Applications et plateformes ----
  {
    id: 'ciwara',
    title: 'Application Mobile Ciwara — Flutter',
    description: "Développement mobile cross-platform haute performance publié sur l'App Store, intégration d'APIs RESTful et UX moderne.",
    image: 'assets/ciwara.png',
    categories: ['mobile'],
    tags: ['Flutter', 'Dart', 'iOS / Android', 'REST API'],
    demoUrl: 'https://apps.apple.com/us/app/ciwara/id6743376815',
    codeUrl: 'https://apps.apple.com/us/app/ciwara/id6743376815',
    demoLabel: 'App Store',
    codeLabel: 'Détails'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce — Django',
    description: "Plateforme e-commerce complète avec gestion des paniers, paiements, authentification sécurisée et déploiement Cloud automatisé.",
    image: 'assets/ecommerce.png',
    categories: ['web', 'django'],
    tags: ['Django', 'Python', 'PostgreSQL', 'Render Cloud'],
    demoUrl: 'https://mali-sug-1.onrender.com/',
    codeUrl: 'https://github.com/Yatt-us',
    demoLabel: 'Démo Live',
    codeLabel: 'Code'
  },
  {
    id: 'livraison',
    title: 'Système de Livraison — Django',
    description: "Application web de suivi logistique en temps réel, routage des expéditions et console d'administration sécurisée.",
    image: 'assets/livraison.png',
    categories: ['web', 'django'],
    tags: ['Django', 'SQLite', 'Bootstrap', 'Logistique'],
    demoUrl: 'https://github.com/Yatt-us/Suivi_Lirasion',
    codeUrl: 'https://github.com/Yatt-us/Suivi_Lirasion',
    demoLabel: 'Aperçu',
    codeLabel: 'Code'
  },
  {
    id: 'lfat',
    title: 'Gestion Scolaire (LFAT)',
    description: "Système complet de pilotage pédagogique : gestion des inscriptions, relevés de notes, bulletins et suivi académique.",
    image: 'assets/gestionScolaire.png',
    categories: ['web'],
    tags: ['Python / Web', 'MVC', 'SQL', 'Administration'],
    demoUrl: 'https://github.com/Yatt-us/LFAT',
    codeUrl: 'https://github.com/Yatt-us/LFAT',
    demoLabel: 'Aperçu',
    codeLabel: 'Code'
  },
  {
    id: 'yattycloud',
    title: 'YattyCloud — Spring Boot & Angular',
    description: "Plateforme cloud de stockage sécurisé avec architecture de microservices, authentification JWT et conteneurisation Docker.",
    image: 'assets/profile.png',
    categories: ['web', 'cloud'],
    tags: ['Spring Boot', 'Angular', 'AWS', 'Docker'],
    demoUrl: null,
    codeUrl: 'https://github.com/Yatt-us',
    demoLabel: null,
    codeLabel: 'GitHub'
  }
];

