document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.createElement("div");
  document.body.prepend(navContainer);

  try {
    const res = await fetch("/nav.html");
    const navHTML = await res.text();
    navContainer.innerHTML = navHTML;

    // Marquer le lien actif
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || 
          (currentPath === '/' && href === '/index.html') ||
          (currentPath === '/index.html' && href === '/')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Navigation qui se cache au scroll vers le bas
    let lastScrollTop = 0;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll vers le bas - cacher la nav
        nav.classList.add('hidden');
      } else {
        // Scroll vers le haut - montrer la nav
        nav.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

  } catch (err) {
    console.error("Navigation konnte nicht geladen werden:", err);
  }
});
