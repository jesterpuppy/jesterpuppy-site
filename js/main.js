/* ═══════════════════════════════════════
   JESTER WEBSITE — main.js
   All site behaviour, music player & SFX
═══════════════════════════════════════ */

'use strict';

// Ensure page always loads at top
window.scrollTo(0, 0);

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const cur = document.getElementById('cur');
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  curX = e.clientX;
  curY = e.clientY;
  cur.style.left = curX + 'px';
  cur.style.top = curY + 'px';
});

document.querySelectorAll('a, button, .card, .link-card, .exp-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.classList.add('cur-hover');

    SFX.playHover();
  });
  el.addEventListener('mouseleave', () => {
    cur.classList.remove('cur-hover');

  });
});

/* ══════════════════════════════════════
   SFX SYSTEM
   Tries mp3 then wav. Uses cloneNode so
   rapid firing doesn't cut the sound.
══════════════════════════════════════ */
const SFX = {
  click: null,
  hover: null,
  ready: false,

  _tryLoad(paths) {
    return new Promise(resolve => {
      let i = 0;
      const attempt = () => {
        if (i >= paths.length) { resolve(null); return; }
        const a = new Audio(paths[i++]);
        a.addEventListener('canplaythrough', () => resolve(a), { once: true });
        a.addEventListener('error', attempt, { once: true });
        a.load();
      };
      attempt();
    });
  },

  async init() {
    [this.click, this.hover] = await Promise.all([
      this._tryLoad(['sfx/clicksfx.mp3', 'sfx/clicksfx.wav']),
      this._tryLoad(['sfx/hoversfx.mp3', 'sfx/hoversfx.wav']),
    ]);
    if (this.click) this.click.volume = 0.15;
    if (this.hover) this.hover.volume = 0.22;
    this.ready = true;
  },

  _play(src) {
    if (!src || !this.ready) return;
    const clone = src.cloneNode();
    clone.volume = src.volume;
    clone.play().catch(() => { });
  },

  playClick() { this._play(this.click); },
  playHover() { this._play(this.hover); },
};

SFX.init();

// Attach click sfx to interactive elements
document.addEventListener('click', e => {
  if (e.target.closest('a, button, label, .card, .link-card, .exp-item')) {
    SFX.playClick();
  }
});

/* ══════════════════════════════════════
   LANDING
══════════════════════════════════════ */
let isEntered = false;
document.getElementById('enterBtn').addEventListener('click', () => {
  isEntered = true;
  document.body.classList.remove('no-scroll');
  window.scrollTo(0, 0);
  document.getElementById('landing').classList.add('hidden');
  // Autoplay music
  if (shuffled.length > 0) {
    loadTrack(0, true);
  }
});

/* ══════════════════════════════════════
   CLOCK
══════════════════════════════════════ */
function tick() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const p = n => String(n).padStart(2, '0');
  document.getElementById('timeTxt').textContent = `LOCAL TIME  ·  ${p(h)}:${p(m)}:${p(s)} ${ap}`;
}
tick();
setInterval(tick, 1000);

/* ══════════════════════════════════════
   VIEWS COUNTER
══════════════════════════════════════ */
let v = parseInt(localStorage.getItem('jv') || '0') + 1;
localStorage.setItem('jv', v);
document.getElementById('viewTxt').textContent = `${v.toLocaleString()} VIEWS`;

/* ══════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════ */
const PHRASES = [
  'lost',
  'taken',
  'silly',
  'weird',
  'stupid',
];
const QUOTES = [
  'lost in epoch, lost in thought — Jester',
  'What we think, we become. — Buddha',
  'Be yourself. — Oscar Wilde',
  'Love conquers all. — Virgil',
  'Live the moment. — Marcus Aurelius',
  'Keep moving forward. — Walt Disney',
];

let pi = 0, ci = 0, erasing = false;
const twEl = document.getElementById('tw');

let navPi = 0, navCi = 0, navErasing = false;
const navTwEl = document.getElementById('nav-tw');
let phraseCycles = 0;

function type() {
  const ph = PHRASES[pi];
  if (!erasing) {
    twEl.textContent = ph.slice(0, ++ci);
    if (ci === ph.length) {
      erasing = true;
      phraseCycles++;
      return setTimeout(type, 1800);
    }
  } else {
    if (ci === ph.length && phraseCycles % 2 === 0) { navErasing = true; }
    twEl.textContent = ph.slice(0, --ci);
    if (ci === 0) {
      erasing = false;
      pi = (pi + 1) % PHRASES.length;
    }
  }
  setTimeout(type, erasing ? 30 : 60);
}

