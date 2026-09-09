/**
 * Données centralisées des projets du Portfolio
 * Permet d'ajouter ou modifier un projet sans toucher au balisage HTML.
 */
export const projectsData = [
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

