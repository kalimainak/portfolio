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
const cursorWeb = document.getElementById('cursorWeb');
let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, webX = 0, webY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursorDot.style.opacity = '1'; cursorWeb.style.opacity = '1'; });
document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorWeb.style.opacity = '0'; });
function animateCursor() {
    dotX += (mouseX - dotX) * 0.15; dotY += (mouseY - dotY) * 0.15;
    webX += (mouseX - webX) * 0.08; webY += (mouseY - webY) * 0.08;
    cursorDot.style.left = dotX + 'px'; cursorDot.style.top = dotY + 'px';
    cursorWeb.style.left = webX + 'px'; cursorWeb.style.top = webY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .work-card, .skill-item, .panel, .metric, .magnetic-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); cursorWeb.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); cursorWeb.classList.remove('hover'); });
});

document.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.style.cssText = 'position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;width:4px;height:4px;background:#ef233c;border-radius:50%;pointer-events:none;z-index:1997;box-shadow:0 0 10px #ef233c';
        document.body.appendChild(p);
        const a = (i / 10) * Math.PI * 2, v = 60 + Math.random() * 50;
        gsap.to(p, { x: Math.cos(a) * v, y: Math.sin(a) * v, opacity: 0, scale: 0, duration: .7, ease: 'power3.out', onComplete: () => p.remove() });
    }
});

const rainCanvas = document.getElementById('rainCanvas');
const rCtx = rainCanvas.getContext('2d');
let drops = [];
function resizeRain() { rainCanvas.width = window.innerWidth; rainCanvas.height = window.innerHeight; }
resizeRain(); window.addEventListener('resize', resizeRain);
function createDrop() { return { x: Math.random() * rainCanvas.width, y: Math.random() * -rainCanvas.height, length: Math.random() * 25 + 10, speed: Math.random() * 5 + 3, opacity: Math.random() * .3 + .1 }; }
function initDrops() { drops = []; for (let i = 0; i < Math.min(120, Math.floor(rainCanvas.width / 12)); i++) drops.push(createDrop()); }
initDrops();
function drawRain() {
    rCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    drops.forEach(d => { rCtx.beginPath(); rCtx.moveTo(d.x, d.y); rCtx.lineTo(d.x + .5, d.y + d.length); rCtx.strokeStyle = 'rgba(174,194,224,' + d.opacity + ')'; rCtx.lineWidth = 1; rCtx.stroke(); d.y += d.speed; if (d.y > rainCanvas.height) { Object.assign(d, createDrop()); d.y = Math.random() * -100; } });
    requestAnimationFrame(drawRain);
}
drawRain();

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
    draw() { hCtx.beginPath(); hCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); hCtx.fillStyle = 'rgba(239,35,60,.5)'; hCtx.fill(); }
}
function initHeroNodes() { heroNodes = []; for (let i = 0; i < Math.min(150, Math.floor((heroCanvas.width * heroCanvas.height) / 6000)); i++) heroNodes.push(new HeroNode()); }
initHeroNodes();
function drawHeroWeb() {
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    heroNodes.forEach(n => { n.update(); n.draw(); });
    for (let i = 0; i < heroNodes.length; i++) for (let j = i + 1; j < heroNodes.length; j++) {
        const dx = heroNodes[i].x - heroNodes[j].x, dy = heroNodes[i].y - heroNodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { hCtx.beginPath(); hCtx.strokeStyle = 'rgba(239,35,60,' + ((1 - dist / 100) * .3) + ')'; hCtx.lineWidth = .5; hCtx.moveTo(heroNodes[i].x, heroNodes[i].y); hCtx.lineTo(heroNodes[j].x, heroNodes[j].y); hCtx.stroke(); }
    }
    requestAnimationFrame(drawHeroWeb);
}
drawHeroWeb();
heroCanvas.addEventListener('mousemove', (e) => { const r = heroCanvas.getBoundingClientRect(); heroMouseX = e.clientX - r.left; heroMouseY = e.clientY - r.top; });
heroCanvas.addEventListener('mouseleave', () => { heroMouseX = -1000; heroMouseY = -1000; });

