/* ═══════════════════════════════════════════════════
   INTIMATE WEDDING — script.js
   ═══════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   ① CONFIGURATION — Update these values
   ──────────────────────────────────────────
   Replace with your actual:
   • WEDDING_DATE  – the real date/time
   • SCRIPT_URL    – deployed Google Apps Script URL
   • Songs list    – hosted .mp3 or audio URLs
*/
const WEDDING_DATE = new Date('2026-03-22T16:30:00');

// Paste your deployed Google Apps Script URL here:
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Royalty-free placeholder tracks. Replace with real files or hosted MP3s.
// Upload .mp3 files into this repo and reference them as './track1.mp3' etc.
const PLAYLIST = [
  { title: 'A Thousand Years — Piano',     url: 'https://www.image2url.com/r2/default/audio/1782450469981-f0c6de59-b6ae-4b70-ac07-c9d3cf9e75c1.mp3' },
  { title: 'Palagi - Violin Cover',  url: 'https://www.image2url.com/r2/default/audio/1782460394596-9d103a9b-fd81-4ecc-a7ab-25f1905c8fd0.mp3' },
];

/* ══════════════════════════════════════════
   ② MUSIC PLAYER
   ══════════════════════════════════════════ */
const audio       = document.getElementById('bgm');
const icoPLay     = document.getElementById('ico-play');
const icoPause    = document.getElementById('ico-pause');
const nowPlaying  = document.getElementById('now-playing');
const progressFil = document.getElementById('progress-fill');

let currentIdx  = -1;
let playing     = false;

function pickRandom() {
  let idx;
  do { idx = Math.floor(Math.random() * PLAYLIST.length); }
  while (PLAYLIST.length > 1 && idx === currentIdx);
  return idx;
}

function loadTrack(idx) {
  currentIdx      = idx;
  audio.src       = PLAYLIST[idx].url;
  nowPlaying.textContent = '♩ ' + PLAYLIST[idx].title;
}

function startPlay() {
  audio.play()
    .then(() => setPlayState(true))
    .catch(() => { nowPlaying.textContent = '♩ Tap ▶ for music'; });
}

function setPlayState(isPlaying) {
  playing = isPlaying;
  icoPLay.style.display  = isPlaying ? 'none' : 'block';
  icoPause.style.display = isPlaying ? 'block' : 'none';
}

function toggleMusic() {
  if (playing) {
    audio.pause();
    setPlayState(false);
  } else {
    if (currentIdx < 0) loadTrack(pickRandom());
    startPlay();
  }
}

// Progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    progressFil.style.width = (audio.currentTime / audio.duration * 100) + '%';
  }
});

// Auto-advance
audio.addEventListener('ended', () => {
  loadTrack(pickRandom());
  startPlay();
});

// Try autoplay on first gesture
function attemptAutoplay() {
  if (currentIdx < 0) {
    loadTrack(pickRandom());
    startPlay();
  }
}
['click','scroll','keydown','touchstart'].forEach(ev =>
  document.addEventListener(ev, attemptAutoplay, { once: true, passive: true })
);
// Immediate attempt
window.addEventListener('load', () => {
  loadTrack(pickRandom());
  startPlay();
});

/* ══════════════════════════════════════════
   ③ COUNTDOWN
   ══════════════════════════════════════════ */
const cdD = document.getElementById('cd-d');
const cdH = document.getElementById('cd-h');
const cdM = document.getElementById('cd-m');
const cdS = document.getElementById('cd-s');

function tick() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) {
    document.getElementById('cd-grid').innerHTML =
      `<p style="font-family:var(--ff-display);font-size:2.5rem;color:var(--champagne);letter-spacing:.05em">It's Wedding Day! 🌸</p>`;
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  cdD.textContent = pad(d);
  cdH.textContent = pad(h);
  cdM.textContent = pad(m);
  cdS.textContent = pad(s);
}
const pad = n => String(n).padStart(2, '0');
setInterval(tick, 1000);
tick();

/* ══════════════════════════════════════════
   ④ MAP SWITCHER
   ══════════════════════════════════════════ */
