/* ==========================================================================
   V.P. SAI DINESH & R. JANAKI WEDDING INVITATION — JAVASCRIPT ENGINE
   File: js/main.js
   Clean, modular, and easy to debug.
   ========================================================================== */

/* 1. TAILWIND CONFIGURATION */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          maroon: '#9E1329',
          'maroon-dark': '#6E0A1B',
          'maroon-deep': '#450410',
          rose: '#D62246',
          'rose-light': '#FF5277',
          emerald: '#0D4735',
          'emerald-dark': '#062B1F',
          'emerald-light': '#146C52',
          amber: '#B84E0B',
          'amber-light': '#E06B16',
          gold: '#D4AF37',
          'gold-light': '#F7E8A4',
          'gold-shimmer': '#FFF1B8',
          cream: '#FAF7F2',
          'cream-soft': '#F4EFE6',
          'cream-card': '#FFFFFF',
          turmeric: '#E8890A',
          'turmeric-light': '#F5A623'
        },
        fontFamily: {
          playfair: ['"Playfair Display"', 'serif'],
          poppins: ['Poppins', 'sans-serif'],
          tamil: ['"Noto Sans Tamil"', 'sans-serif'],
          telugu: ['"Noto Sans Telugu"', 'sans-serif']
        }
      }
    }
  };
}

/* 2. PAGE LANGUAGE IDENTIFIER */
function getCurrentLang() {
  const htmlLang = document.documentElement.lang || 'en';
  if (htmlLang.startsWith('te')) return 'te';
  if (htmlLang.startsWith('ta')) return 'ta';
  return 'en';
}

/* 3. AUTO LANGUAGE REDIRECTION (Only runs on index.html if user hasn't explicitly chosen English) */
function checkAutoLanguageRedirect() {
  const currentPath = window.location.pathname.toLowerCase();
  const isIndex = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  
  if (!isIndex) return; // Don't redirect from dedicated telugu.html or tamil.html

  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  
  if (urlLang === 'te') { window.location.href = 'telugu.html'; return; }
  if (urlLang === 'ta') { window.location.href = 'tamil.html'; return; }
  if (urlLang === 'en') { return; }

  const storedLang = localStorage.getItem('wedding_lang');
  if (storedLang === 'te') { window.location.href = 'telugu.html'; return; }
  if (storedLang === 'ta') { window.location.href = 'tamil.html'; return; }
  if (storedLang === 'en') { return; }

  // Check browser language
  const browserLangs = navigator.languages || [navigator.language || ''];
  for (const bl of browserLangs) {
    if (bl.toLowerCase().startsWith('te')) {
      window.location.href = 'telugu.html';
      return;
    }
    if (bl.toLowerCase().startsWith('ta')) {
      window.location.href = 'tamil.html';
      return;
    }
  }

  // Geo-IP detection (async fallback)
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const region = data.region || '';
      if (['Andhra Pradesh', 'Telangana'].includes(region)) {
        window.location.href = 'telugu.html';
      } else if (['Tamil Nadu', 'Puducherry'].includes(region)) {
        window.location.href = 'tamil.html';
      }
    })
    .catch(() => {});
}

/* 4. WELCOME GATE OVERLAY (Doors Opening & Audio Autoplay) */
let petalsAnimationStarted = false;

function openGate() {
  const gate = document.getElementById('welcomeGate');
  if (!gate) return;

  gate.classList.add('doors-open');

  // Trigger auspicious background music
  playAudio();

  // Start falling marigold petals canvas
  if (!petalsAnimationStarted) {
    initPetalsCanvas();
    petalsAnimationStarted = true;
  }

  // Fade out gate completely
  setTimeout(() => {
    gate.style.opacity = '0';
    gate.style.pointerEvents = 'none';
    setTimeout(() => {
      gate.style.display = 'none';
    }, 1000);
  }, 900);
}

/* 5. CANVAS FALLING MARIGOLD & JASMINE FLOWERS */
function initPetalsCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 28;
  const petals = [];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.5 + 1,
      speedX: Math.random() * 1.2 - 0.6,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: Math.random() * 0.04 - 0.02,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01,
      type: i % 3 === 0 ? 'jasmine' : 'marigold' // 2/3 marigold, 1/3 white jasmine
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, Math.cos(p.flip));

    if (p.type === 'marigold') {
      // Golden Marigold Petal
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, '#FFA000');
      grad.addColorStop(0.5, '#E8890A');
      grad.addColorStop(1, '#D84315');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Fragrant White Jasmine Flower
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(212,175,55,0.4)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Pollen Dot
      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.005) * 1.2 + p.speedX;
      p.angle += p.angularSpeed;
      p.flip += p.flipSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    }
    requestAnimationFrame(render);
  }

  render();
}

