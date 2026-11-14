// Apple Music developer token: a JWT signed with your MusicKit private key (ES256). No dependencies.
// Used by fetch.mjs (GitHub Action) and, from the command line, to get a token for auth.html:
//   node tools/music/token.mjs ~/path/AuthKey_XXXXXXXXXX.p8 KEY_ID TEAM_ID
import crypto from 'node:crypto';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const b64url = (data) => Buffer.from(data).toString('base64url');

export function developerToken(privateKeyPem, keyId, teamId, seconds = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'ES256', kid: keyId }));
  const payload = b64url(JSON.stringify({ iss: teamId, iat: now, exp: now + seconds }));
  const signature = crypto.sign('sha256', Buffer.from(`${header}.${payload}`),
    { key: privateKeyPem, dsaEncoding: 'ieee-p1363' }); // JWT wants the raw r||s signature
  return `${header}.${payload}.${b64url(signature)}`;
}

// Command line: prints a token valid for 1 day (enough to authorize once in auth.html).
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [keyPath, keyId, teamId] = process.argv.slice(2);
  if (!keyPath || !keyId || !teamId) {
    console.error('Usage: node tools/music/token.mjs AuthKey.p8 KEY_ID TEAM_ID');
    process.exit(1);
  }
  console.log(developerToken(fs.readFileSync(keyPath, 'utf8'), keyId, teamId, 86400));
}
