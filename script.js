const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');

  if (document.body.classList.contains('light')) {
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌙';
  }
});

window.addEventListener('scroll', () => {
  document.querySelectorAll('.card, .project-card').forEach(card => {
    const position = card.getBoundingClientRect().top;
    const screen = window.innerHeight;

    if (position < screen - 100) {
      card.style.transform = 'translateY(0px)';
      card.style.opacity = '1';
    }
  });
});
