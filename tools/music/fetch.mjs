// Fetches my recently played albums from the Apple Music API and writes assets/music.json.
// Runs in GitHub Actions (.github/workflows/music.yml). The keys come from repository secrets and never
// reach the website: the page only reads the public list of albums.
import fs from 'node:fs';
import { developerToken } from './token.mjs';

const { MUSICKIT_PRIVATE_KEY, MUSICKIT_KEY_ID, APPLE_TEAM_ID, MUSIC_USER_TOKEN } = process.env;
if (!MUSICKIT_PRIVATE_KEY || !MUSICKIT_KEY_ID || !APPLE_TEAM_ID || !MUSIC_USER_TOKEN) {
  // Not set up yet: skip quietly instead of failing every 3 hours.
  console.log('Secrets not set yet (MUSICKIT_PRIVATE_KEY, MUSICKIT_KEY_ID, APPLE_TEAM_ID, MUSIC_USER_TOKEN): skipping.');
  process.exit(0);
}

const res = await fetch('https://api.music.apple.com/v1/me/recent/played?limit=10', {
  headers: {
    Authorization: `Bearer ${developerToken(MUSICKIT_PRIVATE_KEY, MUSICKIT_KEY_ID, APPLE_TEAM_ID)}`,
    'Music-User-Token': MUSIC_USER_TOKEN,
  },
});
if (res.status === 401 || res.status === 403) {
  console.error('Apple refused the tokens: the Music User Token has probably expired (about every 6 months). Run tools/music/auth.html again.');
  process.exit(1);
}
if (!res.ok) { console.error('Apple Music API error', res.status, await res.text()); process.exit(1); }

const { data = [] } = await res.json();
const albums = data
  .filter((item) => item.type === 'albums' || item.type === 'library-albums')
  .map(({ attributes: a = {} }) => ({
    name: a.name,
    artist: a.artistName,
    artwork: a.artwork && a.artwork.url ? a.artwork.url.replace('{w}', '300').replace('{h}', '300') : null,
    url: a.url || null,
  }))
  .filter((a) => a.name && a.artwork)
  .slice(0, 6);

const file = 'assets/music.json';
const before = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')).albums : null;
if (JSON.stringify(before) === JSON.stringify(albums)) { console.log('No change.'); process.exit(0); }
fs.writeFileSync(file, JSON.stringify({ updated: new Date().toISOString(), albums }, null, 1) + '\n');
console.log(`Wrote ${albums.length} albums.`);
