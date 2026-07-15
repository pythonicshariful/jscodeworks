/* Main JavaScript Application Logic */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Loading Intro Screen Handler
  const loader = document.getElementById('loader-screen');
  const progressFill = document.querySelector('.loader-progress-fill');
  
  if (loader && progressFill) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 10;
      if (progress >= 100) {
        progress = 100;
        progressFill.style.width = '100%';
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          if (window.AudioEngine) window.AudioEngine.playIntroSynth();
        }, 600);
      } else {
        progressFill.style.width = `${progress}%`;
      }
    }, 120);
  }

  // 2. Navbar Scroll Effects
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Contact Form AJAX Submission
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting...';
      if (contactStatus) contactStatus.innerHTML = '';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();

        if (res.ok && json.status === 'success') {
          if (contactStatus) {
            contactStatus.innerHTML = `<div style="color: #10B981; margin-top: 16px; padding: 12px; background: rgba(16,185,129,0.1); border: 1px solid #10B981; border-radius: 8px;">✓ ${json.message}</div>`;
          }
          contactForm.reset();
        } else {
          if (contactStatus) {
            contactStatus.innerHTML = `<div style="color: #EF4444; margin-top: 16px; padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; border-radius: 8px;">✗ ${json.message || 'Transmission failed.'}</div>`;
          }
        }
      } catch (err) {
        if (contactStatus) {
          contactStatus.innerHTML = `<div style="color: #EF4444; margin-top: 16px; padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; border-radius: 8px;">Network connection error. Please try again.</div>`;
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});
