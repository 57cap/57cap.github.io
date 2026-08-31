/* ESTI — reveals, newsletter form, Instagram embed re-process */

/* Set to your newsletter endpoint (Buttondown, Formspree, or a tiny POST
   handler on the VPS) to actually store emails. Left empty, the form only
   shows the success state. */
const SIGNUP_ENDPOINT = '';

/* ---------- scroll reveal ---------- */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0px)';
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // only animate blocks that start below ~92% of the viewport
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition =
        'opacity 0.8s cubic-bezier(0.2,0.6,0.2,1), transform 0.8s cubic-bezier(0.2,0.6,0.2,1)';
      requestAnimationFrame(() => observer.observe(el));
    }
  });
}

/* ---------- newsletter ---------- */

const form = document.getElementById('signup-form');
const emailInput = document.getElementById('signup-email');
const success = document.getElementById('signup-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    emailInput.focus();
    return;
  }
  if (SIGNUP_ENDPOINT) {
    fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      keepalive: true
    }).catch(() => {});
  }
  form.hidden = true;
  success.hidden = false;
});

/* ---------- pies video fallback ---------- */

/* if media/pies-descalzos.mp4 isn't on the server yet, show a styled
   placeholder instead of a broken player */
const piesVideo = document.querySelector('.video-wrap video');
piesVideo.addEventListener('error', () => {
  const wrap = piesVideo.closest('.video-wrap');
  piesVideo.remove();
  const fb = document.createElement('div');
  fb.className = 'video-fallback';
  fb.innerHTML = '<span class="play-ring">▶</span><span class="fallback-label">video del proyecto — pronto</span>';
  wrap.prepend(fb);
});

/* ---------- instagram embeds ---------- */

/* embed.js processes blockquotes on load; poll briefly in case it
   arrives after DOMContentLoaded */
let tries = 0;
const igTimer = setInterval(() => {
  tries++;
  if (window.instgrm && window.instgrm.Embeds) {
    try { window.instgrm.Embeds.process(); } catch (e) {}
    clearInterval(igTimer);
  } else if (tries > 24) {
    clearInterval(igTimer);
  }
}, 500);
