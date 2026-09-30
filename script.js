const root = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
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

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu?.classList.contains('is-open')) closeMenu(true);
});

window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});

function currentTheme() {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function syncThemeControl(theme) {
  const next = theme === 'dark' ? 'light' : 'dark';
  themeToggle?.setAttribute('aria-label', `Switch to ${next} theme`);
  themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    /* private mode */
  }
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

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    const target = href && document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: motionPreference.matches ? 'instant' : 'smooth',
      block: 'start',
    });
    history.pushState(null, '', href);
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const tagged = document.querySelectorAll('[data-tags]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach((item) => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    tagged.forEach((card) => {
      const tags = (card.dataset.tags || '').split(/\s+/);
      card.hidden = filter !== 'all' && !tags.includes(filter);
    });
  });
});

function revealCards() {
  const cards = document.querySelectorAll('.reveal');
  if (motionPreference.matches) {
    cards.forEach((card) => card.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, current) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        current.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  cards.forEach((card) => observer.observe(card));
}

revealCards();
