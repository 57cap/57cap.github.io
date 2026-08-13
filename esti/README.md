# ESTI — Portfolio Site

Single-page portfolio served at `https://57cap.github.io/esti/`.

## Updating content

Almost everything on the page is rendered from **`data/content.json`** — edit that file, push, and the site updates. No HTML changes needed for day-to-day updates.

- **Hero** — `name`, `tagline`, `heroLinks` (streaming/social buttons).
- **Music** — `music.featured` cards. Set `embedUrl` to a platform embed link:
  - Spotify: open a track → Share → Embed → copy the iframe `src` (looks like `https://open.spotify.com/embed/track/...`).
  - YouTube: `https://www.youtube.com/embed/VIDEO_ID`.
  - SoundCloud: Share → Embed → copy the iframe `src`.
  - `music.more` is the compact list of older releases.
- **Bio** — `bio.paragraphs` (short on-page version). The full version lives in `press/index.html`.
- **Sessions** — `sessions` array. Photos: set `src` to an image path in `img/`. Videos: set `type` to `"video"`, `src` to a thumbnail image, and `embedUrl` to a YouTube/Vimeo embed link (plays in the lightbox).
- **Community** — `community` array: one card per initiative.
- **Contact** — booking/management emails and footer social links.

## Media guidelines

- Put only **web-optimized images** in `img/` (~1600px wide max, a few hundred KB each). Audio/video stays on Spotify/SoundCloud/YouTube — never in the repo.
- Press assets (high-res photos, one-sheet PDF) go in `press/` and get linked from `press/index.html`.

## Local preview

Because content loads via `fetch`, open the site through a local server, not `file://`:

```sh
cd esti && python3 -m http.server 8000
# then visit http://localhost:8000
```
