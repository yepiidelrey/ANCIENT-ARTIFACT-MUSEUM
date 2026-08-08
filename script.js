/* ============================================
   ANCIENT ARTIFACT MUSEUM - INTERACTIVE SCRIPT
   ============================================ */

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouchDevice && cursorDot && cursorOutline) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, .artifact-card, .feature-card, input');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
}

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

// Scroll blur effect
ScrollTrigger.create({
  start: 'top -100',
  onUpdate: (self) => {
    if (self.scroll() > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Mobile menu toggle
menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menuBtn.setAttribute('aria-expanded', menuOpen);
  if (menuOpen) {
    mobileMenu.classList.add('open');
    lenis.stop();
  } else {
    mobileMenu.classList.remove('open');
    lenis.start();
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    lenis.start();
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: -80 });
    }
  });
});

// ============================================
// GSAP ANIMATIONS
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Hero entrance animation
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .from('.hero-label', { y: 30, opacity: 0, duration: 1, delay: 0.3 })
  .from('.hero-line', { 
    y: '100%', 
    duration: 1.2, 
    stagger: 0.15,
    ease: 'power4.out'
  }, '-=0.6')
  .from('.hero-desc', { y: 30, opacity: 0, duration: 1 }, '-=0.8')
  .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
  .from('.hero-image', { 
    scale: 1.1, 
    opacity: 0, 
    duration: 1.5,
    ease: 'power2.out'
  }, '-=1.2');

// Hero parallax on scroll
gsap.to('.hero-image', {
  y: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

gsap.to('.hero-content', {
  y: -50,
  opacity: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '50% top',
    scrub: true
  }
});

// ============================================
// PRESERVING SECTION
// ============================================
gsap.from('.preserving-content', {
  x: -60,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#preserving',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.preserving-image', {
  x: 60,
  opacity: 0,
  duration: 1.4,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#preserving',
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

// Parallax for preserving image
gsap.to('.preserving-image', {
  y: -80,
  ease: 'none',
  scrollTrigger: {
    trigger: '#preserving',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// ============================================
// FEATURED ARTIFACTS
// ============================================
gsap.from('.artifacts-label', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  scrollTrigger: {
    trigger: '#collection',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.artifact-card', {
  y: 80,
  opacity: 0,
  duration: 1,
  stagger: 0.12,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#collection .grid',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

// Card hover tilt effect (desktop only)
if (!isTouchDevice) {
  document.querySelectorAll('.artifact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============================================
// ECHOES SECTION
// ============================================
gsap.from('.echoes-heading', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#echoes',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.echoes-tree', {
  y: 100,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#echoes',
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.echoes-bust', {
  y: 80,
  opacity: 0,
  duration: 1.2,
  delay: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#echoes',
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.echoes-medallion', {
  scale: 0.8,
  opacity: 0,
  duration: 1,
  delay: 0.4,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '#echoes',
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

// Tree rotation on mouse move (subtle)
if (!isTouchDevice) {
  const echoesSection = document.getElementById('echoes');
  const tree = document.querySelector('.echoes-tree img');
  if (echoesSection && tree) {
    echoesSection.addEventListener('mousemove', (e) => {
      const rect = echoesSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      gsap.to(tree, {
        rotation: x * 3,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }
}

// ============================================
// DISCOVER SECTION
// ============================================
gsap.from('.discover-label', {
  y: 20,
  opacity: 0,
  duration: 0.8,
  scrollTrigger: {
    trigger: '#discover',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.discover-heading', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#discover',
    start: 'top 65%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('#discover .feature-card', {
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#discover .grid',
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.discover-image', {
  x: 80,
  opacity: 0,
  duration: 1.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#discover',
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

// Parallax for discover image
gsap.to('.discover-image img', {
  y: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: '#discover',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// ============================================
// NEWSLETTER SECTION
// ============================================
gsap.from('.newsletter-content', {
  x: -50,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#newsletter',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

gsap.from('.newsletter-form', {
  x: 50,
  opacity: 0,
  duration: 1,
  delay: 0.2,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '#newsletter',
    start: 'top 70%',
    toggleActions: 'play none none reverse'
  }
});

// ============================================
// FOOTER
// ============================================
gsap.from('.footer-col', {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: 'footer',
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  }
});

// ============================================
// NEWSLETTER FORM HANDLING
// ============================================
function handleSubscribe() {
  const email = document.getElementById('emailInput').value;
  const message = document.getElementById('formMessage');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    message.textContent = 'Thank you for subscribing to our newsletter.';
    message.style.color = '#8A7454';
    message.style.opacity = '1';
    document.getElementById('emailInput').value = '';
    setTimeout(() => {
      message.style.opacity = '0';
    }, 4000);
  } else {
    message.textContent = 'Please enter a valid email address.';
    message.style.color = '#ef4444';
    message.style.opacity = '1';
  }
}

// Input focus animation
document.getElementById('emailInput').addEventListener('focus', function() {
  this.nextElementSibling.style.width = '100%';
});

document.getElementById('emailInput').addEventListener('blur', function() {
  if (!this.value) {
    this.nextElementSibling.style.width = '0';
  }
});

// ============================================
// IMAGE LOADING
// ============================================
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => {
      img.style.opacity = '1';
      img.style.backgroundColor = '#EFE8DE';
    });
  }
});

// ============================================
// SPLITTYPE TEXT ANIMATIONS (non-hero elements)
// ============================================
if (typeof SplitType !== 'undefined') {
  // Split preserving heading
  const preservingHeading = document.querySelector('.preserving-heading');
  if (preservingHeading) {
    const split = new SplitType(preservingHeading, { types: 'lines' });
    gsap.from(split.lines, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#preserving',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}

// ============================================
// KEYBOARD NAVIGATION ENHANCEMENTS
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    lenis.start();
  }
});

// ============================================
// PERFORMANCE: Pause animations when tab hidden
// ============================================
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gsap.globalTimeline.pause();
  } else {
    gsap.globalTimeline.resume();
  }
});

console.log('Ancient Artifact Museum — Initialized');