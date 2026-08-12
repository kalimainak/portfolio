window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        initHeroReveal();
    }, 2000);
});

function initHeroReveal() {
    const kicker = document.querySelector('.hero-content .section-kicker');
    const first = document.querySelector('.hero-first');
    const last = document.querySelector('.hero-last');
    const lead = document.querySelector('.hero-lead');
    const actions = document.querySelector('.hero-actions');
    const meta = document.querySelector('.hero-meta');
    const visual = document.querySelector('.hero-visual');
    const items = [kicker, first, last, lead, actions, meta, visual];
    items.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all .9s cubic-bezier(.23,1,.32,1) ' + (i * 0.12) + 's';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
        });
    });
}

const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursorDot.style.opacity = '1'; });
document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; });
function animateCursor() {
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .work-card, .skill-item, .panel, .metric, .magnetic-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); });
});

const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');
let heroNodes = [], heroMouseX = -1000, heroMouseY = -1000;
function resizeHero() { heroCanvas.width = heroCanvas.parentElement.offsetWidth; heroCanvas.height = heroCanvas.parentElement.offsetHeight; }
resizeHero(); window.addEventListener('resize', () => { resizeHero(); initHeroNodes(); });
class HeroNode {
    constructor() { this.x = Math.random() * heroCanvas.width; this.y = Math.random() * heroCanvas.height; this.baseX = this.x; this.baseY = this.y; this.size = Math.random() * 2 + .5; this.vx = 0; this.vy = 0; }
    update() {
        const dx = this.x - heroMouseX, dy = this.y - heroMouseY, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) { const f = (180 - dist) / 180, a = Math.atan2(dy, dx); this.vx += Math.cos(a) * f * 3; this.vy += Math.sin(a) * f * 3; }
        this.vx += (this.baseX - this.x) * .02; this.vy += (this.baseY - this.y) * .02;
        this.vx *= .92; this.vy *= .92; this.x += this.vx; this.y += this.vy;
    }
    draw() { hCtx.beginPath(); hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); hCtx.fillStyle = 'rgba(200,164,92,.5)'; hCtx.fill(); }
}
function initHeroNodes() { heroNodes = []; for (let i = 0; i < Math.min(150, Math.floor((heroCanvas.width * heroCanvas.height) / 6000)); i++) heroNodes.push(new HeroNode()); }
initHeroNodes();
function drawHeroWeb() {
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    heroNodes.forEach(n => { n.update(); n.draw(); });
    for (let i = 0; i < heroNodes.length; i++) for (let j = i + 1; j < heroNodes.length; j++) {
        const dx = heroNodes[i].x - heroNodes[j].x, dy = heroNodes[i].y - heroNodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { hCtx.beginPath(); hCtx.strokeStyle = 'rgba(200,164,92,' + ((1 - dist / 100) * .3) + ')'; hCtx.lineWidth = .5; hCtx.moveTo(heroNodes[i].x, heroNodes[i].y); hCtx.lineTo(heroNodes[j].x, heroNodes[j].y); hCtx.stroke(); }
    }
    requestAnimationFrame(drawHeroWeb);
}
drawHeroWeb();
heroCanvas.addEventListener('mousemove', (e) => { const r = heroCanvas.getBoundingClientRect(); heroMouseX = e.clientX - r.left; heroMouseY = e.clientY - r.top; });
heroCanvas.addEventListener('mouseleave', () => { heroMouseX = -1000; heroMouseY = -1000; });

const progressFill = document.querySelector('.progress-fill');
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
    const st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = (st / dh) * 100 + '%';
    topbar.classList.toggle('scrolled', st > 100);
});

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const menuClose = document.getElementById('menuClose');
const navBackdrop = document.getElementById('navBackdrop');
function openMenu() { mobileNav.classList.add('open'); navBackdrop.classList.add('open'); menuToggle.classList.add('active'); document.body.classList.add('menu-open'); }
function closeMenu() { mobileNav.classList.remove('open'); navBackdrop.classList.remove('open'); menuToggle.classList.remove('active'); document.body.classList.remove('menu-open'); }
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
navBackdrop.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-links a').forEach(l => l.addEventListener('click', closeMenu));

gsap.registerPlugin(ScrollTrigger);

