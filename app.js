// ============================================================
//  ROYAL TAILOR — app.js
//  Architecture mirrors Deluxe Saloon (deluxsalon.in)
//  Single nostalgic Bollywood playlist, dynamic metadata.
// ============================================================

// ── Playlists Pool ───────────────────────────────────────────
// Array of curated nostalgia playlists to pick and shuffle from
const PLAYLISTS = [
  'PLVFLMYM1tErk',                                     // Deluxe Saloon retro Hindi
  'PLJABXrnHALkJHG7vK7QMhJ6_Wxl6OPriF',               // User added Playlist 1
  'PLcVfz1-_0rj8MQEX88RJ3_1qSlCyIFjkt'                // User added Playlist 2
];

// Pick a random starting playlist from the pool
let currentPlaylistIdx = Math.floor(Math.random() * PLAYLISTS.length);
let PLAYLIST_ID = PLAYLISTS[currentPlaylistIdx];

// ── Background images (all from IMG folder) ───────────────────
const BG_IMAGES = [
  "IMG/ChatGPT Image Aug 23, 2026, 08_22_14 PM.png",
  "IMG/ChatGPT Image Aug 23, 2026, 08_26_39 PM.png",
  "IMG/ChatGPT Image Aug 23, 2026, 08_29_02 PM.png",
  "IMG/genre_balveer_driver.jpg",
  "IMG/genre_corporate_majdoor.jpg",
  "IMG/genre_driving_car.jpg",
  "IMG/genre_gen_z.jpg",
  "IMG/genre_raju_mistri.jpg",
  "IMG/genre_rakesh_paan.jpg",
  "IMG/genre_sad.jpg",
];

let bgCurrentIdx  = 0;
let bgActiveLayer = 0; // 0 or 1 — which layer is visible

function setBgImage(layer, url) {
  const el = document.getElementById('bgLayer' + layer);
  // Encode spaces in the filename so CSS url() works correctly
  const encoded = url.replace(/ /g, '%20');
  if (el) el.style.backgroundImage = `url("${encoded}")`;
}

function rotateBg() {
  const nextIdx   = (bgCurrentIdx + 1) % BG_IMAGES.length;
  const nextLayer = bgActiveLayer === 0 ? 1 : 0;
  const curLayer  = bgActiveLayer;

  // Preload next image, then crossfade
  const img = new Image();
  img.onload = () => {
    // Set next image on the hidden layer
    setBgImage(nextLayer, BG_IMAGES[nextIdx]);

    const curEl  = document.getElementById('bgLayer' + curLayer);
    const nextEl = document.getElementById('bgLayer' + nextLayer);

    // Make next layer visible (blur in)
    if (nextEl) {
      nextEl.style.transition = 'none';
      nextEl.style.opacity    = '0';
      nextEl.style.filter     = 'blur(14px)';
      // Force reflow
      void nextEl.offsetHeight;
      nextEl.style.transition = 'opacity 2.5s ease, filter 2.5s ease';
      nextEl.style.opacity    = '1';
      nextEl.style.filter     = 'blur(0px)';
    }

    // Fade out current layer
    if (curEl) {
      curEl.style.transition = 'opacity 2.5s ease, filter 2.5s ease';
      curEl.style.opacity    = '0';
      curEl.style.filter     = 'blur(14px)';
    }

    bgCurrentIdx  = nextIdx;
    bgActiveLayer = nextLayer;
  };
  img.src = BG_IMAGES[nextIdx];
}

function startBgRotator() {
  // Set initial image immediately
  setBgImage(0, BG_IMAGES[0]);
  bgCurrentIdx  = 0;
  bgActiveLayer = 0;

  // Rotate every 3–4 minutes (random)
  function scheduleNext() {
    const delay = (180 + Math.random() * 60) * 1000; // 3–4 min
    setTimeout(() => { rotateBg(); scheduleNext(); }, delay);
  }
  scheduleNext();
}


