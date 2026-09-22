const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const plainToggle = document.querySelector('.plain-toggle');
const idCard = document.querySelector('.id-card');
const idBack = document.querySelector('#id-back');
const flipBack = document.querySelector('[data-flip-back]');
const sheet = document.querySelector('#contact-sheet');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let clicks = 0;

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

document.addEventListener('click', event => {
  if (!event.target.closest('.navbar')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

function currentTheme() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function syncThemeControl(theme) {
  themeToggle?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (error) { /* ignore */ }
  syncThemeControl(theme);
}

themeToggle?.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  const swap = () => applyTheme(next);
  if (document.startViewTransition && !motionPreference.matches) {
    document.startViewTransition(swap);
    return;
  }
  swap();
});
syncThemeControl(currentTheme());

function syncPlain() {
  const on = root.getAttribute('data-plain') === 'true';
  plainToggle?.setAttribute('aria-pressed', String(on));
  if (plainToggle) plainToggle.textContent = on ? 'Designed mode' : 'Plain mode';
}

plainToggle?.addEventListener('click', () => {
  const on = root.getAttribute('data-plain') === 'true';
  root.toggleAttribute('data-plain', !on);
  try { localStorage.setItem('plain', on ? '0' : '1'); } catch (error) { /* ignore */ }
  syncPlain();
});
syncPlain();

idCard?.addEventListener('click', () => {
  const open = idCard.getAttribute('aria-expanded') !== 'true';
  idCard.setAttribute('aria-expanded', String(open));
  idBack.hidden = !open;
});
flipBack?.addEventListener('click', () => {
  idCard?.setAttribute('aria-expanded', 'false');
  if (idBack) idBack.hidden = true;
  idCard?.focus();
});

document.querySelectorAll('.track-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const row = button.closest('.track-row');
    const open = !row.classList.contains('is-open');
    document.querySelectorAll('.track-row').forEach(item => {
      item.classList.toggle('is-open', item === row && open);
      item.querySelector('.track-toggle')?.setAttribute('aria-expanded', String(item === row && open));
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const href = anchor.getAttribute('href');
    const target = href && document.getElementById(href.slice(1));
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
const tagged = document.querySelectorAll('[data-tags]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    tagged.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.tags.split(/\s+/).includes(filter);
    });
  });
});

function openSheet() {
  if (typeof sheet.showModal === 'function' && !sheet.open) sheet.showModal();
}

document.querySelector('[data-close-sheet]')?.addEventListener('click', () => sheet.close());
sheet?.addEventListener('click', event => {
  if (event.target === sheet) sheet.close();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (navMenu?.classList.contains('is-open')) closeMenu(true);
    if (sheet?.open) sheet.close();
  }
});

document.addEventListener('click', event => {
  if (event.target.closest('a, button, summary, input, textarea')) {
    clicks += 1;
    if (clicks === 10) {
      const label = document.querySelector('#click-count-label');
      if (label) label.textContent = '10+ clicks.';
      openSheet();
    }
  }
});
