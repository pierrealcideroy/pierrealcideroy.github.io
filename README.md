# pierreantoineroy.com

Personal site of Pierre-Antoine Roy, served by GitHub Pages (domain in `CNAME`). Plain HTML, CSS and JavaScript: no framework, no build step.

| File | Role |
|---|---|
| `index.html` | Home page: intro, hero, Now, Experience, side column, footer |
| `404.html` | "Spilled" page for unknown addresses |
| `assets/site.css` | All styles. Colours are tokens at the top (light, then dark) |
| `assets/site.js` | Command palette (⌘K, or the Commands pill on phones), resume as JSON, theme switch, email copy, confetti, Konami code, local time, last update |
| `assets/intro.js` | PA logo that writes itself on load |
| `spiller/privacy/` | Spiller! privacy policy (linked from the App Store and Google Play) |
| `app-ads.txt` | AdMob seller declaration for Spiller! |
| `robots.txt`, `sitemap.xml` | Crawlers welcome (AI included), list of pages |
| `llms.txt` | Plain-text summary of who I am, for AI assistants |

The JSON-LD block in the `<head>` of `index.html` describes me for search engines: keep it in sync with the page.

Drafts to rewrite are marked `DRAFT` in `index.html`. The hidden `#writing` section is ready for the future Substack feed.

Edit, commit, push to `main`: the site updates in about a minute.
