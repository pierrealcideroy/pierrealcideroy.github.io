// pierreantoineroy.com: the small developer quirks. No framework, nothing to build.
(function () {
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };

  // ---- Toast ----
  var toastEl = document.createElement('div');
  toastEl.className = 'toast'; toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);
  var toastTimer;
  function toast(msg, ms) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, ms || 2200);
  }

  // ---- Email: first click copies, a second click within 3 s opens the mail app ----
  var armed = null;
  function copyEmail(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Copied ✓  click again to open mail'); }, function () { location.href = 'mailto:' + text; });
    else location.href = 'mailto:' + text;
  }
  $$('[data-copy]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (armed === a) return; // second click: let the mailto link open
      e.preventDefault(); armed = a; setTimeout(function () { if (armed === a) armed = null; }, 3000);
      copyEmail(a.dataset.copy);
    });
  });

  // ---- Theme: follows the system until the visitor picks one ----
  function currentTheme() { return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    toast(next === 'dark' ? 'Lights off' : 'Lights on');
  }
  var themeBtn = $('#theme'); if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // ---- Photo: black and white like the CV, colour on hover or tap ----
  var photo = $('.photo'); if (photo) photo.addEventListener('click', function () { photo.classList.toggle('color'); });

  // ---- Resume as JSON, read from the page itself (one source of truth) ----
  function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : undefined; }
  function resume() {
    var h1 = $('h1');
    return {
      name: 'Pierre-Antoine Roy',
      headline: h1 ? text(h1).split('—').slice(1).join('—').trim() : undefined,
      about: text($('.lede')),
      contact: { email: 'hello@pierreantoineroy.com', linkedin: 'https://www.linkedin.com/in/pierre-antoine-roy', bluesky: 'https://bsky.app/profile/pierreantoineroy.com', x: 'https://x.com/pierrealcideroy', github: 'https://github.com/pierrealcideroy', website: 'https://pierreantoineroy.com' },
      now: $$('[data-now]').map(function (c) { return { project: c.dataset.now, status: text($('.meta', c)) }; }),
      experience: $$('.job').map(function (j) {
        var meta = text($('.meta', j)).split('|');
        var h3 = $('h3', j).cloneNode(true), at = $('.at', h3), company = at ? at.textContent.replace(/^@/, '').trim() : undefined;
        var tag = $('.tag', h3), status = tag ? text(tag).toLowerCase() : undefined;
        if (at) at.remove(); if (tag) tag.remove();
        var p = $(':scope > p', j);
        return { role: text(h3), company: company, companyUrl: at && at.href ? at.href : undefined, status: status,
                 type: meta[0].trim(), dates: (meta[1] || '').trim(),
                 summary: p ? text(p) : undefined, highlights: $$('.ups li', j).map(text) };
      }),
      skills: $$('#skills li').map(text),
      tools: $$('#tools li').map(text),
      education: $$('#qualifications h4').map(function (h) { return { title: text(h), details: text(h.nextElementSibling) }; }),
      languages: ['French', 'English', 'Spanish']
    };
  }
  function highlight(json) {
    return json.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/("(?:\\.|[^"\\])*")(\s*:)?/g, function (m, s, colon) { return colon ? '<span class="k">' + s + '</span><span class="p">:</span>' : '<span class="s">' + s + '</span>'; })
      .replace(/([{}\[\],])/g, '<span class="p">$1</span>');
  }
  var jsonDlg;
  function showJson() {
    if (!jsonDlg) {
      jsonDlg = document.createElement('dialog'); jsonDlg.className = 'json';
      jsonDlg.innerHTML = '<header><span>resume.json</span><span><button class="btn" type="button" data-act="copy">Copy</button> <button class="btn" type="button" data-act="close" aria-label="Close">✕</button></span></header><pre></pre>';
      jsonDlg.addEventListener('click', function (e) {
        var act = e.target.closest('[data-act]');
        if (e.target === jsonDlg || (act && act.dataset.act === 'close')) jsonDlg.close();
        if (act && act.dataset.act === 'copy') navigator.clipboard.writeText(JSON.stringify(resume(), null, 2)).then(function () { toast('resume.json copied ✓'); });
      });
      document.body.appendChild(jsonDlg);
    }
    $('pre', jsonDlg).innerHTML = highlight(JSON.stringify(resume(), null, 2));
    jsonDlg.showModal();
  }
  $$('[data-json]').forEach(function (b) { b.addEventListener('click', showJson); });

  // ---- Konami code (or the "pour" command): the screen fills like a glass ----
  var pouring = false;
  function pour() {
    if (pouring || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pouring = true;
    var box = document.createElement('div'); box.className = 'pour';
    box.innerHTML = '<div class="liquid"></div><div class="word">Perfect!</div>';
    document.body.appendChild(box);
    var liquid = $('.liquid', box), word = $('.word', box);
    liquid.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(10%)' }], { duration: 1500, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' }).finished.then(function () {
      word.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.3,1.6,.5,1)', fill: 'forwards' });
      return new Promise(function (r) { setTimeout(r, 900); });
    }).then(function () {
      word.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' });
      return liquid.animate([{ transform: 'translateY(10%)' }, { transform: 'translateY(100%)' }], { duration: 900, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }).finished;
    }).then(function () { box.remove(); pouring = false; toast('You would be good at Spiller!'); });
  }
  var konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], kpos = 0;
  addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
    if (kpos === konami.length) { kpos = 0; pour(); }
  });

  // ---- Confetti: two cannons in the bottom corners fire towards the middle, then the paper flutters down ----
  var confettiRunning = false;
  function confetti() {
    if (confettiRunning || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confettiRunning = true;
    var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:75';
    document.body.appendChild(cv);
    var dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    var colors = ['#ff5e5b', '#ffbe0b', '#2ec4b6', '#3a86ff', '#8338ec', '#ff006e', '#06d6a0', '#fb5607'];
    var parts = [], N = Math.round(Math.min(220, 110 + W / 8)); // per cannon and per wave
    var power = Math.sqrt(H) * 1.3; // the strongest pieces reach the top of the screen
    function cannon(x, dir) {
      for (var i = 0; i < N; i++) {
        var angle = (-90 + dir * (18 + Math.random() * 32)) * Math.PI / 180; // up and towards the middle
        var speed = power * (0.5 + Math.random() * 0.65);
        parts.push({ x: x, y: H + 10, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, round: Math.random() < .25,
          rot: Math.random() * 6.28, spin: (Math.random() - .5) * .3, flip: Math.random() * 6.28, flipSpeed: .08 + Math.random() * .12,
          sway: Math.random() * 6.28, color: colors[(Math.random() * colors.length) | 0] });
      }
    }
    // Three waves, so the screen stays covered for a few seconds.
    cannon(0, 1); cannon(W, -1);
    [280, 560].forEach(function (t) { setTimeout(function () { cannon(0, 1); cannon(W, -1); }, t); });
    var last = performance.now();
    function tick(now) {
      var dt = Math.min(2.5, (now - last) / 16.67); last = now; // 1 = one 60 fps frame
      ctx.clearRect(0, 0, W, H);
      var alive = 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vx *= Math.pow(0.985, dt); p.vy = p.vy * Math.pow(0.985, dt) + 0.32 * dt; // air drag + gravity
        if (p.vy > 2.6) p.vy = 2.6; // paper falls slowly once it turns over
        p.sway += 0.05 * dt; p.x += (p.vx + (p.vy > 0 ? Math.sin(p.sway) * 0.9 : 0)) * dt; p.y += p.vy * dt;
        p.rot += p.spin * dt; p.flip += p.flipSpeed * dt;
        if (p.y > H + 30) continue;
        alive++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.flip)); // flip = 3D tumble
        ctx.fillStyle = p.color;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 6.28); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) requestAnimationFrame(tick); else { cv.remove(); confettiRunning = false; }
    }
    requestAnimationFrame(tick);
  }

  // ---- Command palette: ⌘K / Ctrl+K or "/" ----
  function go(id) { return function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }; }
  function open(url) { return function () { window.open(url, '_blank', 'noopener'); }; }
  var commands = [
    // Secret: only listed once the visitor has typed at least "conf".
    { name: 'Confetti', hint: 'celebrate something 🎉', secret: 'conf', run: function () {
      setTimeout(confetti, 120);
      var first = true; try { first = !sessionStorage.getItem('confettiPal'); sessionStorage.setItem('confettiPal', '1'); } catch (e) {} // once per visit
      if (first) setTimeout(function () { toast("Congrats, you found the Confetti command 🎉 You're officially a confetti pal 👏", 5000); }, 600);
    } },
    { name: 'Now', hint: 'what I am up to', run: go('now') },
    { name: 'Experience', hint: 'the CV part', run: go('experience') },
    { name: 'Skills', hint: 'skills and tools', run: go('skills') },
    { name: 'AppTweak', hint: 'apptweak.com ↗', run: open('https://www.apptweak.com') },
    { name: 'Spiller!', hint: 'my game on the App Store ↗', run: open('https://apps.apple.com/app/id6828435267') },
    { name: 'LinkedIn', hint: 'say hi ↗', run: open('https://www.linkedin.com/in/pierre-antoine-roy') },
    { name: 'Bluesky', hint: '@pierreantoineroy.com ↗', run: open('https://bsky.app/profile/pierreantoineroy.com') },
    { name: 'X', hint: '@pierrealcideroy ↗', run: open('https://x.com/pierrealcideroy') },
    { name: 'GitHub', hint: 'my code ↗', run: open('https://github.com/pierrealcideroy') },
    { name: 'WhatsApp', hint: 'chat with me ↗', run: open('https://wa.me/message/7NE462RQVZXAL1') },
    { name: 'Email', hint: 'copy my address', run: function () { copyEmail('hello@pierreantoineroy.com'); } },
    { name: 'Resume as JSON', hint: 'my CV, the geeky way', run: showJson },
    { name: 'Theme', hint: 'lights on / off', run: toggleTheme },
    { name: 'Source', hint: 'this site on GitHub ↗', run: open('https://github.com/pierrealcideroy/pierrealcideroy.github.io') },
    { name: 'Top', hint: 'back to the top', run: function () { scrollTo({ top: 0, behavior: 'smooth' }); } }
  ];
  var pal, input, list, shown = [], sel = 0;
  function render() {
    var q = input.value.trim().toLowerCase();
    shown = commands.filter(function (c) {
      if (c.secret) return q.length >= c.secret.length && c.name.toLowerCase().indexOf(q) === 0;
      return !q || c.name.toLowerCase().indexOf(q) >= 0 || c.hint.toLowerCase().indexOf(q) >= 0;
    });
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length ? '' : '<li aria-disabled="true"><small>Nothing for “' + q.replace(/</g, '&lt;') + '”</small></li>';
    shown.forEach(function (c, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option'); li.setAttribute('aria-selected', i === sel);
      li.innerHTML = '<span>' + c.name + '</span><small>' + c.hint + '</small>';
      li.addEventListener('mousemove', function () { if (sel !== i) { sel = i; render(); } });
      li.addEventListener('click', function () { run(i); });
      list.appendChild(li);
    });
  }
  function run(i) { var c = shown[i]; if (!c) return; pal.close(); c.run(); }
  function openPalette() {
    if (!pal) {
      pal = document.createElement('dialog'); pal.className = 'palette'; pal.setAttribute('aria-label', 'Command palette');
      pal.innerHTML = '<input type="text" placeholder="Type a command…" aria-label="Command" autocomplete="off" spellcheck="false"><ul role="listbox"></ul><div class="hint">↑↓ to move · enter to run · esc to close</div>';
      document.body.appendChild(pal);
      input = $('input', pal); list = $('ul', pal);
      input.addEventListener('input', function () { sel = 0; render(); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
        if (e.key === 'Enter') { e.preventDefault(); run(sel); }
      });
      pal.addEventListener('click', function (e) { if (e.target === pal) pal.close(); });
    }
    if (pal.open) { pal.close(); return; }
    input.value = ''; sel = 0; render();
    // On a phone, show the list without popping the keyboard (it would hide half of it); tapping the field opens it.
    var phone = isPhone(); pal.autofocus = phone;
    pal.showModal();
    if (phone) { if (document.activeElement === input) input.blur(); } else input.focus();
  }
  var palBtn = $('#open-palette'); if (palBtn) palBtn.addEventListener('click', openPalette);

  // ---- Phones: floating "Commands" pill, hidden while scrolling down, back as soon as you scroll up ----
  function isPhone() { return matchMedia('(max-width: 599px) and (pointer: coarse)').matches; }
  var fab = $('#fab');
  if (fab) {
    fab.addEventListener('click', openPalette);
    var lastY = scrollY;
    addEventListener('scroll', function () {
      var y = scrollY, atEnd = innerHeight + y >= document.documentElement.scrollHeight - 40;
      if (Math.abs(y - lastY) < 6 && !atEnd) return; // ignore tiny jitters
      fab.classList.toggle('away', y > lastY && y > 120 && !atEnd);
      lastY = y;
    }, { passive: true });
  }
  addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !typing && !(pal && pal.open)) { e.preventDefault(); openPalette(); }
  });
  if (palBtn && !/Mac|iPhone|iPad/.test(navigator.platform)) $('kbd', palBtn).textContent = 'Ctrl K';

  // ---- Footer: last deploy, read from GitHub ----
  var dep = $('#deployed');
  if (dep && window.fetch) {
    fetch('https://api.github.com/repos/pierrealcideroy/pierrealcideroy.github.io/commits?per_page=1')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (c) {
        c = c[0]; var when = new Date(c.commit.committer.date), s = (Date.now() - when) / 1000;
        var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }), ago;
        if (s < 3600) ago = rtf.format(-Math.max(1, Math.round(s / 60)), 'minute');
        else if (s < 86400) ago = rtf.format(-Math.round(s / 3600), 'hour');
        else ago = rtf.format(-Math.round(s / 86400), 'day');
        dep.innerHTML = 'updated ' + ago + '<span class="kbd-hint"> · press <kbd>' + (palBtn ? $('kbd', palBtn).textContent : '⌘K') + '</kbd></span>';
      }).catch(function () {});
  }

  // ---- Footer: my local time, live ----
  var clock = $('#clock');
  if (clock && window.Intl) {
    var fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 1000);
  }

  // ---- For the curious ones who open the console ----
  console.log('%cPA', 'font:700 48px Lato,sans-serif;color:#1c6fb8');
  console.log('Hey, curious one 👋\nThis site is plain HTML, CSS and a little JS, no framework.\nTry ⌘K, or the Konami code. Say hi: hello@pierreantoineroy.com');
})();
