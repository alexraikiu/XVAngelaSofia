// ── Música ──────────────────────────────────────────────────────────────────
const music = document.getElementById('bgMusic');
const label = document.getElementById('audio-label');
let playing = false;

function tryAutoplay() {
  const p = music.play();
  if (p !== undefined) {
    p.then(() => { playing = true; label.textContent = 'Pausar'; })
     .catch(() => {
       document.addEventListener('click', () => {
         music.play().then(() => { playing = true; label.textContent = 'Pausar'; });
       }, { once: true });
     });
  }
}

function toggleMusic() {
  if (playing) { music.pause(); playing = false; label.textContent = 'Música'; }
  else         { music.play();  playing = true;  label.textContent = 'Pausar'; }
}

tryAutoplay();

// ── Cuenta regresiva ─────────────────────────────────────────────────────────
const weddingDate = new Date(2026, 6, 26, 19, 30, 0);

function updateCountdown() {
  const diff = weddingDate - new Date();
  if (diff <= 0) {
    ['days','hours','mins','secs'].forEach(k => document.getElementById('cd-'+k).textContent = '0');
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000)  / 60000);
  const s = Math.floor((diff % 60000)    / 1000);
  document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── RSVP ─────────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxkABuICKh9mXyQczJ_6trTajH0dPZa1Hv9GFdLYO1SB0AEdXDCEyk1MX68RJejNsAeKg/exec"
const guestAsiste = document.getElementById('guestAsiste');
if (guestAsiste) {
  guestAsiste.addEventListener('change', function () {
    document.getElementById('guestAcomp').style.display =
      this.value === 'Sí' ? 'block' : 'none';
  });
}

async function confirmarAsistencia() {
  const nombre  = document.getElementById('guestName').value.trim();
  const asiste  = document.getElementById('guestAsiste').value;
  const acomp   = parseInt(document.getElementById('guestAcomp').value || 0);
  const mensaje = document.getElementById('guestMsg').value.trim();
  const status  = document.getElementById('rsvp-status');
  const btn     = document.getElementById('btn-rsvp');
  const input   = document.getElementById('guestName');

  if (!nombre) {
    input.style.borderColor = 'rgba(184,147,90,0.8)';
    input.placeholder = 'Por favor escribe tu nombre';
    return;
  }
  if (!asiste) {
    status.textContent = 'Por favor indica si asistirás.';
    return;
  }

  btn.disabled = true;
  status.textContent = 'Enviando...';

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        asistencia: asiste,
        acompanantes: asiste === 'Sí' ? acomp : 0,
        total: asiste === 'Sí' ? acomp + 1 : 0,
        mensaje
      })
    });

    document.getElementById('rsvp-form').style.display = 'none';
    const s = document.getElementById('rsvp-success');
    s.style.display = 'block';
    document.getElementById('rsvp-ok').textContent = asiste === 'Sí'
      ? '¡Nos vemos en los XV, '    + nombre.split(' ')[0] + '!'
      : '¡Gracias por avisarnos, '   + nombre.split(' ')[0] + '!';

  } catch (err) {
    status.textContent = 'Error al enviar. Intenta de nuevo.';
    btn.disabled = false;
  }
}

// ── Animaciones fade-up ───────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