function switchMap(venue, btn) {
  const isCeremony = venue === 'ceremony';
  document.getElementById('map-ceremony').classList.toggle('show', isCeremony);
  document.getElementById('map-reception').classList.toggle('show', !isCeremony);
  document.getElementById('dir-ceremony').style.display  = isCeremony  ? 'inline-flex' : 'none';
  document.getElementById('dir-reception').style.display = !isCeremony ? 'inline-flex' : 'none';
  document.querySelectorAll('.map-sw-btn').forEach((b, i) =>
    b.classList.toggle('active', (i === 0) === isCeremony)
  );
}

/* ══════════════════════════════════════════
   ⑤ RSVP — GOOGLE SHEETS via Apps Script
   ══════════════════════════════════════════ */
const attendanceSel = document.getElementById('attendance');
const mealGroup     = document.getElementById('meal-group');

// Show/hide dietary field based on selection
attendanceSel.addEventListener('change', () => {
  const accepts = attendanceSel.value === 'Joyfully Accepts';
  mealGroup.style.display = accepts ? 'flex' : 'none';
});

async function submitRSVP(e) {
  e.preventDefault();
  const form    = document.getElementById('rsvp-form');
  const btn     = document.getElementById('rsvp-submit');
  const msgEl   = document.getElementById('rsvp-msg');
  const spinner = document.getElementById('rsvp-spinner');
  const btnText = document.getElementById('rsvp-btn-text');

  const firstName  = document.getElementById('firstName').value.trim();
  const lastName   = document.getElementById('lastName').value.trim();
  const attendance = attendanceSel.value;
  const dietary    = document.getElementById('dietary').value.trim();

  // Validation
  if (!firstName || !lastName || !attendance) {
    msgEl.textContent = 'Please fill in all required fields.';
    msgEl.style.color = '#e8a0a0';
    return;
  }

  // Loading state
  btn.disabled       = true;
  spinner.style.display = 'block';
  btnText.textContent   = 'Sending…';
  msgEl.textContent     = '';

  const payload = {
    firstName,
    lastName,
    attendance,
    dietary,
    timestamp: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
  };

  try {
    // Google Apps Script does not support JSON POST with CORS easily,
    // so we use no-cors with URLSearchParams.
    const params = new URLSearchParams(payload);
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    // With no-cors we can't read the response, so assume success after short delay
    await new Promise(r => setTimeout(r, 800));

    const accepts = attendance === 'Joyfully Accepts';
    msgEl.style.color = 'var(--sage-lt)';
    msgEl.textContent = accepts
      ? `Thank you, ${firstName}! We can't wait to celebrate with you. 🌿`
      : `We'll miss you, ${firstName}. Thank you for letting us know.`;

    form.reset();
    mealGroup.style.display = 'none';
    btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Send My Reply';

    if (accepts) launchConfetti();

  } catch (err) {
    msgEl.style.color = '#e8a0a0';
    msgEl.textContent = 'Something went wrong. Please try again or contact us directly.';
    btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Send My Reply';
    console.error('RSVP error:', err);
  }
}

/* ══════════════════════════════════════════
   ⑥ CONFETTI
   ══════════════════════════════════════════ */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');

// Wedding-palette confetti colors
const CONFETTI_COLORS = [
  '#A8B5A0','#D4B896','#7D3C3C','#F5F0E8',
  '#BCA98A','#7A8F72','#E8D5C4','#C4956A',
];

let particles = [];
let animFrame;

function launchConfetti() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  particles     = [];

  for (let i = 0; i < 160; i++) {
    particles.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,
      w:    Math.random() * 10 + 5,
      h:    Math.random() * 5 + 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: Math.random() * 3 + 1.5,
      angle: Math.random() * 360,
      spin:  (Math.random() - .5) * 5,
      drift: (Math.random() - .5) * 1.5,
      opacity: 1,
    });
  }

  cancelAnimationFrame(animFrame);
  drawConfetti();

  // Clear after 5 s
  setTimeout(() => {
    cancelAnimationFrame(animFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
    ctx.rotate(p.angle * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    p.y     += p.speed;
    p.x     += p.drift;
    p.angle += p.spin;
    if (p.y > canvas.height * .8) p.opacity -= .025;
  });

  particles = particles.filter(p => p.opacity > 0);
  if (particles.length > 0) animFrame = requestAnimationFrame(drawConfetti);
}

window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ══════════════════════════════════════════
   ⑦ SCROLL REVEAL
   ══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => io.observe(el));
