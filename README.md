# pierreantoineroy.com

Personal site of Pierre-Antoine Roy, served by GitHub Pages (domain in `CNAME`). Plain HTML, CSS and JavaScript: no framework, no build step.

| File | Role |
|---|---|
| `index.html` | Home page: intro, hero, Now, Experience, side column, footer |
| `404.html` | "Spilled" page for unknown addresses |
| `assets/site.css` | All styles. Colours are tokens at the top (light, then dark) |
| `assets/site.js` | Command palette (⌘K, or the Commands pill on phones), resume as JSON, theme switch, email copy, confetti, Konami code, local time, last update |
| `assets/logos/` | Company logos, 256 x 256 PNG, named after the company (missing file = initials shown) |
| `#bluesky` section | 3 latest Bluesky posts (no reposts or replies), read live from Bluesky's public API by `assets/site.js` |
| `assets/intro.js` | PA logo that writes itself on load |
| `spiller/` | Spiller! page: trailer, screenshots, pouring sets, support and FAQ (media in `spiller/media/`) |
| `spiller/get/` | Smart link for Instagram and posters: iPhone to the App Store (tag `?from=instagram` becomes the campaign), others to the Spiller page |
| `spiller/privacy/` | Spiller! privacy policy (linked from the App Store and Google Play) |
| `app-ads.txt` | AdMob seller declaration for Spiller! |
| `robots.txt`, `sitemap.xml` | Crawlers welcome (AI included), list of pages |
| `llms.txt` | Plain-text summary of who I am, for AI assistants |

The JSON-LD block in the `<head>` of `index.html` describes me for search engines: keep it in sync with the page.

Share image of the home page: `assets/og.jpg`, made from `tools/og/og.html`. To redo it, edit the HTML, then run `swift tools/og/snap.swift "$PWD/tools/og" og.png` (it renders at 2x), and `sips -z 630 1200 og.png` before saving it as `assets/og.jpg`.

The hidden `#writing` section is ready for the future Substack feed.

CSS and JS links carry a version tag (`?v=…`): bump it in `index.html`, `spiller/index.html` and `404.html` when you change `assets/`, so browsers fetch the new file.

Edit, commit, push to `main`: the site updates in about a minute.

## Recently played (Apple Music)

`.github/workflows/music.yml` runs every 3 hours: `tools/music/fetch.mjs` asks the Apple Music API for my recently played albums and commits `assets/music.json`, which the home page reads. The section stays hidden while that file doesn't exist.

Repository secrets (Settings > Secrets and variables > Actions): `MUSICKIT_PRIVATE_KEY` (content of the .p8 key), `MUSICKIT_KEY_ID`, `APPLE_TEAM_ID`, `MUSIC_USER_TOKEN`.
The Music User Token expires about every 6 months: run `node tools/music/token.mjs AuthKey.p8 KEY_ID TEAM_ID`, paste the result in `tools/music/auth.html` (open it locally), authorize, and update the secret.

## Ideas for later

- Mini-game: a one-glass version of Spiller! on the home page (hold to pour, release on the line, confetti on a Perfect, App Store badge). Built and removed on 2026-11-14 (commit 3646dda has the code); PA prefers a Substack or Bluesky feed there for now.