// ── Quotes ───────────────────────────────────────────────────
const QUOTES = [
  // Urdu shayari style
  { q: '«सिलाई भी एक इबादत है — हर टाँका एक दुआ।»',                          a: '— उस्ताद हमीद, 1971' },
  { q: '«Waqt ki dhool mein dabi hain kai yaadein... radio pe abhi bhi wahi purane gaane hain.»', a: '— Royal Tailor, since 1967' },
  { q: '«कपड़ा बदल जाता है, लेकिन दर्जी का हुनर नहीं।»',                      a: '— मास्टर रमेश जी' },
  { q: '«Sui-dhaage ka rishta — kuch aisa hi hota hai dosti ka.»',             a: '— Pappu Bhai, 1984' },

  // Nostalgic radio feel
  { q: '«इस रेडियो ने बहुत कुछ सुना है — जश्न भी, और आँसू भी।»',           a: '— दुकान की दीवार' },
  { q: '«Wo din bhi kya din the... machine chalti thi, gaana bhi chalte the.»', a: '— Masterji ki diary' },
  { q: '«पुराने गाने सुनना ऐसा है जैसे किसी पुराने दोस्त से मिलना।»',         a: '— गुमनाम शायर' },
  { q: '«Yahan har shaam ek kahani banti thi — kaatne ki, jodne ki.»',         a: '— Shop floor, 1967–∞' },

  // Poetic / literary
  { q: '«धागे उलझे नहीं, तो कोई कपड़ा नहीं बनता — उलझना ज़रूरी है।»',       a: '— उस्तादों की उस्ताद' },
  { q: '«Har silwat mein ek kissa chhupa hota hai.»',                          a: '— अनजान दर्जी' },
  { q: '«The best suits are made in silence, with songs in the heart.»',       a: '— Royal Tailor, Est. 1967' },
  { q: '«नाप लेना सिर्फ कपड़े का नहीं — आदमी के सब्र का भी होता है।»',      a: '— मास्टर जी' },

  // Hinglish banter
  { q: '«Chai thandi ho gayi... machine nahi ruki. Isliye toh yahan aate hain log.»', a: '— Ramesh Darzi' },
  { q: '«Pehle fitting, phir baaki sab — zindagi mein bhi, kapdon mein bhi.»', a: '— Ustaad Tailor' },
  { q: '«Ye radio tab se chal raha hai jab se hum yahan hain.»',               a: '— 1967 se abhi tak' },
  { q: '«Button ek hi toot jaaye toh pura suit rota hai.»',                    a: '— Pappu Bhai' },

  // Pure Hindi / old-school
  { q: '«जो कपड़ा तन ढके, वो तो मिल जाता है — जो दिल ढके, वो यहाँ बनता है।»', a: '— दुकान की रूह' },
  { q: '«सन् 1967 से आज तक — धागा वही, हाथ बदले, गाने वही रहे।»',            a: '— Royal Tailor' },
  { q: '«इस मशीन की आवाज़ में एक सुकून है जो शहर के शोर में नहीं मिलता।»',    a: '— एक पुराना ग्राहक' },
  { q: '«अच्छा काम कभी जल्दी में नहीं होता।»',                                a: '— उस्ताद हमीद' },

  // English nostalgic
  { q: '«Every stitch is a memory. Every cut, a decision. Every suit, a story.»', a: '— Old Tailor\'s Wisdom' },
  { q: '«The radio plays on. The needle moves on. Time stops here.»',          a: '— Royal Tailor, 1967' },
  { q: '«In this shop, we don\'t just measure cloth — we measure trust.»',     a: '— Master Ramesh, 1979' },
];


// ── State ─────────────────────────────────────────────────────
let ytPlayer         = null;
let isPlaying        = false;
let isPreloadPass    = true;
let progressTimer    = null;
let metadataPollTimer = null;
let quoteTimer       = null;
let currentQuoteIdx  = 0;
let musicVolume      = 80;