function navType() {
  const nph = QUOTES[navPi];
  if (!navErasing) {
    if (navCi < nph.length) {
      navTwEl.textContent = nph.slice(0, ++navCi);
      setTimeout(navType, 60);
    } else {
      setTimeout(navType, 100);
    }
  } else {
    if (navCi > 0) {
      navTwEl.textContent = nph.slice(0, --navCi);
      setTimeout(navType, 30);
    } else {
      navErasing = false;
      let nextPi;
      do { nextPi = Math.floor(Math.random() * QUOTES.length); } while (nextPi === navPi);
      navPi = nextPi;
      setTimeout(navType, 30);
    }
  }
}

setTimeout(type, 1000);
if (navTwEl) setTimeout(navType, 1000);

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════
   PROXIMITY NEON GLOW
   Each brutalist card reads cursor distance
   and updates its border / glow in realtime.
══════════════════════════════════════ */
const PROX_ELS = document.querySelectorAll('.card, .exp-item, .link-card');
const MAX_DIST = 240;

function proximityLoop() {
  if (isEntered) {
    PROX_ELS.forEach(el => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - curX, 0, curX - r.right);
      const dy = Math.max(r.top - curY, 0, curY - r.bottom);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const p = Math.max(0, Math.min(1, 1 - dist / MAX_DIST));

      const borderOp = (0.18 + p * 0.77).toFixed(3);
      const leftOp = (0.45 + p * 0.55).toFixed(3);
      const glowSize = (p * 42).toFixed(1);
      const glowOp = (p * 0.65).toFixed(3);
      const innerOp = (p * 0.07).toFixed(3);
      const offsetOp = (0.08 + p * 0.22).toFixed(3);
      const cornerOp = (0.25 + p * 0.75).toFixed(3);

      const isExp = el.classList.contains('exp-item');
      const isLink = el.classList.contains('link-card');
      const off = isLink ? 4 : 5;

      el.style.boxShadow = [
        `${off}px ${off}px 0 rgba(255,0,84,${offsetOp})`,
        `0 0 ${glowSize}px rgba(255,0,84,${glowOp})`,
        `inset 0 0 ${(p * 20).toFixed(1)}px rgba(255,0,84,${innerOp})`,
        `0 3px 14px rgba(0,0,0,0.7)`,
      ].join(', ');

      el.style.borderColor = `rgba(255,0,84,${borderOp})`;
      if (isExp) el.style.borderLeftColor = `rgba(255,0,84,${leftOp})`;
      el.style.setProperty('--corner-op', cornerOp);
    });
  }
  requestAnimationFrame(proximityLoop);
}
proximityLoop();

/* ══════════════════════════════════════
   MUSIC PLAYER
   ──────────────────────────────────────
   • Hardcoded tracks from music folder
   • Autoplays on enter
══════════════════════════════════════ */
const musicWrap = document.getElementById('music-wrap');
const mpTitle = document.getElementById('mp-title');
const mpSub = document.getElementById('mp-sub');
const mpCount = document.getElementById('mp-count');
const mpPlay = document.getElementById('mp-play');
const mpPrev = document.getElementById('mp-prev');
const mpNext = document.getElementById('mp-next');
const mpSeekWrap = document.getElementById('mp-seek-wrap');
const mpSeekFill = document.getElementById('mp-seek-fill');
const mpElapsed = document.getElementById('mp-elapsed');
const mpDur = document.getElementById('mp-dur');
const mpVolTrack = document.getElementById('mp-vol-track');
const mpVolFill = document.getElementById('mp-vol-fill');
const mpVolPct = document.getElementById('mp-vol-pct');

// Hardcode your music files here
const HARDCODED_TRACKS = [
  'music/Third Rail.mp3'
];

const audio = new Audio();
let playlist = [];
let shuffled = [];
let trackIdx = 0;
let isPlaying = false;
let mpVol = 0.7;

audio.volume = mpVol;

// ── Helpers ──
const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPlaylist() {
  playlist = [...HARDCODED_TRACKS];
  shuffled = shuffleArr(playlist);
  mpCount.textContent = `${playlist.length} TRACK${playlist.length > 1 ? 'S' : ''}`;
  trackIdx = 0;
}

