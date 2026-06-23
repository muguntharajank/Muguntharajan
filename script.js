/* ─── THEME ─── */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
});

/* ─── ACTIVE NAV ON SCROLL ─── */
(function () {
  const navItems = document.querySelectorAll('.nav-link-item');
  const mbnItems = document.querySelectorAll('.mbn-item');

  const sections = Array.from(navItems).map(a => {
    const id = a.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  });

  function setActive() {
    const scrollY = window.scrollY + 120;
    let current = 0;

    sections.forEach((sec, i) => {
      if (!sec) return;
      if (sec.offsetTop <= scrollY) current = i;
    });

    navItems.forEach((a, i) => {
      a.classList.toggle('active', i === current);
    });

    // Sync mobile bottom nav
    mbnItems.forEach((a, i) => {
      a.classList.toggle('active', i === current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();

/* ─── HAMBURGER NAV (mobile only) ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}


/* ─── HOLO CARD 3D TILT ─── */
const card = document.getElementById('holoCard');
if(card) {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x*20}deg) rotateX(${-y*15}deg) translateZ(20px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.animation = 'float 6s ease-in-out infinite';
  });
  card.addEventListener('mouseenter', () => { card.style.animation = 'none'; });
}

/* ─── SKILLS ORBIT (CSS CONTROLLED VERSION) ─── */
const orbitContainer = document.getElementById('skillsOrbit');

const skills = [
  {icon:'🚀', label:'Django'},
  {icon:'🗄️', label:'Data Science'},
  {icon:'🌐', label:'HTML/CSS'},
  {icon:'⚡', label:'JavaScript'},
  {icon:'🤖', label:'AI / ML'},
  {icon:'🎨', label:'UI/UX Design'},
  {icon:'🧠', label:'DL / Gen AI'},
  {icon:'📈', label:'Data Analysis'}
];

const inner = [
  {icon:'🐍', label:'Python'},
  {icon:'☕', label:'Java'},
  {icon:'🔷', label:'C'},
  {icon:'💻', label:'C++'}
];

if (orbitContainer) {

  /* ─── RESPONSIVE RADIUS ─── */
  function getOrbitRadii() {
    const w = window.innerWidth;
    if (w <= 768) return { outer: 130, inner: 65 };
    if (w <= 1024) return { outer: 175, inner: 95 };
    return { outer: 210, inner: 115 };
  }

  let { outer: OUTER_RADIUS, inner: INNER_RADIUS } = getOrbitRadii();

  window.addEventListener('resize', () => {
    const r = getOrbitRadii();
    OUTER_RADIUS = r.outer;
    INNER_RADIUS = r.inner;
  });


  /* ─── CREATE ORBIT ITEMS ─── */
  function placeOrbit(items, radius, container) {
    items.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'orbit-item';

      const angle = (i / items.length) * 2 * Math.PI;

      el.style.left = '50%';
      el.style.top = '50%';

      el.style.transform =
        `translate(calc(-50% + ${radius * Math.cos(angle)}px),
                    calc(-50% + ${radius * Math.sin(angle)}px))`;

      el.innerHTML = `
        <div class="orbit-icon">${s.icon}</div>
        <div class="orbit-label">${s.label}</div>
      `;

      container.appendChild(el);
    });
  }

  placeOrbit(skills, OUTER_RADIUS, orbitContainer);
  placeOrbit(inner, INNER_RADIUS, orbitContainer);

  /* ─── ANIMATION ─── */
  let angle = 0;

  function animateOrbit() {
    angle += 0.002;

    const items = orbitContainer.querySelectorAll('.orbit-item');
    const outerItems = Array.from(items).slice(0, skills.length);
    const innerItems = Array.from(items).slice(skills.length);

    /* OUTER ORBIT */
    outerItems.forEach((el, i) => {
      const a = (i / skills.length) * 2 * Math.PI + angle;
      el.style.transform =
        `translate(calc(-50% + ${OUTER_RADIUS * Math.cos(a)}px),
                    calc(-50% + ${OUTER_RADIUS * Math.sin(a)}px))`;
    });

    /* INNER ORBIT (reverse speed for effect) */
    innerItems.forEach((el, i) => {
      const a = (i / inner.length) * 2 * Math.PI - angle * 1.5;
      el.style.transform =
        `translate(calc(-50% + ${INNER_RADIUS * Math.cos(a)}px),
                    calc(-50% + ${INNER_RADIUS * Math.sin(a)}px))`;
    });

    requestAnimationFrame(animateOrbit);
  }

  animateOrbit();
}
/* ─── SCROLL REVEAL + SKILL BARS ─── */
const reveals = document.querySelectorAll('.reveal,.reveal-left,.slide-in-left,.slide-in-up');
const skillFills = document.querySelectorAll('.skill-fill');
let barsAnimated = false;
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.classList.add('visible');
      if(!barsAnimated && e.target.classList.contains('skills-bars')) {
        barsAnimated = true;
        skillFills.forEach(f => {
          f.style.width = f.dataset.pct + '%';
        });
      }
    }
  });
},{threshold:0.12});
reveals.forEach(r => obs.observe(r));
const barsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      skillFills.forEach(f => { f.style.width = f.dataset.pct + '%'; });
    }
  });
},{threshold:0.3});
const barsEl = document.getElementById('skillBars');
if(barsEl) barsObs.observe(barsEl);

