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

  const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  if (isReload) {
    sessionStorage.removeItem('veslora_intro_played');
  }

  const hasSeenIntro = sessionStorage.getItem('veslora_intro_played');
  
  if (hasSeenIntro) {
    // Skip intro layer
    introLayer.style.display = 'none';
    mainContent.classList.add('no-intro');
    
    // Skip typing animation completely, set final state
    if (textElement) textElement.textContent = "Veslora.";
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
  
  // Set session storage so intro doesn't play again
  sessionStorage.setItem('veslora_intro_played', 'true');

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

const globalWindow = window as any;

globalWindow.openModal = function openModal() { modal?.classList.add('show'); }
globalWindow.closeModal = function closeModal() { modal?.classList.remove('show'); }

globalWindow.openMail = function openMail() { 
  if (emailEl) window.location.href = "mailto:" + emailEl.textContent?.trim(); 
}
globalWindow.copyEmail = async function copyEmail() { 
  try { 
    if (emailEl) await navigator.clipboard.writeText(emailEl.textContent?.trim() || ""); 
  } catch (e) { 
    console.error("Clipboard error", e);
  } 
}

if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) globalWindow.closeModal(); });
}

document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') {
    globalWindow.closeModal(); 
  }
});