function loadTrack(idx, autoplay = false) {
  if (!shuffled.length) return;
  trackIdx = ((idx % shuffled.length) + shuffled.length) % shuffled.length;
  audio.src = shuffled[trackIdx];
  // Extract filename from path for title
  const filename = shuffled[trackIdx].split('/').pop();
  const name = filename.replace(/\.[^/.]+$/, '');
  mpTitle.textContent = name.toUpperCase();
  mpSub.textContent = 'Now Playing';
  mpSeekFill.style.width = '0%';
  mpElapsed.textContent = '0:00';
  mpDur.textContent = '0:00';
  if (autoplay || isPlaying) {
    audio.play().then(() => setPlaying(true)).catch(() => { });
  }
}

function setPlaying(state) {
  isPlaying = state;
  mpPlay.textContent = state ? '⏸' : '⏵';
  if (state) musicWrap.classList.add('playing');
  else musicWrap.classList.remove('playing');
}

// Auto-advance to next track
audio.addEventListener('ended', () => {
  if (trackIdx >= shuffled.length - 1) {
    shuffled = shuffleArr(playlist);
    loadTrack(0, true);
  } else {
    loadTrack(trackIdx + 1, true);
  }
});

// Seek display
audio.addEventListener('timeupdate', () => {
  if (!audio.duration || isNaN(audio.duration)) return;
  const pct = audio.currentTime / audio.duration;
  mpSeekFill.style.width = (pct * 100) + '%';
  mpElapsed.textContent = fmtTime(audio.currentTime);
  mpDur.textContent = fmtTime(audio.duration);
});

// Controls
mpPlay.addEventListener('click', () => {
  if (!shuffled.length) return;
  if (isPlaying) { audio.pause(); setPlaying(false); }
  else { audio.play().then(() => setPlaying(true)).catch(() => { }); }
});

mpPrev.addEventListener('click', () => {
  if (!shuffled.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; }
  else { loadTrack(trackIdx - 1, isPlaying); }
});

mpNext.addEventListener('click', () => { if (shuffled.length) loadTrack(trackIdx + 1, isPlaying); });

// Seek click
mpSeekWrap.addEventListener('click', e => {
  if (!audio.duration || isNaN(audio.duration)) return;
  const r = mpSeekWrap.getBoundingClientRect();
  audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

// Volume
function setVolume(vol) {
  mpVol = Math.max(0, Math.min(1, vol));
  audio.volume = mpVol;
  mpVolFill.style.width = (mpVol * 100) + '%';
  mpVolPct.textContent = Math.round(mpVol * 100) + '%';
}
setVolume(0.7);

mpVolTrack.addEventListener('click', e => {
  const r = mpVolTrack.getBoundingClientRect();
  setVolume((e.clientX - r.left) / r.width);
});

// Volume drag
let volDragging = false;
mpVolTrack.addEventListener('mousedown', () => { volDragging = true; });
document.addEventListener('mousemove', e => {
  if (!volDragging) return;
  const r = mpVolTrack.getBoundingClientRect();
  setVolume((e.clientX - r.left) / r.width);
});
document.addEventListener('mouseup', () => { volDragging = false; });

// Initialize playlist on load
buildPlaylist();

// ── Slide-out panel behaviour ──
let playerCloseTimer = null;

musicWrap.addEventListener('mouseenter', () => {
  clearTimeout(playerCloseTimer);
  musicWrap.classList.add('open');
});

musicWrap.addEventListener('mouseleave', () => {
  playerCloseTimer = setTimeout(() => {
    musicWrap.classList.remove('open');
  }, 700);
});




/* --------------------------------------
   CURSOR MENU
-------------------------------------- */
let cursorCloseTimer = null;
const cursorWrap = document.getElementById('cursor-wrap');

if (cursorWrap) {
  cursorWrap.addEventListener('mouseenter', () => {
    clearTimeout(cursorCloseTimer);
    cursorWrap.classList.add('open');
  });
  cursorWrap.addEventListener('mouseleave', () => {
    cursorCloseTimer = setTimeout(() => {
      cursorWrap.classList.remove('open');
    }, 700);
  });
}

function setCursor(type) {
  const cur = document.getElementById('cur');
  if (type === 'default') {
    cur.style.display = 'none';
    document.body.classList.add('cursor-default');
  } else {
    document.body.classList.remove('cursor-default');
    cur.style.display = 'block';
    if (type === 'x') {
      cur.classList.add('cur-x');
    } else {
      cur.classList.remove('cur-x');
    }
  }
}

