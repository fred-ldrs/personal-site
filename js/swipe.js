const pages = ["index.html", "about.html", "work.html", "blog.html"];

let current = window.location.pathname.split("/").pop();
if (current === "" || current === "/") current = "index.html";

let startX = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;

  if (Math.abs(deltaX) > 50) {
    const currentIndex = pages.indexOf(current);
    if (currentIndex === -1) return; // falls aktuelle Seite nicht gelistet ist

    if (deltaX < 0 && currentIndex < pages.length - 1) {
      window.location.href = pages[currentIndex + 1];
    } else if (deltaX > 0 && currentIndex > 0) {
      window.location.href = pages[currentIndex - 1];
    }
  }
});