let audioCtx         = null;
let sewingGain       = null;
let sewingNoise      = null;
let rainGain         = null;
let rainNoise        = null;
let isRainActive     = false;
let ambienceOn       = true;
let rainDrops        = [];
let rainSplashes     = [];
let animFrameId      = null;
let lightningId      = null;

const initialRandomIndex = Math.floor(Math.random() * 40);

// ── Helpers ───────────────────────────────────────────────────
function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

// ── YouTube Player ────────────────────────────────────────────
function instantiateYT() {
  if (ytPlayer || !window.YT || !window.YT.Player) return;
  console.log('[RoyalTailor] Instantiating YT playlist player. ID:', PLAYLIST_ID, 'Index:', initialRandomIndex);
  try {
    ytPlayer = new YT.Player('youtubeBridge', {
      height: '200',
      width: '200',
      playerVars: {
        listType: 'playlist',
        list: PLAYLIST_ID,
        index: initialRandomIndex,
        autoplay: 0,
        controls: 0,
        enablejsapi: 1,
        playsinline: 1,
        rel: 0,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  } catch(e) {
    console.error('[RoyalTailor] YT Player init error:', e);
  }
}

window.onYouTubeIframeAPIReady = function() {
  console.log('[RoyalTailor] YT IFrame API ready');
  instantiateYT();
};
if (window.YT && window.YT.Player) instantiateYT();

// Switch to another playlist (or random playlist) and play a random track
function switchPlaylistAndPlay(targetIndex) {
  if (!ytPlayer) return;
  if (typeof targetIndex === 'number') {
    currentPlaylistIdx = targetIndex % PLAYLISTS.length;
  } else {
    // Pick a different playlist randomly
    let newIdx = currentPlaylistIdx;
    if (PLAYLISTS.length > 1) {
      while (newIdx === currentPlaylistIdx) {
        newIdx = Math.floor(Math.random() * PLAYLISTS.length);
      }
    }
    currentPlaylistIdx = newIdx;
  }

  PLAYLIST_ID = PLAYLISTS[currentPlaylistIdx];
  const randStart = Math.floor(Math.random() * 20);
  try {
    if (typeof ytPlayer.loadPlaylist === 'function') {
      ytPlayer.loadPlaylist({
        list: PLAYLIST_ID,
        listType: 'playlist',
        index: randStart
      });
      // Enable YT shuffle if supported
      if (typeof ytPlayer.setShuffle === 'function') {
        ytPlayer.setShuffle(true);
      }
      startMetadataPolling();
    }
  } catch(e) {
    console.warn('[RoyalTailor] Playlist switch error:', e);
  }
}

// Picks a truly random song from the full playlist on first load
function startAtRandomIndex(attempt) {
  attempt = attempt || 0;
  if (!ytPlayer || typeof ytPlayer.getPlaylist !== 'function') return;
  const list = ytPlayer.getPlaylist();
  const total = (list && list.length) || 0;
  if (!total) {
    if (attempt < 20) setTimeout(() => startAtRandomIndex(attempt + 1), 250);
    return;
  }
  if (typeof ytPlayer.setShuffle === 'function') {
    try { ytPlayer.setShuffle(true); } catch(e) {}
  }
  const idx = Math.floor(Math.random() * total);
  try { ytPlayer.playVideoAt(idx); } catch(e) {}
}

function onPlayerReady(event) {
  try { event.target.setVolume(musicVolume); } catch(e) {}
  try { event.target.setLoop(true); }           catch(e) {}
  try { event.target.setShuffle(true); }        catch(e) {}
  // Silent preload: muted play so metadata loads before user presses Play
  try { event.target.mute(); } catch(e) {}
  startAtRandomIndex(0);
  startMetadataPolling();
}

function onPlayerError(e) {
  console.warn('[RoyalTailor] YT error code:', e && e.data, '— skipping to next track');
  nextTrack();
}

function onPlayerStateChange(event) {
  const S = YT.PlayerState;
  if (event.data === S.PLAYING) {
    if (isPreloadPass) {
      // Silent preload done — pause and unmute
      isPreloadPass = false;
      try { ytPlayer.pauseVideo(); ytPlayer.unMute(); ytPlayer.setVolume(musicVolume); } catch(e) {}
      updateTrackData();
      // Auto-play immediately after preload if user came from Enter Shop
      if (autoPlayOnEnter) {
        setTimeout(() => { try { ytPlayer.playVideo(); } catch(e) {} }, 200);
      }
      return;
    }
    isPlaying = true;
    setPlayUI(true);
    updateTrackData();
    startProgressMonitor();
  } else if (event.data === S.PAUSED) {
    isPlaying = false;
    setPlayUI(false);
  } else if (event.data === S.ENDED) {
    nextTrack();
  } else if (event.data === S.CUED || event.data === S.BUFFERING) {
    updateTrackData();
  }
}

// ── Metadata ──────────────────────────────────────────────────
function startMetadataPolling() {
  if (metadataPollTimer) clearInterval(metadataPollTimer);
  let attempts = 0;
  metadataPollTimer = setInterval(() => {
    attempts++;
    const ok = updateTrackData();
    if (ok || attempts > 25) clearInterval(metadataPollTimer);
  }, 250);
}

function updateTrackData() {
  if (!ytPlayer || typeof ytPlayer.getVideoData !== 'function') return false;
  try {
    const data = ytPlayer.getVideoData();
    let updated = false;
    if (data && data.title && data.title.trim()) {
      const el = document.getElementById('trackName');
      if (el && el.textContent !== data.title) el.textContent = data.title;
      updated = true;
    }
    if (data && data.author && data.author.trim()) {
      const el = document.getElementById('trackChannel');
      if (el && el.textContent !== data.author) el.textContent = data.author;
    }
    if (data && data.video_id) {
      const disc = document.getElementById('discArt');
      if (disc) disc.style.backgroundImage = `url('https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg')`;
    }
    return updated;
  } catch(e) { return false; }
}

// ── Progress bar ──────────────────────────────────────────────
function startProgressMonitor() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (!ytPlayer || !ytPlayer.getCurrentTime) return;
    const cur = ytPlayer.getCurrentTime() || 0;
    const dur = ytPlayer.getDuration()    || 0;
    const tn  = document.getElementById('timeNow');
    const tt  = document.getElementById('timeTotal');
    const pf  = document.getElementById('progressFill');
    const pb  = document.getElementById('progressBar');
    if (tn) tn.textContent = fmt(cur);
    if (tt) tt.textContent = fmt(dur);
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    if (pf) pf.style.width = pct + '%';
    if (pb) pb.setAttribute('aria-valuenow', Math.round(pct));
    updateTrackData();
  }, 500);
}

