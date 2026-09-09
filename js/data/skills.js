/**
 * Données complètes des compétences techniques
 * Intègre les coordonnées de style, couleurs 3D et descriptions pour le module 3D.
 */
export const skillsData = [
  // Mobile
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'mobile',
    level: '90%',
    color: '#02569B',
    accentColor: '#00C7FF',
    icon: 'fa-solid fa-mobile-screen',
    description: 'Développement cross-platform iOS & Android, architecture Bloc/Provider, animations fluides.'
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'mobile',
    level: '85%',
    color: '#0175C2',
    accentColor: '#00b4d8',
    icon: 'fa-solid fa-code',
    description: 'Programmation orientée objet, asynchrone (Streams/Futures), typage strict.'
  },

  // Backend
  {
    id: 'spring',
    name: 'Spring Boot',
    category: 'backend',
    level: '82%',
    color: '#6DB33F',
    accentColor: '#84cc16',
    icon: 'fa-brands fa-java',
    description: 'Microservices, Spring Security, JPA/Hibernate, conception d\'APIs RESTful performantes.'
  },
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    level: '85%',
    color: '#E76F00',
    accentColor: '#fb923c',
    icon: 'fa-brands fa-java',
    description: 'Architecture logicielle robuste, multithreading, programmation fonctionnelle et orientée objet.'
  },
  {
    id: 'django',
    name: 'Django & Python',
    category: 'backend',
    level: '85%',
    color: '#092E20',
    accentColor: '#10b981',
    icon: 'fa-brands fa-python',
    description: 'Développement web rapide, Django ORM, authentification, architecture MVC et sécurité intégrée.'
  },

  // Frontend
  {
    id: 'angular',
    name: 'Angular & TS',
    category: 'frontend',
    level: '80%',
    color: '#DD0031',
    accentColor: '#f43f5e',
    icon: 'fa-brands fa-angular',
    description: 'SPAs réactives, RxJS, composants modulaires, injection de dépendances et TypeScript avancé.'
  },
  {
    id: 'web',
    name: 'HTML5 / CSS3 / Modern Web',
    category: 'frontend',
    level: '90%',
    color: '#E34F26',
    accentColor: '#06b6d4',
    icon: 'fa-brands fa-html5',
    description: 'Design responsive, animations CSS3, flexbox, grid, glassmorphism et accessibilité.'
  },

  // Base de données
  {
    id: 'database',
    name: 'PostgreSQL & MySQL',
    category: 'database',
    level: '82%',
    color: '#336791',
    accentColor: '#38bdf8',
    icon: 'fa-solid fa-database',
    description: 'Modélisation relationnelle, requêtes complexes optimisées, indexation et intégrité transactionnelle.'
  },

  // Cloud & DevOps
  {
    id: 'aws',
    name: 'AWS Cloud',
    category: 'cloud',
    level: '75%',
    color: '#FF9900',
    accentColor: '#fbbf24',
    icon: 'fa-brands fa-aws',
    description: 'Déploiement EC2, S3, RDS, gestion IAM et architectures cloud scalables.'
  },
  {
    id: 'docker',
    name: 'Docker & Conteneurs',
    category: 'cloud',
    level: '78%',
    color: '#2496ED',
    accentColor: '#60a5fa',
    icon: 'fa-brands fa-docker',
    description: 'Conteneurisation d\'applications, Docker Compose et automatisation des environnements de dev.'
  },
  {
    id: 'devops',
    name: 'Git, Linux & Réseaux',
    category: 'cloud',
    level: '85%',
    color: '#F05032',
    accentColor: '#a855f7',
    icon: 'fa-brands fa-git-alt',
    description: 'Gestion de versions Git, administration serveurs Linux (Ubuntu), configurations réseau.'
  },

  // UI/UX Design
  {
    id: 'figma',
    name: 'Figma UI/UX',
    category: 'frontend',
    level: '80%',
    color: '#F24E1E',
    accentColor: '#ec4899',
    icon: 'fa-brands fa-figma',
    description: 'Prototypage d\'interfaces interactives, wireframing, design systems et ergonomie utilisateur.'
  }
];
