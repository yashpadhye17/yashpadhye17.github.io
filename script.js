const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu(returnFocus = false) {
  navMenu?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
  if (returnFocus) navToggle?.focus();
}

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navMenu?.classList.toggle('is-open', open);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navMenu?.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navbar')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'start' });
    history.pushState(null, '', href);
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('[data-tags]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.tags.split(/\s+/).includes(filter);
    });
    const archive = document.querySelector('.archive-grid');
    const archiveTitle = document.querySelector('.archive-title');
    const archiveVisible = [...archive.querySelectorAll('[data-tags]')].some(card => !card.hidden);
    archive.hidden = !archiveVisible;
    archiveTitle.hidden = !archiveVisible;
    document.querySelectorAll('.showcase-grid, .project-grid').forEach(grid => {
      grid.hidden = ![...grid.children].some(card => !card.hidden);
    });
  });
});
