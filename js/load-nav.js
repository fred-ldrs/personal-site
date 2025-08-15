document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.createElement("div");
  document.body.prepend(navContainer);

  try {
    const res = await fetch("/nav.html");
    const navHTML = await res.text();
    navContainer.innerHTML = navHTML;

    // Configuration des pages et navigation
    const pages = ["index.html", "about.html", "work.html", "blog.html"];
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") currentPath = "index.html";

    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.querySelector('.nav-progress-bar');
    const swipeDots = document.querySelectorAll('.swipe-dot');

    // Marquer le lien actif et mettre à jour les indicateurs
    function updateActiveState() {
      const currentIndex = pages.indexOf(currentPath);
      
      // Mise à jour des liens de navigation
      navLinks.forEach((link, index) => {
        const href = link.getAttribute('href').split("/").pop();
        if (href === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });

      // Mise à jour de la barre de progression
      if (progressBar && currentIndex !== -1) {
        const progressWidth = ((currentIndex + 1) / pages.length) * 100;
        progressBar.style.width = `${progressWidth}%`;
      }

      // Mise à jour des points de swipe
      swipeDots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Initialiser l'état actif
    updateActiveState();

    // Navigation qui se cache au scroll vers le bas
    let lastScrollTop = 0;
    const nav = document.querySelector('.nav');
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Annuler le timeout précédent
      clearTimeout(scrollTimeout);
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - cacher la nav
        nav.classList.add('hidden');
      } else {
        // Scroll vers le haut - montrer la nav
        nav.classList.remove('hidden');
      }
      
      // Montrer automatiquement la nav après un moment d'inactivité
      scrollTimeout = setTimeout(() => {
        nav.classList.remove('hidden');
      }, 3000);
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // Animation d'entrée de la navigation
    requestAnimationFrame(() => {
      nav.style.opacity = '0';
      nav.style.transform = 'translateY(-100%)';
      
      setTimeout(() => {
        nav.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        nav.style.opacity = '1';
        nav.style.transform = 'translateY(0)';
      }, 100);
    });

    // Feedback visuel au clic
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Animation de clic
        this.style.transform = 'translateY(-2px) scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Vibration pour les appareils mobiles
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      });
    });

  } catch (err) {
    console.error("Navigation could not be loaded:", err);
  }
});