// ── Playback controls ──────────────────────────────────────────
function togglePlay() {
  if (!ytPlayer) { instantiateYT(); return; }
  try {
    if (isPlaying) ytPlayer.pauseVideo();
    else { ytPlayer.playVideo(); updateTrackData(); }
  } catch(e) {}
}

function nextTrack() {
  if (!ytPlayer) return;
  // 35% chance or at track end / click, hop to another playlist for ultimate freshness
  if (Math.random() < 0.35 && PLAYLISTS.length > 1) {
    switchPlaylistAndPlay();
    return;
  }

  try {
    if (typeof ytPlayer.getPlaylist === 'function') {
      const list = ytPlayer.getPlaylist();
      if (list && list.length > 1) {
        const curIdx = typeof ytPlayer.getPlaylistIndex === 'function' ? ytPlayer.getPlaylistIndex() : -1;
        let randIdx = Math.floor(Math.random() * list.length);
        if (randIdx === curIdx && list.length > 1) {
          randIdx = (curIdx + 1) % list.length;
        }
        ytPlayer.playVideoAt(randIdx);
        setTimeout(updateTrackData, 300);
        return;
      }
    }
    if (typeof ytPlayer.nextVideo === 'function') {
      ytPlayer.nextVideo();
      setTimeout(updateTrackData, 300);
    }
  } catch(e) {
    switchPlaylistAndPlay();
  }
}

