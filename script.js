(() => {
  const intro = document.getElementById('intro');
  const introVideo = document.getElementById('introVideo');
  const skip = document.getElementById('skipIntro');
  const seenKey = 'vkIntroSeen_v15';
  let introTimer = null;

  const hideIntro = () => {
    if (intro) intro.classList.add('hide');
    if (introVideo) introVideo.pause();
  };
  const dismissIntro = () => {
    hideIntro();
    try { sessionStorage.setItem(seenKey, '1'); } catch (_) {}
    if (introTimer) window.clearTimeout(introTimer);
  };
  const scheduleDismiss = (delay) => {
    if (introTimer) window.clearTimeout(introTimer);
    introTimer = window.setTimeout(dismissIntro, delay);
  };

  let introSeen = false;
  try { introSeen = sessionStorage.getItem(seenKey) === '1'; } catch (_) {}
  if (introSeen) {
    hideIntro();
  } else {
    // The video is muted for reliable autoplay; the fallback prevents a stalled intro.
    scheduleDismiss(6500);
    introVideo?.addEventListener('ended', () => scheduleDismiss(900), { once: true });
    introVideo?.addEventListener('error', () => scheduleDismiss(1600), { once: true });
    const playAttempt = introVideo?.play();
    if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
  }
  skip?.addEventListener('click', dismissIntro);

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '☰';
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const feedbackForm = document.getElementById('feedbackForm');
  const photoInput = document.getElementById('photoAttachment');
  const previewWrap = document.getElementById('attachmentPreview');
  const previewImage = document.getElementById('attachmentPreviewImage');
  const fileName = document.getElementById('attachmentFileName');
  const removePhoto = document.getElementById('removeAttachment');
  let previewUrl = null;
  const clearPhoto = () => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    if (photoInput) photoInput.value = '';
    if (previewImage) previewImage.removeAttribute('src');
    if (fileName) fileName.textContent = '';
    if (previewWrap) previewWrap.hidden = true;
  };
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    const result = document.getElementById('formResult');
    if (!file) { clearPhoto(); return; }
    if (!file.type.startsWith('image/')) {
      clearPhoto(); if (result) result.textContent = 'Please select an image file.'; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      clearPhoto(); if (result) result.textContent = 'Please choose an image smaller than 5 MB.'; return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    if (previewImage) previewImage.src = previewUrl;
    if (fileName) fileName.textContent = file.name;
    if (previewWrap) previewWrap.hidden = false;
    if (result) result.textContent = 'Photo selected for local demo preview.';
  });
  removePhoto?.addEventListener('click', clearPhoto);
  feedbackForm?.addEventListener('submit', event => {
    event.preventDefault();
    const hasPhoto = Boolean(photoInput?.files?.length);
    const result = document.getElementById('formResult');
    if (result) result.textContent = hasPhoto
      ? 'Demo preview only — message and photo were not sent or saved.'
      : 'Demo preview only — nothing was sent or saved.';
  });
})();
