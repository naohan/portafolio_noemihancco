const root = document.documentElement;
const themeBtn = document.querySelector(".theme-btn");
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const saved = localStorage.getItem("theme");

if (saved === "light" || saved === "dark") {
  root.dataset.theme = saved;
}

function paintThemeIcon() {
  const dark = root.dataset.theme !== "light";
  themeBtn.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
  themeBtn.innerHTML = dark
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
}

paintThemeIcon();

themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("theme", root.dataset.theme);
  paintThemeIcon();
});

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

const links = [...document.querySelectorAll(".nav-links a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
);

sections.forEach((section) => observer.observe(section));

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector(".timeline");
  const items = [...track.children];
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  const dots = carousel.querySelector("[data-carousel-dots]");
  let index = 0;

  function visibleCount() {
    if (window.innerWidth <= 860) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, items.length - visibleCount());
  }

  function renderDots() {
    const pages = maxIndex() + 1;
    dots.innerHTML = "";
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir al grupo ${i + 1} de logros`);
      if (i === index) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => {
        index = i;
        paint();
      });
      dots.appendChild(dot);
    }
  }

  function paint() {
    index = Math.min(index, maxIndex());
    const gap = 14;
    const width = items[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * (width + gap)}px)`;
    prev.disabled = index === 0;
    next.disabled = index === maxIndex();
    renderDots();
  }

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    paint();
  });

  next.addEventListener("click", () => {
    index = Math.min(maxIndex(), index + 1);
    paint();
  });

  window.addEventListener("resize", paint);
  paint();
}