function prevTrack() {
  if (!ytPlayer) return;
  try {
    if (typeof ytPlayer.previousVideo === 'function') {
      ytPlayer.previousVideo();
      setTimeout(updateTrackData, 300);
    }
  } catch(e) {}
}

// ── Play UI ───────────────────────────────────────────────────
function setPlayUI(playing) {
  const icon = document.getElementById('playIcon');
  if (icon) {
    icon.innerHTML = playing
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>'
      : '<path d="M8 5v14l11-7-11-7Z"></path>';
  }
  const btn = document.getElementById('playBtn');
  if (btn) btn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  const disc = document.getElementById('disc');
  if (disc) disc.classList.toggle('spinning', playing);
}

// ── Volume ────────────────────────────────────────────────────
function setVolume(level) {
  musicVolume = Math.max(0, Math.min(100, level));
  if (!ytPlayer) return;
  try {
    if (musicVolume === 0) ytPlayer.mute();
    else { ytPlayer.unMute(); ytPlayer.setVolume(musicVolume); }
  } catch(e) {}
}

// ── Quotes ────────────────────────────────────────────────────
function showQuote() {
  const item = QUOTES[currentQuoteIdx % QUOTES.length];
  currentQuoteIdx++;
  const qEl = document.getElementById('shopQuote');
  const aEl = document.getElementById('shopQuoteAuthor');
  if (!qEl || !aEl) return;
  qEl.style.opacity = '0';
  aEl.style.opacity = '0';
  setTimeout(() => {
    qEl.textContent = item.q;
    aEl.textContent = item.a;
    qEl.style.transition = 'opacity 0.7s';
    aEl.style.transition  = 'opacity 0.7s';
    qEl.style.opacity = '1';
    aEl.style.opacity = '1';
  }, 400);
}

function startQuoteRotator() {
  showQuote();
  function schedule() {
    const delay = 16000 + Math.random() * 8000;
    quoteTimer = setTimeout(() => { showQuote(); schedule(); }, delay);
  }
  schedule();
}

// ── Audio (Ambience + Reverb) ─────────────────────────────────
let reverbNode  = null;
let radioOn     = true;

function makeImpulseResponse(ctx, duration, decay) {
  // Synthetic room impulse response for reverb
  const rate    = ctx.sampleRate;
  const length  = rate * duration;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function initAudio() {
  if (audioCtx) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();

    // ── Reverb (convolver) ──
    reverbNode = audioCtx.createConvolver();
    reverbNode.buffer = makeImpulseResponse(audioCtx, 2.5, 3.0);
    const reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.35; // wet mix
    reverbNode.connect(reverbGain);
    reverbGain.connect(audioCtx.destination);

    // ── Vintage radio bandpass filter (narrows freq like old speaker) ──
    const radioHigh = audioCtx.createBiquadFilter();
    radioHigh.type = 'highpass';
    radioHigh.frequency.value = 300;

    const radioLow = audioCtx.createBiquadFilter();
    radioLow.type = 'lowpass';
    radioLow.frequency.value = 3400;

    const radioWarm = audioCtx.createBiquadFilter();
    radioWarm.type = 'peaking';
    radioWarm.frequency.value = 800;
    radioWarm.gain.value = 4;

    // ── Sewing machine noise through radio filter + reverb ──
    const bufSize = audioCtx.sampleRate * 2;
    const buf  = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufSize; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last = data[i];
      data[i] *= 2.5;
    }
    sewingNoise = audioCtx.createBufferSource();
    sewingNoise.buffer = buf;
    sewingNoise.loop = true;

    sewingGain = audioCtx.createGain();
    sewingGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    // Chain: noise → bandpass → gain → [radio filter chain] → reverb → out
    sewingNoise.connect(radioHigh);
    radioHigh.connect(radioLow);
    radioLow.connect(radioWarm);
    radioWarm.connect(sewingGain);
    sewingGain.connect(audioCtx.destination); // dry path
    sewingGain.connect(reverbNode);           // wet reverb path

    sewingNoise.start(0);
  } catch(e) {
    console.warn('[RoyalTailor] AudioContext init error:', e);
  }
}


