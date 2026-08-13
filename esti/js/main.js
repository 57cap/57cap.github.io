/* Renders the ESTI portfolio from data/content.json.
   To update the site, edit the JSON — this file shouldn't need changes. */

const $ = (id) => document.getElementById(id);

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

async function init() {
  const res = await fetch('data/content.json');
  const c = await res.json();

  renderHero(c);
  renderMusic(c.music);
  renderBio(c.bio);
  renderSessions(c.sessions);
  renderCommunity(c.community);
  renderContact(c.contact);
  $('year').textContent = new Date().getFullYear();
}

function renderHero(c) {
  $('hero-name').textContent = c.name;
  $('hero-tagline').textContent = c.tagline;
  const links = $('hero-links');
  for (const link of c.heroLinks || []) {
    const a = el('a', null, link.label);
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    links.appendChild(a);
  }
}

function renderMusic(music) {
  const grid = $('music-featured');
  for (const track of music.featured || []) {
    const card = el('article', 'track-card');
    const embed = el('div', 'track-embed');
    if (track.embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = track.embedUrl;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      embed.appendChild(iframe);
    } else {
      embed.appendChild(el('div', 'track-placeholder', 'Embed coming soon'));
    }
    const info = el('div', 'track-info');
    info.appendChild(el('h3', null, track.title));
    if (track.description) info.appendChild(el('p', null, track.description));
    card.append(embed, info);
    grid.appendChild(card);
  }

  const list = $('music-more');
  for (const item of music.more || []) {
    const li = el('li');
    const a = el('a');
    a.href = item.url || '#';
    a.target = '_blank';
    a.rel = 'noopener';
    a.appendChild(el('span', null, item.title));
    a.appendChild(el('span', 'more-year', item.year || ''));
    li.appendChild(a);
    list.appendChild(li);
  }
  if (!(music.more || []).length) list.remove();
}

function renderBio(bio) {
  const body = $('bio-paragraphs');
  for (const p of bio.paragraphs || []) body.appendChild(el('p', null, p));
  const btn = $('bio-presskit');
  btn.href = bio.pressKitUrl || '#';
  if (bio.pressKitLabel) btn.textContent = bio.pressKitLabel;
}

function renderSessions(sessions) {
  const gallery = $('sessions-gallery');
  for (const item of sessions || []) {
    const btn = el('button', 'gallery-item');
    btn.type = 'button';
    if (item.src) {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || '';
      img.loading = 'lazy';
      btn.appendChild(img);
    } else {
      btn.appendChild(el('div', 'gallery-placeholder', item.type === 'video' ? '🎬' : '📷'));
    }
    if (item.type === 'video') btn.appendChild(el('span', 'gallery-play', 'VIDEO'));
    const meta = el('div', 'gallery-meta', item.caption || '');
    if (item.date) meta.appendChild(el('span', null, item.date));
    btn.appendChild(meta);
    btn.addEventListener('click', () => openLightbox(item));
    gallery.appendChild(btn);
  }
}

function renderCommunity(initiatives) {
  const grid = $('community-grid');
  for (const item of initiatives || []) {
    const card = el('article', 'community-card');
    const image = el('div', 'card-image');
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.loading = 'lazy';
      image.appendChild(img);
    } else {
      image.textContent = '🤝';
    }
    const body = el('div', 'card-body');
    body.appendChild(el('h3', null, item.name));
    body.appendChild(el('p', null, item.description));
    if (item.url) {
      const a = el('a', 'card-link', (item.linkLabel || 'Learn more') + ' →');
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener';
      body.appendChild(a);
    }
    card.append(image, body);
    grid.appendChild(card);
  }
}

function renderContact(contact) {
  const block = $('contact-block');
  const addEmail = (label, email) => {
    if (!email) return;
    block.appendChild(el('div', 'contact-label', label));
    const a = el('a', null, email);
    a.href = 'mailto:' + email;
    block.appendChild(a);
  };
  addEmail('Booking', contact.booking);
  addEmail('Management', contact.management);

  const socials = $('footer-socials');
  for (const s of contact.socials || []) {
    const a = el('a', null, s.label);
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    socials.appendChild(a);
  }
}

/* ---------- Lightbox ---------- */

const lightbox = $('lightbox');
const lightboxContent = $('lightbox-content');
const lightboxCaption = $('lightbox-caption');

function openLightbox(item) {
  lightboxContent.replaceChildren();
  if (item.type === 'video' && item.embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = item.embedUrl;
    iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    lightboxContent.appendChild(iframe);
  } else if (item.src) {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || '';
    lightboxContent.appendChild(img);
  } else {
    return; // placeholder with no media — nothing to show
  }
  lightboxCaption.textContent = [item.caption, item.date].filter(Boolean).join(' · ');
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxContent.replaceChildren(); // stops any playing video
  document.body.style.overflow = '';
}

$('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

init();
