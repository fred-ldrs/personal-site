const pages = ["index.html", "about.html", "work.html", "blog.html"];

let current = window.location.pathname.split("/").pop();
if (current === "" || current === "/") current = "index.html";

let startX = 0;
let startY = 0;
let startTime = 0;
let isScrolling = false;

// Feedback visuel pour le swipe
let swipeIndicator = null;

function createSwipeIndicator() {
  if (!swipeIndicator) {
    swipeIndicator = document.createElement('div');
    swipeIndicator.className = 'swipe-indicator';
    swipeIndicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(102, 204, 255, 0.9);
      color: #000;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(swipeIndicator);
  }
  return swipeIndicator;
}

function showSwipeIndicator(direction, targetPage) {
  const indicator = createSwipeIndicator();
  const pageNames = ["Home", "About", "Projects", "Blog"];
  const currentIndex = pages.indexOf(current);
  const targetIndex = pages.indexOf(targetPage);
  
  if (targetIndex !== -1) {
    const arrow = direction === 'left' ? '→' : '←';
    indicator.textContent = `${arrow} ${pageNames[targetIndex]}`;
    indicator.style.opacity = '1';
    
    setTimeout(() => {
      indicator.style.opacity = '0';
    }, 1500);
  }
}

function addSwipeAnimation(direction) {
  const main = document.querySelector('main');
  if (main) {
    main.style.transform = direction === 'left' ? 'translateX(-20px)' : 'translateX(20px)';
    main.style.opacity = '0.7';
    main.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      main.style.transform = 'translateX(0)';
      main.style.opacity = '1';
    }, 100);
  }
}

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  startTime = Date.now();
  isScrolling = false;
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  if (!startX || !startY) return;
  
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  
  const deltaX = Math.abs(currentX - startX);
  const deltaY = Math.abs(currentY - startY);
  
  // Déterminer si l'utilisateur fait défiler verticalement
  // Déterminer si l'utilisateur fait défiler verticalement (avec seuil minimum)
  if (deltaY > 10 && deltaY > deltaX) {
    isScrolling = true;
  }
  
  // Feedback visuel pendant le swipe horizontal
  if (!isScrolling && deltaX > 30) {
    const currentIndex = pages.indexOf(current);
    const direction = currentX < startX ? 'left' : 'right';
    
    if (direction === 'left' && currentIndex < pages.length - 1) {
      // Swipe vers la page suivante
      showSwipeIndicator('left', pages[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      // Swipe vers la page précédente
      showSwipeIndicator('right', pages[currentIndex - 1]);
    }
  }
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (!startX || !startY || isScrolling) {
    startX = 0;
    startY = 0;
    return;
  }
  
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const deltaX = endX - startX;
  const deltaY = Math.abs(endY - startY);
  const deltaTime = Date.now() - startTime;
  
  // Seuils pour une navigation fluide
  const minDistance = 80; // Distance minimum pour déclencher
  const maxTime = 300; // Temps maximum pour un swipe rapide
  const maxVerticalDistance = 100; // Distance verticale max tolérée
  
  if (Math.abs(deltaX) > minDistance && 
      deltaTime < maxTime && 
      deltaY < maxVerticalDistance) {
    
    const currentIndex = pages.indexOf(current);
    if (currentIndex === -1) return;

    let targetPage = null;
    
    if (deltaX < 0 && currentIndex < pages.length - 1) {
      // Swipe gauche - page suivante
      targetPage = pages[currentIndex + 1];
      addSwipeAnimation('left');
    } else if (deltaX > 0 && currentIndex > 0) {
      // Swipe droite - page précédente
      targetPage = pages[currentIndex - 1];
      addSwipeAnimation('right');
    }
    
    if (targetPage) {
      // Vibration pour le feedback tactile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Navigation avec délai pour l'animation
      setTimeout(() => {
        window.location.href = targetPage;
      }, 200);
    }
  }
  
  // Reset
  startX = 0;
  startY = 0;
  startTime = 0;
  isScrolling = false;
}, { passive: true });

// Gestion du clavier pour l'accessibilité
document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  
  const currentIndex = pages.indexOf(current);
  if (currentIndex === -1) return;
  
  let targetPage = null;
  
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    targetPage = pages[currentIndex - 1];
    e.preventDefault();
  } else if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
    targetPage = pages[currentIndex + 1];
    e.preventDefault();
  }
  
  if (targetPage) {
    addSwipeAnimation(e.key === 'ArrowLeft' ? 'right' : 'left');
    setTimeout(() => {
      window.location.href = targetPage;
    }, 200);
  }
});