function toggleAmbience() {
  ambienceOn = !ambienceOn;
  const btn = document.getElementById('ambBtn');
  if (!audioCtx) return;
  const target = ambienceOn ? 0.04 : 0.001;
  try {
    sewingGain.gain.cancelScheduledValues(audioCtx.currentTime);
    sewingGain.gain.setValueAtTime(sewingGain.gain.value, audioCtx.currentTime);
    sewingGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 1);
  } catch(e) {}
  if (btn) btn.classList.toggle('active', ambienceOn);
}

// ── Rain ──────────────────────────────────────────────────────
function initRainAudio() {
  if (!audioCtx) return;
  if (rainNoise) return;
  try {
    const bufSize = audioCtx.sampleRate * 2;
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufSize; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last = data[i];
      data[i] *= 2.8;
    }
    rainNoise = audioCtx.createBufferSource();
    rainNoise.buffer = buf;
    rainNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    rainNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(audioCtx.destination);
    rainNoise.start(0);
  } catch(e) {}
}

function toggleRain() {
  isRainActive = !isRainActive;
  const btn   = document.getElementById('rainBtn');
  const badge = document.getElementById('rainBadge');
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  initRainAudio();
  try {
    const target = isRainActive ? 0.12 : 0.001;
    rainGain.gain.cancelScheduledValues(audioCtx.currentTime);
    rainGain.gain.setValueAtTime(rainGain.gain.value, audioCtx.currentTime);
    rainGain.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 1);
  } catch(e) {}

  const canvas = document.getElementById('rainCanvas');
  const flash  = document.getElementById('lightningFlash');
  if (isRainActive) {
    canvas && canvas.classList.add('active');
    btn && btn.classList.add('active');
    if (badge) badge.textContent = 'ON';
    btn && btn.setAttribute('aria-pressed', 'true');
    startRainAnim();
    scheduleLightning();
  } else {
    canvas && canvas.classList.remove('active');
    btn && btn.classList.remove('active');
    if (badge) badge.textContent = 'OFF';
    btn && btn.setAttribute('aria-pressed', 'false');
    stopRainAnim();
    if (lightningId) clearTimeout(lightningId);
    if (flash) flash.style.opacity = '0';
  }
}

// ── Rain animation (canvas) ───────────────────────────────────
let rainCanvas, rainCtx, rainW, rainH;

function initRainCanvas() {
  rainCanvas = document.getElementById('rainCanvas');
  if (!rainCanvas) return;
  rainCtx = rainCanvas.getContext('2d');
  resizeRainCanvas();
  window.addEventListener('resize', resizeRainCanvas);
}

function resizeRainCanvas() {
  if (!rainCanvas) return;
  rainW = rainCanvas.width  = window.innerWidth;
  rainH = rainCanvas.height = window.innerHeight;
}

