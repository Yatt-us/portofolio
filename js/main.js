/**
 * Point d'entrée JavaScript Principal
 * Initialise l'ensemble des modules du portfolio
 */
import { initTheme } from './modules/theme.js';
import { initParticles } from './modules/particles.js';
import { initAnimations } from './modules/animations.js';
import { initProjectsRenderer, initSkillsRenderer } from './modules/projectsRenderer.js';
import { initSkillsSphere3D } from './modules/skillsSphere3D.js';
import { initProfileOrbit3D } from './modules/profileOrbit3D.js';
import { initContactForm } from './modules/contact.js';
import { initMobileNav } from './modules/mobileNav.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initProfileOrbit3D();
  initSkillsSphere3D();
  initSkillsRenderer();
  initProjectsRenderer();
  initAnimations();
  initContactForm();
  initMobileNav();
});
