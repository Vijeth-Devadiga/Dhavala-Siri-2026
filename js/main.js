III/* ═══════════════════════════════════════
   DHAVALA SIRI — Main JS
═══════════════════════════════════════ */

// ── CUSTOM CURSOR ──────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

const hoverEls = 'a, button, [data-page], [data-event]';
document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
});

(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// ── FIRE CANVAS ────────────────────────
(function initFireCanvas() {
  const canvas = document.getElementById('fire-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Ember {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = H + 10;
      this.vx  = (Math.random() - .5) * .8;
      this.vy  = -(Math.random() * 1.5 + .4);
      this.r   = Math.random() * 3 + 1;
      this.life = 1;
      this.decay = Math.random() * .004 + .002;
      const hue = Math.random() * 30 + 10; // 10-40 red/orange
      this.color = `hsl(${hue},100%,60%)`;
    }
    update() {
      this.x += this.vx + Math.sin(this.y * .02) * .3;
      this.y += this.vy;
      this.life -= this.decay;
      this.r *= .999;
      if (this.life <= 0 || this.y < -20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * .6;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = this.r * 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 60; i++) {
    const e = new Ember();
    e.y = Math.random() * H; // spread initial positions
    e.life = Math.random();
    particles.push(e);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // bottom glow gradient
    const g = ctx.createLinearGradient(0, H * .6, 0, H);
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, 'rgba(180,30,0,.12)');
    ctx.fillStyle = g;
    ctx.fillRect(0, H * .6, W, H * .4);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── HERO PARTICLES ─────────────────────
(function spawnHeroParticles() {
  const container = document.getElementById('hero-particles');
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    const sz = Math.random() * 4 + 2;
    const hue = Math.random() * 40 + 5;
    p.style.cssText = `
      position:absolute; border-radius:50%;
      width:${sz}px; height:${sz}px;
      left:${Math.random() * 100}%;
      background:hsl(${hue},100%,65%);
      box-shadow:0 0 ${sz * 3}px hsl(${hue},100%,55%);
      animation:float-up ${Math.random() * 8 + 6}s linear ${Math.random() * 8}s infinite;
      opacity:0;
    `;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0%   { transform: translateY(100vh) scale(0); opacity:0; }
      8%   { opacity:.7; }
      90%  { opacity:.15; }
      100% { transform: translateY(-15vh) scale(1.4); opacity:0; }
    }`;
  document.head.appendChild(style);
})();

// ── NAVBAR SCROLL ──────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  revealOnScroll();
});

// ── NAVIGATION ─────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-page') === id);
  });
  closeMenu();
  setTimeout(revealOnScroll, 50);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-page]');
  if (el) { e.preventDefault(); showPage(el.getAttribute('data-page')); }
});

// ── HAMBURGER ──────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
function closeMenu() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
}

// ── SCROLL REVEAL ──────────────────────
function revealOnScroll() {
  document.querySelectorAll('.reveal:not(.vis)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 70) el.classList.add('vis');
  });
}
revealOnScroll();

// ── COUNTDOWN ──────────────────────────
(function startCountdown() {
  const target = new Date('2026-04-01T00:00:00');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = pad(val); };
    set('cd-days', days); set('cd-hours', hours);
    set('cd-mins', mins); set('cd-secs', secs);
  }
  tick();
  setInterval(tick, 1000);
})();

// ── MODAL DATA ─────────────────────────
function ruleRow(n, txt) {
  return `<div class="rule-row"><div class="rule-n">${n}</div><div>${txt}</div></div>`;
}
function coordCard(role, name, phone, email) {
  return `<div class="modal-coord-card">
    <div class="modal-coord-av">👤</div>
    <div>
      <div class="modal-coord-role">${role}</div>
      <div class="modal-coord-name">${name}</div>
      <div class="modal-coord-contact">
        <a href="tel:${phone}">📞 ${phone}</a>
        ${email ? `<br><a href="mailto:${email}">✉️ ${email}</a>` : ''}
      </div>
    </div>
  </div>`;
}
function chip(icon, label) { return `<div class="chip"><span>${icon}</span>${label}</div>`; }
function prizeChip(icon, label) { return `<div class="prize-chip"><span class="p-ico">${icon}</span><span>${label}</span></div>`; }

const eventData = {
  cultural: {
    title: '🎭 Cultural Performance',
    html: `
      <div class="m-section">Individual Categories</div>
      <div class="chip-row">${chip('💃','Dance')}${chip('🎙️','Mono Acting')}${chip('🤫','Mime')}${chip('🦜','Mimicry')}${chip('✨','Other Creative Performances')}</div>
      <div class="m-section">Group Categories</div>
      <div class="chip-row">${chip('👯','Group Dance')}${chip('🎭','Skits / Plays')}</div>
      <div class="m-section">Competition Rules</div>
      <div class="rule-rows">
        ${ruleRow(1,'No entry fee for participation.')}
        ${ruleRow(2,'Open only to Degree &amp; PG colleges affiliated with <strong>Mangalore University</strong>.')}
        ${ruleRow(3,'Only <strong>one team per college</strong> is allowed.')}
        ${ruleRow(4,'Team size: minimum <strong>6 members</strong>, maximum <strong>16 members</strong>.')}
        ${ruleRow(5,'All performances (individual &amp; group) must be based on the <strong>main theme</strong>.')}
        ${ruleRow(6,'Each team gets <strong>20 minutes</strong> for their performance.')}
        ${ruleRow(7,'5 minutes for stage setup + 5 minutes to clear the stage.')}
        ${ruleRow(8,'Performances must not disrespect religion, caste, or cultural practices of <strong>Tulu Nadu</strong>.')}
        ${ruleRow(9,'Evaluation: Creativity, Activity, Presentation, and Costumes.')}
        ${ruleRow(10,'CD / pen drive or live performance allowed. Test media before the event. Organisers not responsible for technical issues.')}
        ${ruleRow(11,'Register via Email or WhatsApp on or before <strong>01-04-2026</strong>.')}
        ${ruleRow(12,'Only basic lighting and microphone facilities provided.')}
        ${ruleRow(13,'Performances exceeding time will <strong>not</strong> be considered for evaluation.')}
        ${ruleRow(14,'Participants will be provided <strong>breakfast and lunch</strong>.')}
        ${ruleRow(15,'Carry your <strong>College ID Card</strong> and a confirmation letter from the Principal.')}
      </div>
      <div class="m-section">Prizes</div>
      <div class="prize-row">
        ${prizeChip('🥇','First Prize — <strong>₹12,000</strong>')}
        ${prizeChip('🥈','Second Prize — <strong>₹8,000</strong>')}
        ${prizeChip('🥉','Third Prize — <strong>₹5,000</strong>')}
      </div>
      <div class="prize-row" style="margin-top:.6rem">
        ${prizeChip('🏆','Permanent Trophy for Winners')}
        ${prizeChip('🌟','Best Individual Actor / Actress')}
        ${prizeChip('🎖️','Best Program Presentation')}
      </div>
      <div class="m-section">Coordinators</div>
      <div class="modal-coord-grid">
        ${coordCard('Student Coordinator','Prajwal P. Poojary','8549991566','prajwalpoojary046@gmail.com')}
        ${coordCard('Student Coordinator','Sushanth','6364242502','')}
        ${coordCard('Faculty Coordinator','Mrs. Mallika Rao','9945249401','mallikarao3642@gmail.com')}
      </div>`
  },
  quiz: {
    title: '🧠 Quiz Competition',
    html: `
      <div class="m-section">Rules</div>
      <div class="rule-rows">
        ${ruleRow(1,'Each team must have exactly <strong>2 students</strong>.')}
        ${ruleRow(2,'Questions cover: General Knowledge, Current Affairs, Commerce / Business, Sports, History, Science, and Technology.')}
        ${ruleRow(3,'First and Second prizes will be awarded.')}
        ${ruleRow(4,"Judges' decision will be final.")}
      </div>
      <div class="m-section">Topics Covered</div>
      <div class="chip-row">
        ${chip('📰','General Knowledge')}${chip('📅','Current Affairs')}${chip('💼','Commerce / Business')}
        ${chip('⚽','Sports')}${chip('🏛️','History')}${chip('🔬','Science')}${chip('💻','Technology')}
      </div>
      <div class="m-section">Prizes</div>
      <div class="prize-row">
        ${prizeChip('🥇','First Prize')}
        ${prizeChip('🥈','Second Prize')}
      </div>
      <div class="m-section">Coordinators</div>
      <div class="modal-coord-grid">
        ${coordCard('Student Coordinator','Shodhan D. Naik','8105594323','')}
        ${coordCard('Faculty Coordinator','Taranath K.','9008045375','')}
      </div>`
  },
  rangoli: {
    title: '🎨 Rangoli Competition',
    html: `
      <div class="m-section">Rules</div>
      <div class="rule-rows">
        ${ruleRow(1,'Individual competition only.')}
        ${ruleRow(2,'Rangoli size must be exactly <strong>3 × 3 feet</strong>.')}
        ${ruleRow(3,'Participants must bring their <strong>own rangoli powder and materials</strong>.')}
        ${ruleRow(4,'Only rangoli powder should be used — no other materials.')}
        ${ruleRow(5,'Design must be <strong>free-hand</strong>. Stencils, stickers, or printed designs are <strong>not allowed</strong>.')}
        ${ruleRow(6,'Participants will have <strong>2 hours</strong> to complete the rangoli.')}
        ${ruleRow(7,"Judges' decision will be final.")}
      </div>
      <div class="m-section">Evaluation Criteria</div>
      <div class="chip-row">
        ${chip('🖌️','Creativity')}${chip('✅','Completeness')}${chip('🌈','Colour Combination')}
      </div>
      <div class="m-section">Prizes</div>
      <div class="prize-row">
        ${prizeChip('🥇','First Prize')}
        ${prizeChip('🥈','Second Prize')}
      </div>
      <div class="m-section">Coordinators</div>
      <div class="modal-coord-grid">
        ${coordCard('Student Coordinator','K. Sanjana','6364497487','')}
        ${coordCard('Faculty Coordinator','Mrs. Akshata Marathe','9008926200','')}
      </div>`
  },
  reels: {
    title: '📱 Instagram Reels Competition',
    html: `
      <div class="m-section">Rules</div>
      <div class="rule-rows">
        ${ruleRow(1,'Individually or as a team (maximum <strong>2 members</strong>).')}
        ${ruleRow(2,'Reel duration: <strong>30 to 60 seconds</strong>. Reels exceeding this will not be evaluated.')}
        ${ruleRow(3,'Theme of the reel must be <strong>"Dhavala Siri"</strong>.')}
        ${ruleRow(4,'Content must be <strong>original</strong>. Copied content = disqualification.')}
        ${ruleRow(5,'No obscene, abusive, political, religious, or offensive material.')}
        ${ruleRow(6,'Record vertically in <strong>9:16 aspect ratio</strong>.')}
        ${ruleRow(7,'Basic editing, filters, music, and transitions allowed. No copyright-protected music.')}
        ${ruleRow(8,'Each participant / team may submit <strong>only one reel</strong>.')}
        ${ruleRow(9,'Submit before <strong>3:00 PM</strong> on the day of the event.')}
        ${ruleRow(10,'Upload on Instagram and add <strong>@sri_dhavala_college_mdb</strong> as a collaborator.')}
        ${ruleRow(11,"Judges' decision will be final.")}
      </div>
      <div class="m-section">Evaluation Criteria</div>
      <div class="chip-row">
        ${chip('💡','Creativity &amp; Originality')}${chip('🎯','Relevance to Theme')}
      </div>
      <div class="m-section">Coordinators</div>
      <div class="modal-coord-grid">
        ${coordCard('Student Coordinator','Samith','8296543236','')}
        ${coordCard('Faculty Coordinator','Sri Suprith Kotian','8762358183','')}
      </div>`
  }
};

// ── MODAL LOGIC ────────────────────────
const overlay   = document.getElementById('modal-overlay');
const modalTitle= document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-event]');
  if (!btn) return;
  const d = eventData[btn.getAttribute('data-event')];
  if (!d) return;
  modalTitle.textContent = d.title;
  modalBody.innerHTML = d.html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.getElementById('modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── INIT ───────────────────────────────
showPage('home');
