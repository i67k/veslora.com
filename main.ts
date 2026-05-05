import './style.css';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. INTRO LOGIC ---
const brandName = "VESLORA";
const spotlightDiv = document.getElementById('spotlight-text') as HTMLElement;
const introLayer = document.getElementById('intro-layer') as HTMLElement;
const mainContent = document.getElementById('main-content') as HTMLElement;

async function playIntro() {
  const timePerStep = 250;

  for (let i = 1; i <= brandName.length; i++) {
    const partialText = brandName.substring(0, i);
    spotlightDiv.innerText = partialText;

    spotlightDiv.classList.remove('pulse-animate');
    void spotlightDiv.offsetWidth; // trigger reflow
    spotlightDiv.classList.add('pulse-animate');

    await wait(timePerStep);
  }

  await wait(300);

  introLayer.style.opacity = '0';

  await wait(300);
  introLayer.style.display = 'none';

  mainContent.style.opacity = '1';
  document.body.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';

  startMainAnimation();
}

// --- 2. MAIN ANIMATION ---
const textElement = document.getElementById('type-text') as HTMLElement;
const cursor = document.getElementById('cursor') as HTMLElement;
const fadeContent = document.getElementById('fadeContent') as HTMLElement;

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

setTimeout(playIntro, 100);

const bg = document.getElementById('bgParallax') as HTMLElement;
document.addEventListener('mousemove', (e) => {
  const x = (window.innerWidth - e.pageX * 2) / 100;
  const y = (window.innerHeight - e.pageY * 2) / 100;
  bg.style.transform = `translate(${x}px, ${y}px)`;
});

const modal = document.getElementById('emailModal') as HTMLElement;
const imprintModal = document.getElementById('imprintModal') as HTMLElement;
const privacyModal = document.getElementById('privacyModal') as HTMLElement;
const emailEl = document.getElementById('emailText') as HTMLElement;

const globalWindow = window as any;

globalWindow.openModal = function openModal() { modal.classList.add('show'); }
globalWindow.closeModal = function closeModal() { modal.classList.remove('show'); }
globalWindow.openImprint = function openImprint() { imprintModal.classList.add('show'); }
globalWindow.closeImprint = function closeImprint() { imprintModal.classList.remove('show'); }
globalWindow.openPrivacy = function openPrivacy() { privacyModal.classList.add('show'); }
globalWindow.closePrivacy = function closePrivacy() { privacyModal.classList.remove('show'); }

globalWindow.openMail = function openMail() { window.location.href = "mailto:" + emailEl.textContent?.trim(); }
globalWindow.copyEmail = async function copyEmail() { 
  try { 
    await navigator.clipboard.writeText(emailEl.textContent?.trim() || ""); 
  } catch (e) { 
    console.error("Clipboard error", e);
  } 
}

modal.addEventListener('click', (e) => { if (e.target === modal) globalWindow.closeModal(); });
imprintModal.addEventListener('click', (e) => { if (e.target === imprintModal) globalWindow.closeImprint(); });
privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) globalWindow.closePrivacy(); });

document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') {
    globalWindow.closeModal(); 
    globalWindow.closeImprint();
    globalWindow.closePrivacy();
  }
});