/* 6. LIVE COUNTDOWN TIMER */
function initCountdown() {
  // Target: Monday, November 16, 2026, at 05:00:00 AM IST (+05:30)
  const targetDate = new Date('2026-11-16T05:00:00+05:30').getTime();

  let prevDays = -1, prevHours = -1, prevMinutes = -1, prevSeconds = -1;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      setDigits('00', '00', '00', '00');
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dStr = days.toString().padStart(2, '0');
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');

    if (days !== prevDays) triggerFlip('box-days', 'timer-days', dStr);
    if (hours !== prevHours) triggerFlip('box-hours', 'timer-hours', hStr);
    if (minutes !== prevMinutes) triggerFlip('box-minutes', 'timer-minutes', mStr);
    if (seconds !== prevSeconds) triggerFlip('box-seconds', 'timer-seconds', sStr);

    prevDays = days;
    prevHours = hours;
    prevMinutes = minutes;
    prevSeconds = seconds;
  }

  function triggerFlip(boxId, textId, value) {
    const box = document.getElementById(boxId);
    const text = document.getElementById(textId);
    if (text) text.textContent = value;
    if (box) {
      box.classList.remove('flip');
      void box.offsetWidth;
      box.classList.add('flip');
    }
  }

  function setDigits(d, h, m, s) {
    ['days', 'hours', 'minutes', 'seconds'].forEach((k, idx) => {
      const el = document.getElementById(`timer-${k}`);
      if (el) el.textContent = [d, h, m, s][idx];
    });
  }

  update();
  setInterval(update, 1000);
}

/* 7. DIRECT ZERO-DOWNLOAD GOOGLE CALENDAR INTEGRATION */
function openGoogleCalendar(title, startUTC, endUTC, details, location) {
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startUTC}/${endUTC}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(calUrl, '_blank', 'noopener,noreferrer');
}

function addToCalendarReception() {
  const lang = getCurrentLang();
  let title = 'Sai Dinesh & Janaki - Reception & Dinner';
  let details = 'You are cordially invited to the Reception & Dinner of V.P. Sai Dinesh & R. Janaki on Sunday, November 15, 2026 from 7:00 PM onwards at Sengundhar Samudhaya Thirumana Mandapam, Sholinghur.';

  if (lang === 'te') {
    title = 'సాయి దినేష్ & జానకి - వివాహ రిసెప్షన్ & విందు';
    details = 'వి.పి. సాయి దినేష్ మరియు ఆర్. జానకి గార్ల వివాహ రిసెప్షన్ & విందు కార్యక్రమానికి మిమ్ములను సకుటుంబ సమేతంగా ఆహ్వానిస్తున్నాము. తేదీ: ఆదివారం, నవంబర్ 15, 2026 సాయంత్రం 7:00 గంటల నుండి.';
  } else if (lang === 'ta') {
    title = 'சாய் தினேஷ் & ஜானகி - திருமண வரவேற்பு & விருந்து';
    details = 'வி.பி. சாய் தினேஷ் & ஆர். ஜானகி திருமண வரவேற்பு மற்றும் இரவு விருந்து நன்னாளில் தாங்கள் குடும்ப சகிதமாக வருகை தந்து மணமக்களை வாழ்த்த அன்போடு அழைக்கின்றோம்.';
  }

  openGoogleCalendar(
    title,
    '20261115T133000Z',
    '20261115T173000Z',
    details,
    'Sengundhar Samudhaya Thirumana Mandapam, Sholinghur, Tamil Nadu'
  );
}

function addToCalendarUpanayanam() {
  const lang = getCurrentLang();
  let title = 'Sai Dinesh & Janaki - Upanayanam Ceremony';
  let details = 'Sacred Upanayanam ceremony of V.P. Sai Dinesh on Monday, November 16, 2026 from 4:00 AM to 5:00 AM at Sengundhar Samudhaya Thirumana Mandapam, Sholinghur.';

  if (lang === 'te') {
    title = 'సాయి దినేష్ & జానకి - పవిత్ర ఉపనయన మహోత్సవం';
    details = 'వి.పి. సాయి దినేష్ పవిత్ర ఉపనయన మహోత్సవం (యజ్ఞోపవీత ధారణ). తేదీ: సోమవారం, నవంబర్ 16, 2026 తెల్లవారుజామున 4:00 నుండి 5:00 గంటల వరకు.';
  } else if (lang === 'ta') {
    title = 'சாய் தினேஷ் & ஜானகி - சுப உபநயன விழா';
    details = 'வி.பி. சாய் தினேஷ் உபநயன நன்னாள்: திங்கள், நவம்பர் 16, 2026 அதிகாலை 4:00 மணி முதல் 5:00 மணி வரை.';
  }

  openGoogleCalendar(
    title,
    '20261115T223000Z',
    '20261115T233000Z',
    details,
    'Sengundhar Samudhaya Thirumana Mandapam, Sholinghur, Tamil Nadu'
  );
}

