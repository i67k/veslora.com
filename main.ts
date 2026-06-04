import './style.css';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. INTRO LOGIC ---
const brandName = "VESLORA";
const spotlightDiv = document.getElementById('spotlight-text');
const introLayer = document.getElementById('intro-layer');
const mainContent = document.getElementById('main-content');
const textElement = document.getElementById('type-text');
const cursor = document.getElementById('cursor');
const fadeContent = document.getElementById('fadeContent');

async function playIntro() {
  if (!spotlightDiv || !introLayer || !mainContent) return;

  // Detect reload vs. navigation — play intro on reload, skip on back/forward
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const isReload = navEntry?.type === 'reload';
  if (isReload) sessionStorage.removeItem('veslora_intro_played');

  const alreadyPlayed = sessionStorage.getItem('veslora_intro_played');
  const urlParams = new URLSearchParams(window.location.search);
  const skipIntro = alreadyPlayed === '1' || urlParams.has('skipIntro');

  if (!alreadyPlayed) {
    sessionStorage.setItem('veslora_intro_played', '1');
  }

  if (skipIntro) {
    // Clean up URL if needed
    if (urlParams.has('skipIntro')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Skip intro layer
    introLayer.style.display = 'none';
    mainContent.classList.add('no-intro');
    // Set final state directly
    if (textElement) textElement.textContent = 'Veslora.';
    if (fadeContent) fadeContent.classList.add('visible');
    if (cursor) cursor.classList.add('stopped');
    return;
  }


  const timePerStep = 100; // Speed up letter appearance

  for (let i = 1; i <= brandName.length; i++) {
    const partialText = brandName.substring(0, i);
    spotlightDiv.innerText = partialText;

    spotlightDiv.classList.remove('pulse-animate');
    void spotlightDiv.offsetWidth; // trigger reflow
    spotlightDiv.classList.add('pulse-animate');

    await wait(timePerStep);
  }

  await wait(150); // Speed up pause before fade

  introLayer.style.opacity = '0';

  await wait(200); // Speed up removal
  introLayer.style.display = 'none';

  mainContent.style.opacity = '1';
  
  startMainAnimation();
}

// --- 2. MAIN ANIMATION ---
const sequence = [
  { text: "Veslora", delay: 1500, triggerFade: true },
  { delete: true, delay: 400 },
  { text: "Quiet Luxury", delay: 1400 },
  { delete: true, delay: 400 },
  { text: "Veslora.", delay: 0 }
];

let currentText = "";
const typeSpeed = () => 45 + Math.random() * 25;
const deleteSpeed = () => 25 + Math.random() * 20;

async function startMainAnimation() {
  if (!textElement || !cursor || !fadeContent) return;
  await wait(500);
  for (const step of sequence) {
    if (step.delete) {
      while (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        textElement.textContent = currentText;
        await wait(deleteSpeed());
      }
    } else {
      const target = step.text || "";
      for (let i = 0; i < target.length; i++) {
        currentText += target[i];
        textElement.textContent = currentText;
        if (step.triggerFade && currentText === target) {
          fadeContent.classList.add('visible');
        }
        await wait(typeSpeed());
      }
    }
    if (step.delay) await wait(step.delay);
  }
  cursor.classList.add('stopped');
}

if (spotlightDiv) {
  setTimeout(playIntro, 100);
}

const bg = document.getElementById('bgParallax');
if (bg) {
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;
    bg.style.transform = `translate(${x}px, ${y}px)`;
  });
}

const modal = document.getElementById('emailModal');
const emailEl = document.getElementById('emailText');

function openModal() { 
  if (modal) {
    modal.style.display = 'grid';
    setTimeout(() => modal.classList.add('show'), 10);
  }
}

function closeModal() { 
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 500);
  }
}

function openMail() { 
  if (emailEl) window.location.href = "mailto:" + emailEl.textContent?.trim(); 
}

async function copyEmail() { 
  try { 
    if (emailEl) await navigator.clipboard.writeText(emailEl.textContent?.trim() || ""); 
  } catch (e) { 
    console.error("Clipboard error", e);
  } 
}

document.getElementById('btn-contact-hero')?.addEventListener('click', openModal);
document.getElementById('btn-open-mail-modal')?.addEventListener('click', openMail);
document.getElementById('btn-copy-modal')?.addEventListener('click', copyEmail);
document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);

if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}

document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') {
    closeModal(); 
  }
});

// --- 3. PREMIUM UI/UX ENHANCEMENTS ---

function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Fade out on page entry
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('fade-out');
    });
  });

  // Handle browser back cache
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      overlay.classList.add('fade-out');
    }
  });

  // Intercept relative internal link clicks
  document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');

    if (anchor) {
      const href = anchor.getAttribute('href');
      
      if (
        href && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') && 
        !href.startsWith('#') && 
        !anchor.getAttribute('target') &&
        anchor.hostname === window.location.hostname
      ) {
        e.preventDefault();
        overlay.classList.remove('fade-out');

        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    }
  });
}

function initScrollReveals() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
}

// Instantiate features
initPageTransitions();
initScrollReveals();


