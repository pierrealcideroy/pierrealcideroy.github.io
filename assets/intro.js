// Intro: the PA logo writes itself, holds, then fades to the page (same timings as the Spiller launch logo).
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;
  var root = document.documentElement;
  if (!root.classList.contains('intro')) { intro.remove(); return; }
  var WRITE = 2000, HOLD = 300, FADE = 500; // ms
  var paths = [].slice.call(intro.querySelectorAll('path'));
  var lens = paths.map(function (p) { return p.getTotalLength(); });
  var total = lens.reduce(function (a, b) { return a + b; }, 0);
  var start = null, done = false;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function draw(p) { // p = 0..1 of the whole pen trip
    var ink = p * total;
    paths.forEach(function (path, i) {
      var d = Math.max(0, Math.min(lens[i], ink));
      ink -= lens[i];
      path.style.opacity = d > 0 ? 1 : 0;
      path.style.strokeDasharray = d + ' ' + (lens[i] + 1);
    });
  }
  function finish() {
    if (done) return; done = true;
    draw(1);
    intro.classList.add('out');
    setTimeout(function () { intro.remove(); root.classList.remove('intro'); }, FADE + 50);
  }
  function frame(now) {
    if (done) return;
    if (start === null) start = now;
    var t = now - start;
    draw(ease(Math.min(1, t / WRITE)));
    if (t >= WRITE + HOLD) finish(); else requestAnimationFrame(frame);
  }
  // Safety net: never leave the page hidden behind the logo (a background tab pauses animation frames).
  setTimeout(finish, WRITE + HOLD + 2000);
  intro.addEventListener('click', finish);
  addEventListener('keydown', finish, { once: true });
  draw(0);
  requestAnimationFrame(frame);
})();
