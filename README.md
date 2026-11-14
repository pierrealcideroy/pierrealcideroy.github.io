# pierreantoineroy.com

Personal site of Pierre-Antoine Roy, served by GitHub Pages (domain in `CNAME`). Plain HTML, CSS and JavaScript: no framework, no build step.

| File | Role |
|---|---|
| `index.html` | Home page: intro, hero, Now, Experience, side column, footer |
| `404.html` | "Spilled" page for unknown addresses |
| `assets/site.css` | All styles. Colours are tokens at the top (light, then dark) |
| `assets/site.js` | Command palette (⌘K, or the Commands pill on phones), resume as JSON, theme switch, email copy, confetti, Konami code, local time, last update |
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