const webBgCanvas = document.getElementById('webBgCanvas');
const wCtx = webBgCanvas.getContext('2d');
let bgNodes = [];
function resizeWebBg() { webBgCanvas.width = window.innerWidth; webBgCanvas.height = window.innerHeight; }
resizeWebBg(); window.addEventListener('resize', () => { resizeWebBg(); initBgNodes(); });
class BgNode {
    constructor() { this.x = Math.random() * webBgCanvas.width; this.y = Math.random() * webBgCanvas.height; this.vx = (Math.random() - .5) * .5; this.vy = (Math.random() - .5) * .5; this.size = Math.random() * 1.5 + .5; }
    update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > webBgCanvas.width) this.vx *= -1; if (this.y < 0 || this.y > webBgCanvas.height) this.vy *= -1; }
    draw() { wCtx.beginPath(); wCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); wCtx.fillStyle = 'rgba(239,35,60,.35)'; wCtx.fill(); }
}
function initBgNodes() { bgNodes = []; for (let i = 0; i < Math.min(50, Math.floor((webBgCanvas.width * webBgCanvas.height) / 25000)); i++) bgNodes.push(new BgNode()); }
initBgNodes();
function drawBgWeb() {
    wCtx.clearRect(0, 0, webBgCanvas.width, webBgCanvas.height);
    bgNodes.forEach(n => { n.update(); n.draw(); });
    for (let i = 0; i < bgNodes.length; i++) for (let j = i + 1; j < bgNodes.length; j++) {
        const dx = bgNodes[i].x - bgNodes[j].x, dy = bgNodes[i].y - bgNodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { wCtx.beginPath(); wCtx.strokeStyle = 'rgba(239,35,60,' + ((1 - dist / 150) * .12) + ')'; wCtx.lineWidth = .3; wCtx.moveTo(bgNodes[i].x, bgNodes[i].y); wCtx.lineTo(bgNodes[j].x, bgNodes[j].y); wCtx.stroke(); }
    }
    requestAnimationFrame(drawBgWeb);
}
drawBgWeb();

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
    nLinks.forEach(l => { l.style.color = l.getAttribute('href') === '#' + c ? '#ef233c' : ''; });
});

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formState = document.getElementById('formState');
document.getElementById('sendAgain').addEventListener('click', () => { contactForm.reset(); contactForm.style.display = 'grid'; formSuccess.classList.remove('show'); formState.textContent = 'READY'; formState.style.color = '#ef233c'; });
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
    const geo = document.querySelector('.abstract-geo');
    const web = document.getElementById('spiderWebWrap');
    const s = window.scrollY;
    if (hero && s < window.innerHeight) { hero.style.transform = 'translateY(' + (s * .15) + 'px)'; hero.style.opacity = 1 - (s / window.innerHeight); }
    if (geo && s < window.innerHeight) geo.style.transform = 'translateY(' + (s * .08) + 'px)';
    if (web && s < window.innerHeight) web.style.transform = 'rotate(' + (s * 0.15) + 'deg)';
});

document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-5px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Spider-Man hanging drop on scroll
const spiderman = document.getElementById('spidermanHang');
if (spiderman) {
    gsap.set(spiderman, { y: -450, opacity: 0 });
    ScrollTrigger.create({
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
            const p = self.progress;
            gsap.set(spiderman, {
                y: -450 + (450 * p),
                opacity: Math.min(p * 3, 1)
            });
        }
    });
}

// Spider drop on scroll - smooth even on rough scroll
gsap.utils.toArray('.floating-spider').forEach((spider, i) => {
    const startY = -180 - (i * 30);
    const endY = 0;
    gsap.set(spider, { y: startY, opacity: 0 });

    const webLine = document.createElement('div');
    webLine.style.cssText = 'position:absolute;top:-200px;left:50%;width:1px;height:200px;background:linear-gradient(180deg,transparent,rgba(17,17,17,.12) 50%,rgba(17,17,17,.05));transform:translateX(-50%);pointer-events:none;z-index:0;transform-origin:top';
    spider.appendChild(webLine);
    gsap.set(webLine, { scaleY: 0, transformOrigin: 'top' });

    ScrollTrigger.create({
        trigger: spider.closest('.section'),
        start: 'top 130%',
        end: 'top -30%',
        scrub: 1.5,
        onUpdate: (self) => {
            const p = self.progress;
            gsap.set(spider, {
                y: startY + (endY - startY) * p,
                opacity: Math.min(p * 2.5, .7),
                ease: 'power2.out'
            });
            gsap.set(webLine, { scaleY: p });
        }
    });
});