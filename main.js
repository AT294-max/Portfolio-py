/* main.js — talks to Python Flask backend at port 5000 */

const API = 'http://localhost:5000/api';

// ── Nav scroll ───────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav ───────────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

// ── Fade-in observer ─────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// ── Load projects from Python API ────────────────────────────
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res  = await fetch(`${API}/projects`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    grid.innerHTML = '';
    data.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card fade-in';
      card.style.transitionDelay = (i * 0.08) + 's';
      card.innerHTML = `
        <div class="project-card__thumb">${p.emoji}</div>
        <div class="project-card__body">
          <div class="project-card__tags">
            ${p.tags.map(t => `<span class="project-card__tag">${t}</span>`).join('')}
          </div>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description}</p>
          <div class="project-card__links">
            ${p.liveUrl   ? `<a href="${p.liveUrl}"   target="_blank">↗ Live Demo</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank">⌥ GitHub</a>`   : ''}
          </div>
        </div>`;
      grid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 60 + i * 80);
    });
  } catch (err) {
    grid.innerHTML = `
      <div class="projects__loading">
        ⚠️ Could not load projects — make sure Python server is running.<br/>
        <small>Run: <code>python server.py</code> &nbsp;|&nbsp; Error: ${err.message}</small>
      </div>`;
  }
}

loadProjects();

// ── Contact form → POST to Python API ───────────────────────
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const status    = document.getElementById('formStatus');

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErrors();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();

  let valid = true;
  if (name.length < 2)                               { addErr('fname',    'Name must be at least 2 characters.'); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    { addErr('femail',   'Enter a valid email address.');        valid = false; }
  if (message.length < 10)                           { addErr('fmessage', 'Message must be at least 10 characters.'); valid = false; }
  if (!valid) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res  = await fetch(`${API}/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });
    const data = await res.json();

    if (res.ok) {
      showStatus('success', `✅ Thanks ${name}! I'll get back to you soon.`);
      form.reset();
    } else {
      showStatus('error', `❌ ${data.error || 'Something went wrong.'}`);
    }
  } catch {
    showStatus('error', '❌ Could not reach the server. Is Python running?');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }
});

function addErr(id, msg) {
  const el  = document.getElementById(id);
  el.classList.add('error');
  const div = document.createElement('div');
  div.className   = 'field-err';
  div.textContent = msg;
  el.parentNode.appendChild(div);
}
function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.field-err').forEach(el => el.remove());
  status.className   = 'form-status';
  status.textContent = '';
}
function showStatus(type, msg) {
  status.className   = `form-status ${type}`;
  status.textContent = msg;
  status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
