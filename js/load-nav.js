document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.createElement("div");
  document.body.prepend(navContainer);

  try {
    const res = await fetch("/nav.html");
    const navHTML = await res.text();
    navContainer.innerHTML = navHTML;

    // Aktiv-Link markieren
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  } catch (err) {
    console.error("Navigation konnte nicht geladen werden:", err);
  }
});
