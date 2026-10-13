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
    previewImage.src = previewUrl;
    fileName.textContent = file.name;
    previewWrap.hidden = false;
    if (result) result.textContent = 'Photo selected for local demo preview.';
  });
  removePhoto?.addEventListener('click', clearPhoto);
  feedbackForm?.addEventListener('submit', event => {
    event.preventDefault();
    const hasPhoto = Boolean(photoInput?.files?.length);
    document.getElementById('formResult').textContent = hasPhoto
      ? 'Demo preview only — message and photo were not sent or saved.'
      : 'Demo preview only — nothing was sent or saved.';
  });
})();
