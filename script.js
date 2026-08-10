/* ============================================
   ANCIENT ARTIFACT MUSEUM - INTERACTIVE SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INITIALIZE LENIS SMOOTH SCROLL
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
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

    // Sync Lenis dengan GSAP ScrollTrigger jika ada
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 2. NAVBAR SCROLL EFFECT
 // ============================================
// NAVBAR SCROLL EFFECT (TRANSPARAN & GLASS EFFECT)
// ============================================
const navbar = document.getElementById('navbar');

if (navbar && typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        // Saat di-scroll: beri latar transparan krem tipis + blur halus
        navbar.classList.add('bg-museum-bg/85', 'backdrop-blur-md', 'shadow-sm');
        navbar.classList.remove('bg-transparent');
      } else {
        // Saat di posisi paling atas: transparan penuh
        navbar.classList.remove('bg-museum-bg/85', 'backdrop-blur-md', 'shadow-sm');
        navbar.classList.add('bg-transparent');
      }
    }
  });
}


  // 3. SMOOTH SCROLL UNTUK ANCHOR LINK (#)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4. GSAP ANIMATIONS
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (document.querySelector('.hero-label')) {
      heroTl
        .from('.hero-label', { y: 30, opacity: 0, duration: 1, delay: 0.2 })
        .from('.hero-heading', { y: 40, opacity: 0, duration: 1 }, '-=0.6')
        .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-btn', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-image-wrapper', { scale: 1.05, opacity: 0, duration: 1.2 }, '-=0.8');
    }

    // Section About / Preserving Animation
    if (document.querySelector('#about')) {
      gsap.from('#about .preserving-content', {
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.from('#about .preserving-image', {
        x: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Collection / Artifacts Animation
    if (document.querySelector('.artifact-card')) {
      gsap.from('.artifact-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#collection',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // Exhibitions Section Animation
    if (document.querySelector('#exhibitions')) {
      gsap.from('#exhibitions .echoes-content-wrapper', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#exhibitions',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.from('#exhibitions .artifact-item', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#exhibitions',
          start: 'top 65%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }

  // 5. SPLITTYPE TEXT ANIMATION
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
    const preservingHeading = document.querySelector('.preserving-heading');
    if (preservingHeading) {
      const split = new SplitType(preservingHeading, { types: 'lines' });
      gsap.from(split.lines, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    }
  }

  // 6. PERFORMANCE: Pause animasi jika tab di-minimize/pindah tab
  document.addEventListener('visibilitychange', () => {
    if (typeof gsap !== 'undefined') {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    }
  });

  console.log('Ancient Artifact Museum — Initialized Successfully!');
});

// Newsletter Form Handler
function handleSubscribe(form) {
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput && emailInput.value) {
    alert('Thank you for subscribing to Ancient Artifact Museum!');
    emailInput.value = '';
  }
}