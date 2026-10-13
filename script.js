(() => {
  const intro = document.getElementById('intro');
  const skip = document.getElementById('skipIntro');
  const hideIntro = () => { if (intro) intro.classList.add('hide'); };
  if (sessionStorage.getItem('vkIntroSeen') === '1') hideIntro();
  const dismissIntro = () => { hideIntro(); sessionStorage.setItem('vkIntroSeen', '1'); };
  skip?.addEventListener('click', dismissIntro);
  window.setTimeout(dismissIntro, 2800);

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); if (toggle) toggle.textContent = '☰';
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('feedbackForm')?.addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('formResult').textContent = 'Demo preview only — nothing was sent or saved.';
  });
})();