/* ─── CANVAS PARTICLE SYSTEM ─── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

/* ── PARTICLES ── */
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.pulse += 0.02;
    if(this.x < 0||this.x > W||this.y < 0||this.y > H) this.reset();
  }
  draw() {
    const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = isLight() ? `rgba(0,100,200,${a*0.5})` : `rgba(0,220,255,${a})`;
    ctx.fill();
  }
}
for(let i = 0; i < 100; i++) particles.push(new Particle());

/* ── FLOATING SQUARES ── */
class FloatSquare {
  constructor() { this.reset(true); }
  reset(init) {
    this.size = Math.random() * 18 + 6;
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + this.size;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.rot = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.012;
    this.alpha = Math.random() * 0.18 + 0.04;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    if(this.y < -this.size * 2) this.reset(false);
    if(this.x < -this.size * 2) this.x = W + this.size;
    if(this.x > W + this.size * 2) this.x = -this.size;
  }
  draw() {
    const lm = isLight();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.strokeStyle = lm ? `rgba(0,100,200,${this.alpha})` : `rgba(0,220,255,${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
    ctx.restore();
  }
}
const squares = [];
for(let i = 0; i < 28; i++) squares.push(new FloatSquare());

/* ── DNA DOUBLE HELIX ── */
let dnaTime = 0;
function drawDNA() {
  const lm = isLight();
  const c1 = lm ? 'rgba(0,100,200,' : 'rgba(0,220,255,';
  const c2 = lm ? 'rgba(98,0,234,' : 'rgba(123,47,255,';

  // Draw two helixes on left and right sides
  const helixConfigs = [
    { cx: W * 0.05, amp: 30 },
    { cx: W * 0.95, amp: 30 }
  ];

  helixConfigs.forEach(({ cx, amp }) => {
    const step = 18;
    const speed = dnaTime * 0.6;
  });

  dnaTime += 0.04;
}

/* ── GRID ── */
function drawGrid() {
  const lm = isLight();
  ctx.strokeStyle = lm ? 'rgba(0,100,200,0.04)' : 'rgba(0,220,255,0.04)';
  ctx.lineWidth = 1;
  const gs = 80;
  for(let x = 0; x < W; x += gs) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for(let y = 0; y < H; y += gs) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
}

/* ── CONNECTIONS ── */
function drawConnections() {
  const lm = isLight();
  for(let i = 0; i < particles.length; i++) {
    for(let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 100) {
        const a = (1 - d/100) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = lm ? `rgba(0,100,200,${a})` : `rgba(0,220,255,${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

/* ── SCAN LINE ── */
let scanY = 0;
function drawScanLine() {
  const lm = isLight();
  scanY = (scanY + 0.5) % H;
  const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0, lm ? 'rgba(0,100,200,0.03)' : 'rgba(0,220,255,0.04)');
  grad.addColorStop(0, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, scanY - 40, W, 80);
}

/* ── RENDER LOOP ── */
function render() {
  ctx.clearRect(0, 0, W, H);
  drawGrid();
  drawScanLine();
  drawDNA();
  particles.forEach(p => { p.update(); p.draw(); });
  squares.forEach(s => { s.update(); s.draw(); });
  drawConnections();
  requestAnimationFrame(render);
}
render();

/* ─── MOUSE PARALLAX ─── */
let mouseX = 0.5, mouseY = 0.5;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
  const hero = document.querySelector('.hero-inner');
  if(hero) {
    const dx = (mouseX - 0.5) * 20;
    const dy = (mouseY - 0.5) * 10;
    hero.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
  }
});

/* ─── SCROLL PARALLAX ─── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const hero = document.querySelector('.hero');
  if(hero) hero.style.backgroundPositionY = sy * 0.5 + 'px';
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {

    btn.addEventListener('click', () => {

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projects.forEach(card => {

            if (
                filter === 'all' ||
                card.dataset.category === filter
            ) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }

        });

    });

});

/* ─── EMAILJS INIT ─── */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof emailjs !== "undefined") {
      emailjs.init("QLusooCQLaY_tbI9D");
      console.log("EmailJS initialized successfully");
    } else {
      console.error("EmailJS SDK not loaded");
    }
  });
})();


