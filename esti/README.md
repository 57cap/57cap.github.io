# ESTI — sitio

Flat static site (plain HTML + CSS + vanilla JS, no build step) built from the
Claude Design handoff (`ESTI Portfolio.dc.html`). Single page, Spanish
lowercase copy, Instagram embeds, email capture for the first release.

```
index.html        the whole page
css/styles.css    design tokens + all styles
js/site.js        scroll reveals, newsletter form, IG embed re-process
media/            self-hosted video (+ og image) — see below
```

## Before going live

1. **Pies Descalzos video** — get the file from ESTI, compress to H.264 ~720p,
   save as `media/pies-descalzos.mp4`, and export a poster frame to
   `media/pies-descalzos-poster.jpg`.
2. **Newsletter endpoint** — set `SIGNUP_ENDPOINT` at the top of `js/site.js`
   to a Buttondown / Formspree URL (or a tiny POST handler on the VPS).
   Until then the form only shows the success state and stores nothing.
3. **Footer links** — replace the `#` hrefs (instagram, tiktok, youtube,
   soundcloud, press kit) with real URLs.
4. **og:image** — add `media/og.jpg` (1200×630) and uncomment the
   `og:image` meta tag in `index.html`.

## Updating content

- **Swap an Instagram embed**: change the `data-instgrm-permalink` URL on the
  corresponding `<blockquote class="instagram-media">` in `index.html`.
- **Add items to `creando:`**: copy a `<figure class="grid-item">` block and
  follow the span rhythm (5/7/4/8…) via the `span-*` classes; add a matching
  class in `styles.css` if a new span width is needed. On mobile everything
  goes full-width automatically.
- Note: Instagram embeds only render on an allowed origin (localhost or a real
  domain) — not from `file://`.

## Hosting on a VPS

Any static server works. Copy this folder to the server (e.g.
`rsync -av esti/ user@vps:/var/www/esti/`) and serve it.

nginx:

```nginx
server {
    listen 80;
    server_name example.com;   # your domain
    root /var/www/esti;
    index index.html;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location /media/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Caddy (automatic HTTPS):

```
example.com {
    root * /var/www/esti
    file_server
    encode gzip
    @media path /media/*
    header @media Cache-Control "public, max-age=31536000, immutable"
}
```

Quick local preview: `python3 -m http.server 8000` in this folder, then open
http://localhost:8000.
