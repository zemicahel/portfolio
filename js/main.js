/* ===== NAV ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop, height = sec.offsetHeight, id = sec.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ===== TYPING EFFECT ===== */
const roles = ['AI Developer', 'Machine Learning Engineer', 'Full-Stack Software Engineer'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = roles[ri];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  let delay = deleting ? 40 : 80;
  if (!deleting && ci > word.length) { delay = 1800; deleting = true; }
  else if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== COUNTER ===== */
function easeOutQuad(t) { return t * (2 - t); }

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const start = performance.now();
    const duration = 2000;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutQuad(t) * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ===== PROJECT FILTER ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ===== TESTIMONIALS CAROUSEL ===== */
const track = document.getElementById('testimonial-track');
const dots = document.querySelectorAll('.t-dot');
let tIndex = 0, tTotal = dots.length, tTimer;

function goTo(i) {
  tIndex = (i + tTotal) % tTotal;
  track.style.transform = `translateX(-${tIndex * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === tIndex));
}

document.getElementById('t-prev').addEventListener('click', () => { clearInterval(tTimer); goTo(tIndex - 1); startTimer(); });
document.getElementById('t-next').addEventListener('click', () => { clearInterval(tTimer); goTo(tIndex + 1); startTimer(); });
dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(tTimer); goTo(i); startTimer(); }));

function startTimer() { tTimer = setInterval(() => goTo(tIndex + 1), 5000); }
startTimer();

/* ===== CONTACT FORM ===== */
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const fields = [
    { id: 'f-name', err: 'err-name', msg: 'Name is required.' },
    { id: 'f-email', err: 'err-email', msg: 'Valid email is required.' },
    { id: 'f-subject', err: 'err-subject', msg: 'Subject is required.' },
    { id: 'f-message', err: 'err-message', msg: 'Message is required.' },
  ];
  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const errEl = document.getElementById(f.err);
    const isEmail = f.id === 'f-email';
    const fail = !el.value.trim() || (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
    errEl.textContent = fail ? f.msg : '';
    if (fail) valid = false;
  });
  if (valid) {
    e.target.innerHTML = '<div class="form-success"><h3>Message Sent!</h3><p>Thank you. I\'ll get back to you shortly.</p></div>';
  }
});

/* ===== GITHUB REPOS ===== */
fetch('https://api.github.com/users/zemicahel/repos?sort=stars&per_page=4')
  .then(r => r.json())
  .then(repos => {
    if (!Array.isArray(repos)) return;
    const grid = document.getElementById('repos-grid');
    grid.innerHTML = repos.map(r => `
      <div class="repo-card reveal">
        <div class="repo-name">${r.name}</div>
        <div class="repo-desc">${r.description || 'No description'}</div>
        <div class="repo-meta">
          ${r.language ? `<span class="repo-lang"><span class="lang-dot"></span>${r.language}</span>` : ''}
          <span class="repo-stars"><i class="fas fa-star"></i> ${r.stargazers_count}</span>
        </div>
      </div>`).join('');
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }).catch(() => {});

/* ===== PARTICLES ===== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108,99,255,0.5)';
      ctx.fill();
    });
    particles.forEach((a, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108,99,255,${0.15 * (1 - d / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();