/* ─── CONTACT FORM SUBMIT ─── */
async function handleContactSubmit(btn) {

  if (typeof emailjs === "undefined") {
    btn.textContent = "❌ EMAIL SERVICE NOT LOADED";
    setTimeout(() => btn.textContent = "⚡ TRANSMIT MESSAGE", 3000);
    return;
  }

  const name = document.getElementById("contactName")?.value.trim();
  const email = document.getElementById("contactEmail")?.value.trim();

  const serviceSelect = document.getElementById("contactService");
  const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || "";

  const projectName = document.getElementById("contactProjectName")?.value.trim() || "Not Specified";
  const startDate = document.getElementById("startDate")?.value || "Not Specified";
  const endDate = document.getElementById("endDate")?.value || "Not Specified";
  const durationSummary = document.getElementById("durationSummary")?.textContent?.trim() || "Not Specified";
  const message = document.getElementById("contactMsg")?.value.trim();

  /* ─── VALIDATION ─── */
  if (!name || !email || !message) {
    btn.textContent = "⚠ FILL REQUIRED FIELDS";
    setTimeout(() => btn.textContent = "⚡ TRANSMIT MESSAGE", 2000);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    btn.textContent = "⚠ INVALID EMAIL";
    setTimeout(() => btn.textContent = "⚡ TRANSMIT MESSAGE", 2000);
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ SENDING...";

  const templateParams = {
    contactName: name,
    contactEmail: email,
    contactService: service,
    contactProjectName: projectName,
    startDate: startDate,
    endDate: endDate,
    durationSummary: durationSummary,
    contactMsg: message
  };

  console.log("Sending data:", templateParams);

  try {

    /* ─── SEND OWNER EMAIL (critical — must succeed) ─── */
    const ownerResult = await emailjs.send(
      "service_d7yl2oi",
      "template_iy537ld",
      templateParams
    );
    console.log("Owner email sent:", ownerResult.status, ownerResult.text);

  } catch (error) {

    /* Owner email failed — show error and stop */
    console.error("Owner email failed:", error);
    btn.textContent = "❌ FAILED TO SEND";
    btn.title = error?.text || error?.message || "Unknown error";
    setTimeout(() => {
      btn.textContent = "⚡ TRANSMIT MESSAGE";
      btn.title = "";
      btn.disabled = false;
    }, 3000);
    return;

  }

  /* ─── SEND AUTO-REPLY TO APPLICANT ─── */
  try {
    await emailjs.send(
      "service_d7yl2oi",
      "template_a6q01gc",
      {
        to_email:            email,   // REQUIRED: tells EmailJS where to send
        to_name:             name,
        contactName:         name,
        contactEmail:        email,
        contactService:      templateParams.contactService,
        contactProjectName:  templateParams.contactProjectName,
        startDate:           templateParams.startDate,
        endDate:             templateParams.endDate,
        durationSummary:     templateParams.durationSummary,
        contactMsg:          templateParams.contactMsg
      }
    );
    console.log("Auto-reply sent to:", email);
  } catch (err) {
    console.warn("Auto-reply failed (non-critical):", err);
  }

  /* ─── SUCCESS UI ─── */
  btn.textContent = "✓ MESSAGE SENT SUCCESSFULLY";

  /* ─── RESET FORM ─── */
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactService").selectedIndex = 0;
  document.getElementById("contactProjectName").value = "";
  document.getElementById("contactMsg").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";

  const durationEl = document.getElementById("durationSummary");
  if (durationEl) {
    durationEl.textContent = "";
    durationEl.style.display = "none";
  }

  setTimeout(() => {
    btn.textContent = "⚡ TRANSMIT MESSAGE";
    btn.disabled = false;
  }, 3000);
}
/* ─── DURATION CALENDAR ─── */
(function() {
  const startInput = document.getElementById('startDate');
  const endInput   = document.getElementById('endDate');
  const summary    = document.getElementById('durationSummary');

  // Set today as minimum start date
  const today = new Date().toISOString().split('T')[0];
  if (startInput) startInput.min = today;

  function calcDuration() {
    if (!startInput.value || !endInput.value) {
      summary.style.display = 'none';
      return;
    }

    const start = new Date(startInput.value);
    const end   = new Date(endInput.value);

    if (end <= start) {
      summary.style.display = 'block';
      summary.style.background = 'rgba(255,45,120,0.08)';
      summary.style.borderColor = 'rgba(255,45,120,0.3)';
      summary.style.color = 'var(--c3)';
      summary.textContent = '⚠ End date must be after start date';
      return;
    }

    const diffMs   = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeks    = Math.floor(diffDays / 7);
    const months   = Math.floor(diffDays / 30);

    let label = '';
    if (diffDays < 7)        label = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    else if (diffDays < 30)  label = `${weeks} week${weeks > 1 ? 's' : ''} (${diffDays} days)`;
    else                     label = `${months} month${months > 1 ? 's' : ''} (${diffDays} days)`;

    summary.style.display = 'block';
    summary.style.background = 'rgba(0,220,255,0.06)';
    summary.style.borderColor = 'rgba(0,220,255,0.2)';
    summary.style.color = 'var(--c1)';
    summary.textContent = `⏱ Duration: ${label}`;
  }

  if (startInput) {
    startInput.addEventListener('change', () => {
      // Push end date min forward when start changes
      if (endInput) endInput.min = startInput.value;
      calcDuration();
    });
  }

  if (endInput) {
    endInput.addEventListener('change', calcDuration);
  }
})();

 /* ─── PRELOADER ─── */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("preloader").classList.add("hide");
  }, 1800);
});

  /* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  const scrolled = (scrollTop / scrollHeight) * 100;

  progressBar.style.width = scrolled + "%";
});

/* ─── TYPEWRITER — ABOUT TITLE ─── */
(function () {
  const el = document.querySelector('.tw-role');
  if (!el) return;

  const roles = [
    'Software Developer',
    'Python Developer',
    'ML Engineer',
    'AI Developer',
    'Web Developer',
    'UI/UX Designer',
    'Data Scientist',
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER  = 1800;
  const PAUSE_EMPTY  = 400;

  function tick() {
    const current = roles[roleIdx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    }
  }

  // Fixed cursor span placed after .tw-role
  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.textContent = '|';
  el.insertAdjacentElement('afterend', cursor);

  const s = document.createElement('style');
  s.textContent = `
    .tw-cursor {
      display: inline-block;
      margin-left: 2px;
      color: var(--c1, #00dcff);
      animation: tw-blink 0.75s step-end infinite;
      font-weight: 400;
    }
    @keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  `;
  document.head.appendChild(s);

  tick();
})();

/* ─── CUSTOM CURSOR ─── */
(function () {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  // Create cursor elements
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { cursor: none !important; }

    #cursor-dot {
      position: fixed;
      width: 8px;
      height: 8px;
      background: var(--c1, #00dcff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 0 8px var(--c1, #00dcff), 0 0 16px var(--c1, #00dcff);
    }

    #cursor-ring {
      position: fixed;
      width: 36px;
      height: 36px;
      border: 2px solid var(--c1, #00dcff);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      opacity: 0.6;
      transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease,
                  border-color 0.2s;
    }

    /* Hover effect on clickable elements */
    body.cursor-hover #cursor-dot {
      transform: translate(-50%, -50%) scale(1.8);
      background: var(--c2, #ff2d78);
      box-shadow: 0 0 12px var(--c2, #ff2d78), 0 0 24px var(--c2, #ff2d78);
    }

    body.cursor-hover #cursor-ring {
      width: 52px;
      height: 52px;
      border-color: var(--c2, #ff2d78);
      opacity: 0.4;
    }

    /* Click burst */
    body.cursor-click #cursor-dot {
      transform: translate(-50%, -50%) scale(0.6);
    }

    body.cursor-click #cursor-ring {
      width: 60px;
      height: 60px;
      opacity: 0.1;
    }
  `;
  document.head.appendChild(style);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with smooth lag
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const interactives = 'a, button, input, textarea, select, label, [role="button"], .filter-btn, .orbit-item, .project-card, .cert-card, #holoCard';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click burst
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '';
    ring.style.opacity = '';
  });
})();