function createScrollReveals() {
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 95%' }, x: -30, opacity: 0, duration: .8, ease: 'power3.out' });
    });

    gsap.utils.toArray('.section-kicker').forEach(el => {
        if (el.closest('.hero-content')) return;
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 95%' }, y: 20, opacity: 0, duration: .7, ease: 'power3.out' });
    });

    gsap.utils.toArray('h2').forEach(el => {
        const lines = el.innerHTML.split('<br>');
        el.innerHTML = lines.map(l => '<span class="line-reveal-wrap">' + l + '</span>').join('');
        gsap.from(el.querySelectorAll('.line-reveal-wrap'), {
            scrollTrigger: { trigger: el, start: 'top 95%' },
            y: 60, opacity: 0, duration: 1, stagger: .12, ease: 'power4.out'
        });
    });

    gsap.utils.toArray('.section-head>p').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 95%' }, y: 20, opacity: 0, duration: .7, delay: .2, ease: 'power3.out' });
    });

    gsap.utils.toArray('.split-right > *').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 50, opacity: 0, duration: .9, delay: i * .1, ease: 'power3.out' });
    });

    gsap.utils.toArray('.metric').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, y: 60, opacity: 0, duration: .8, delay: i * .12, ease: 'power3.out' });
    });

    gsap.utils.toArray('.skill-item').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, y: 80, opacity: 0, scale: .95, duration: .9, delay: (i % 3) * .1, ease: 'power3.out' });
    });

    gsap.utils.toArray('.work-card').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
            y: 80, opacity: 0, scale: .95, duration: .9, delay: (i % 2) * .12, ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.panel').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 90%' }, y: 70, opacity: 0, duration: .9, delay: i * .12, ease: 'power3.out' });
    });

    gsap.from('.contact-layout', { scrollTrigger: { trigger: '.contact-layout', start: 'top 85%' }, y: 80, opacity: 0, duration: 1, ease: 'power3.out' });

    gsap.from('.quote-block', {
        scrollTrigger: { trigger: '.quote-block', start: 'top 85%' },
        y: 60, opacity: 0, scale: .95, rotation: -3, duration: 1, ease: 'power3.out'
    });

    gsap.utils.toArray('.skill-fill').forEach(fill => {
        ScrollTrigger.create({ trigger: fill, start: 'top 92%', onEnter: () => { fill.style.width = fill.getAttribute('data-width') + '%'; } });
    });

    gsap.utils.toArray('.contact-facts article').forEach((el, i) => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 92%' }, y: 30, opacity: 0, duration: .6, delay: i * .08, ease: 'power3.out' });
    });
}
createScrollReveals();

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target, target = parseInt(el.getAttribute('data-count'));
            let current = 0;
            const timer = setInterval(() => { current += target / 40; if (current >= target) { el.textContent = target; clearInterval(timer); } else el.textContent = Math.floor(current); }, 40);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: .5 });
document.querySelectorAll('.metric strong').forEach(m => counterObserver.observe(m));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) { e.preventDefault(); const t = document.querySelector(this.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
});

const secs = document.querySelectorAll('section');
const nLinks = document.querySelectorAll('.desktop-nav a');
window.addEventListener('scroll', () => {
    let c = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 200) c = s.getAttribute('id'); });
    nLinks.forEach(l => { l.style.color = l.getAttribute('href') === '#' + c ? '#c8a45c' : ''; });
});

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formState = document.getElementById('formState');
document.getElementById('sendAgain').addEventListener('click', () => { contactForm.reset(); contactForm.style.display = 'grid'; formSuccess.classList.remove('show'); formState.textContent = 'READY'; formState.style.color = '#c8a45c'; });
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const type = contactForm.querySelector('[name="type"]').value;
    const message = contactForm.querySelector('[name="message"]').value.trim();
    const subject = encodeURIComponent('[Portfolio Inquiry] ' + type + ' — from ' + name);
    const body = encodeURIComponent('Hi Vinay,\n\n' + message + '\n\n---\nName: ' + name + '\nEmail: ' + email + '\nProject Type: ' + type);
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=vinayvarmathogaru42@gmail.com&su=' + subject + '&body=' + body, '_blank');
    formState.textContent = 'SENT';
    formState.style.color = '#27f58b';
    setTimeout(() => { contactForm.style.display = 'none'; formSuccess.classList.add('show'); }, 800);
});

document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const effect = card.querySelector('.card-web-effect');
        if (effect) { effect.style.setProperty('--x', ((e.clientX - r.left) / r.width * 100) + '%'); effect.style.setProperty('--y', ((e.clientY - r.top) / r.height * 100) + '%'); }
        const tx = (e.clientX - r.left) / r.width - .5, ty = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(1000px) rotateY(' + (tx * 8) + 'deg) rotateX(' + (-ty * 8) + 'deg) translate(-4px,-4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    const s = window.scrollY;
    if (hero && s < window.innerHeight) { hero.style.transform = 'translateY(' + (s * .15) + 'px)'; hero.style.opacity = 1 - (s / window.innerHeight); }
});

document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-5px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * .3) + 'px, ' + (y * .3) + 'px)';
        btn.style.transition = 'transform .2s ease-out';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
    });
});

document.getElementById('year').textContent = new Date().getFullYear();
