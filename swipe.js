const pages = ["/index.html", "/about.html", "/work.html", "/blog.html"];
const current = window.location.pathname.endsWith("/") ? "/index.html" : window.location.pathname;

let startX = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;

  if (Math.abs(deltaX) > 50) {
    const currentIndex = pages.indexOf(current);
    if (deltaX < 0 && currentIndex < pages.length - 1) {
      // swipe left → next page
      window.location.href = pages[currentIndex + 1];
    } else if (deltaX > 0 && currentIndex > 0) {
      // swipe right → previous page
      window.location.href = pages[currentIndex - 1];
    }
  }
});