function addToCalendarMuhurtham() {
  const lang = getCurrentLang();
  let title = '💍 Sai Dinesh & Janaki - Auspicious Wedding Muhurtham';
  let details = 'Auspicious Wedding Ceremony (Muhurtham 5:00 AM – 6:00 AM) of V.P. Sai Dinesh & R. Janaki followed by traditional Kalyana Virundhu (Wedding Feast).';

  if (lang === 'te') {
    title = '💍 సాయి దినేష్ & జానకి - శుభ కళ్యాణ ముహూర్తం';
    details = 'వి.పి. సాయి దినేష్ మరియు ఆర్. జానకి గార్ల శుభ కళ్యాణ ముహూర్తం (మాంగల్యధారణ ఉదయం 5:00 నుండి 6:00 గంటల వరకు) అనంతరం సంప్రదాయ వివాహ భోజనం.';
  } else if (lang === 'ta') {
    title = '💍 சாய் தினேஷ் & ஜானகி - சுப கல்யாண முகூர்த்தம்';
    details = 'வி.பி. சாய் தினேஷ் & ஆர். ஜானகி சுப கல்யாண முகூர்த்தம் (காலை 5:00 மணி முதல் 6:00 மணி வரை), தொடர்ந்து சுப கல்யாண விருந்து.';
  }

  openGoogleCalendar(
    title,
    '20261115T233000Z',
    '20261116T023000Z',
    details,
    'Sengundhar Samudhaya Thirumana Mandapam, Sholinghur, Tamil Nadu'
  );
}

// Aliases for compatibility
function downloadReceptionICS() { addToCalendarReception(); }
function downloadUpanayanamICS() { addToCalendarUpanayanam(); }
function downloadMuhurthamICS() { addToCalendarMuhurtham(); }

/* 8. WHATSAPP RSVP HANDLER */
function handleRSVP(event) {
  event.preventDefault();
  const nameInput = document.getElementById('rsvpName');
  const countInput = document.getElementById('rsvpCount');

  const name = (nameInput && nameInput.value.trim()) || 'Guest';
  const count = (countInput && countInput.value) || '1';
  const lang = getCurrentLang();

  let message = '';
  if (lang === 'te') {
    message = `నమస్కారం! నేను ${name}, సాయి దినేష్ & జానకి వివాహ మహోత్సవానికి ${count} మందితో హాజరవుతున్నాము. నూతన వధూవరులకు మా శుభాకాంక్షలు! 🌸`;
  } else if (lang === 'ta') {
    message = `வணக்கம்! நான் ${name}, சாய் தினேஷ் & ஜானகி திருமண விழாவில் ${count} நபர்களுடன் கலந்து கொள்கிறோம். மணமக்களுக்கு எங்கள் மனமார்ந்த வாழ்த்துகள்! 🌸`;
  } else {
    message = `🙏 Namaskaram! I, ${name}, will attend the wedding of Sai Dinesh & Janaki with ${count} guest(s). Looking forward to sharing this auspicious occasion! 🌸`;
  }

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/8122543467?text=${encodedMsg}`;
  window.open(whatsappUrl, '_blank');
}

/* 9. AUDIO PLAYER WITH SYNTHESIZER FALLBACK */
let isAudioPlaying = false;
let audioContext = null;
let synthInterval = null;

function playAudio() {
  const audio = document.getElementById('bgAudio');
  if (audio && audio.src && audio.src.trim() !== '') {
    audio.play()
      .then(() => {
        isAudioPlaying = true;
        updateAudioIcons(true);
      })
      .catch(() => {
        startCarnaticSynth();
      });
  } else {
    startCarnaticSynth();
  }
}

function pauseAudio() {
  const audio = document.getElementById('bgAudio');
  if (audio) audio.pause();
  stopCarnaticSynth();
  isAudioPlaying = false;
  updateAudioIcons(false);
}

function toggleAudio() {
  if (isAudioPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function updateAudioIcons(playing) {
  const icons = ['audioIcon', 'audioIconTop'];
  const soundwave = document.getElementById('soundwaveBars');

  icons.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = playing ? '🔊' : '🔇';
  });

  if (soundwave) {
    if (playing) soundwave.classList.remove('hidden');
    else soundwave.classList.add('hidden');
  }
}

/* Soft Carnatic Mohanam Raga Synth Fallback */
function startCarnaticSynth() {
  if (isAudioPlaying) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();

    // Tanpura Drone (Sa & Pa)
    playTone(146.83, 9999, 0.04); // D3 (Sa)
    playTone(220.0, 9999, 0.03);  // A3 (Pa)

    // Gentle Mohanam scale notes (D, E, F#, A, B)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
    let noteIdx = 0;

    synthInterval = setInterval(() => {
      if (!isAudioPlaying) return;
      const freq = scale[noteIdx % scale.length];
      playBell(freq, 2.5, 0.05);
      noteIdx = (noteIdx + Math.floor(Math.random() * 2) + 1);
    }, 1800);

    isAudioPlaying = true;
    updateAudioIcons(true);
  } catch (e) {}
}

function stopCarnaticSynth() {
  if (synthInterval) clearInterval(synthInterval);
  if (audioContext) {
    try { audioContext.close(); } catch(e) {}
    audioContext = null;
  }
}

function playTone(freq, duration, volume) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function playBell(freq, duration, volume) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioContext.currentTime);
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

/* 10. INITIALIZATION */
document.addEventListener('DOMContentLoaded', () => {
  // Store preferred language when visiting dedicated page
  const lang = getCurrentLang();
  localStorage.setItem('wedding_lang', lang);

  // Check language auto-redirect if on index.html
  checkAutoLanguageRedirect();

  // Initialize countdown
  initCountdown();
});
