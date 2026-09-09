/**
 * Module de rendu dynamique des projets et compétences
 */
import { projectsData } from '../data/projects.js';
import { skillsData } from '../data/skills.js';
import { initTiltEffect } from './tiltEffect.js';

export function initProjectsRenderer() {
  const container = document.getElementById('projectsGrid');
  const filtersContainer = document.getElementById('projectFilters');

  if (!container) return;

  function renderProjects(filter = 'all') {
    container.innerHTML = '';

    const filtered = filter === 'all'
      ? projectsData
      : projectsData.filter(p => p.categories.includes(filter));

    filtered.forEach(project => {
      const article = document.createElement('article');
      article.className = 'card-project fade show';
      article.dataset.categories = project.categories.join(' ');

      const tagsHtml = project.tags
        .map(t => `<span class="tag">${t}</span>`)
        .join('');

      const demoBtn = project.demoUrl
        ? `<a class="btn btn-ghost" href="${project.demoUrl}" target="_blank" rel="noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${project.demoLabel || 'Démo'}</a>`
        : '';

      const codeBtn = project.codeUrl
        ? `<a class="btn btn-primary" href="${project.codeUrl}" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i> ${project.codeLabel || 'Code'}</a>`
        : '';

      article.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${project.image}" alt="${project.title}" loading="lazy" />
          <div class="card-overlay">
            ${project.demoUrl ? `<a class="btn btn-primary" href="${project.demoUrl}" target="_blank" rel="noreferrer"><i class="fa-solid fa-eye"></i> Voir le projet</a>` : `<a class="btn btn-primary" href="${project.codeUrl}" target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i> Code Source</a>`}
          </div>
        </div>
        <div class="card_body">
          <div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">${tagsHtml}</div>
          </div>
          <div class="card_actions">
            ${demoBtn}
            ${codeBtn}
          </div>
        </div>
      `;

      container.appendChild(article);
    });

    // Activer l'effet 3D tilt sur les cartes de projets
    initTiltEffect('.card-project');
  }

  // Initialisation des filtres de projets
  if (filtersContainer) {
    const filterButtons = filtersContainer.querySelectorAll('.filter');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.dataset.filter || 'all';
        renderProjects(filterVal);
      });
    });
  }

  // Rendu initial de tous les projets
  renderProjects('all');
}

export function initSkillsRenderer() {
  const container = document.getElementById('skillsGrid');
  const filtersContainer = document.getElementById('skillFilters');
  if (!container) return;

  function renderSkills(filter = 'all') {
    container.innerHTML = '';

    const filtered = filter === 'all'
      ? skillsData
      : skillsData.filter(s => s.category === filter);

    filtered.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card fade show';
      card.dataset.skillId = skill.id;
      card.dataset.category = skill.category;

      card.innerHTML = `
        <div class="skill-icon" style="color: ${skill.accentColor || 'var(--brand-primary)'}"><i class="${skill.icon}"></i></div>
        <div class="skill-info">
          <span>${skill.name}</span>
          <span style="color: ${skill.accentColor || 'var(--brand-primary)'}">${skill.level}</span>
        </div>
        <div class="bar">
          <span data-width="${skill.level}" style="width: ${skill.level}; background: linear-gradient(90deg, ${skill.color || '#06b6d4'}, ${skill.accentColor || '#3b82f6'})"></span>
        </div>
        <p class="skill-desc">${skill.description}</p>
      `;

      container.appendChild(card);
    });

    // Réactiver l'effet 3D tilt
    initTiltEffect('.skill-card');
  }

  if (filtersContainer) {
    const filterButtons = filtersContainer.querySelectorAll('.filter');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.dataset.filter || 'all';
        renderSkills(filterVal);
      });
    });
  }

  renderSkills('all');
}