function makeRainDrop() {
  return {
    x: Math.random() * rainW,
    y: Math.random() * -rainH,
    len: 8 + Math.random() * 15,
    speed: 12 + Math.random() * 10,
    alpha: 0.3 + Math.random() * 0.5,
    update() { this.y += this.speed; if (this.y > rainH) { this.y = -this.len; this.x = Math.random() * rainW; } },
    draw() {
      rainCtx.beginPath();
      rainCtx.moveTo(this.x, this.y);
      rainCtx.lineTo(this.x - 1, this.y + this.len);
      rainCtx.strokeStyle = `rgba(174,214,241,${this.alpha})`;
      rainCtx.lineWidth = 1;
      rainCtx.stroke();
    }
  };
}

function startRainAnim() {
  if (!rainCtx) initRainCanvas();
  rainDrops = Array.from({ length: 200 }, makeRainDrop);
  function loop() {
    if (!isRainActive) return;
    rainCtx.clearRect(0, 0, rainW, rainH);
    rainDrops.forEach(d => { d.update(); d.draw(); });
    animFrameId = requestAnimationFrame(loop);
  }
  loop();
}

function stopRainAnim() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  if (rainCtx) rainCtx.clearRect(0, 0, rainW, rainH);
}

function scheduleLightning() {
  if (!isRainActive) return;
  const flash = document.getElementById('lightningFlash');
  lightningId = setTimeout(() => {
    if (!isRainActive || !flash) return;
    const intensity = 0.5 + Math.random() * 0.4;
    flash.style.opacity = intensity.toString();
    setTimeout(() => { flash.style.opacity = '0.1'; }, 50);
    setTimeout(() => { flash.style.opacity = (intensity * 0.7).toString(); }, 90);
    setTimeout(() => { flash.style.opacity = '0'; scheduleLightning(); }, 150);
  }, 5000 + Math.random() * 9000);
}

// ── Enter Shop ────────────────────────────────────────────────
function enterShop() {
  const landing = document.getElementById('landingScreen');
  const shop    = document.getElementById('shopScreen');

  autoPlayOnEnter = true;  // ← music will auto-start after preload

  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  // Fade up sewing machine ambience
  if (ambienceOn && sewingGain && audioCtx) {
    sewingGain.gain.cancelScheduledValues(audioCtx.currentTime);
    sewingGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.5);
  }

  // Boot the YouTube player
  if (!ytPlayer) instantiateYT();
  else { try { ytPlayer.playVideo(); } catch(e) {} }

  landing.classList.add('fade-out');
  setTimeout(() => {
    landing.classList.add('gone');
    shop.classList.remove('hidden');
    shop.classList.add('entering');
    startQuoteRotator();
    startBgRotator();   // ← background image cycle starts here
  }, 750);
}

// ── DOMContentLoaded ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Buttons
  document.getElementById('enterShopBtn')?.addEventListener('click', enterShop);
  document.getElementById('playBtn')    ?.addEventListener('click', togglePlay);
  document.getElementById('discBtn')    ?.addEventListener('click', togglePlay);
  document.getElementById('nextBtn')    ?.addEventListener('click', nextTrack);
  document.getElementById('prevBtn')    ?.addEventListener('click', prevTrack);
  document.getElementById('rainBtn')    ?.addEventListener('click', () => {
    if (!audioCtx) { initAudio(); }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    toggleRain();
  });
  document.getElementById('ambBtn')?.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    toggleAmbience();
  });

  // Volume
  const volBtn     = document.getElementById('volBtn');
  const volPopover = document.getElementById('volPopover');
  const volSlider  = document.getElementById('volSlider');
  volBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    volPopover?.classList.toggle('hidden');
  });
  document.addEventListener('click', () => volPopover?.classList.add('hidden'));
  volSlider?.addEventListener('input', (e) => setVolume(Number(e.target.value)));

  // Progress bar seek
  const pb = document.getElementById('progressBar');
  pb?.addEventListener('click', (e) => {
    if (!ytPlayer) return;
    const rect = pb.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    try {
      const dur = ytPlayer.getDuration() || 0;
      if (dur > 0) ytPlayer.seekTo(dur * pct, true);
    } catch(err) {}
  });

  initRainCanvas();
});
