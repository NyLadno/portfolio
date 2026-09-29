const topbar = document.querySelector<HTMLElement>(".topbar");
const menuBtn = document.querySelector<HTMLButtonElement>(".nav__menu");
const list = document.querySelector<HTMLElement>("#nav-list");
const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav__link")];

// фон панели появляется после начала прокрутки
if (topbar) {
  const onScroll = () => {
    topbar.dataset.scrolled = String(window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// активный раздел
const sections = links
  .map((a) => document.getElementById(a.dataset.nav ?? ""))
  .filter((el): el is HTMLElement => el !== null);

const setActive = (id: string) => {
  for (const a of links) {
    if (a.dataset.nav === id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  }
};

if (sections.length) {
  const visible = new Map<string, number>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
      let best = "";
      let bestRatio = 0;
      for (const [id, ratio] of visible) {
        if (ratio > bestRatio) {
          best = id;
          bestRatio = ratio;
        }
      }
      if (best) setActive(best);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
  );
  sections.forEach((s) => io.observe(s));
}

// мобильное меню
if (menuBtn && list) {
  const close = (focusButton = false) => {
    menuBtn.setAttribute("aria-expanded", "false");
    list.classList.remove("is-open");
    if (focusButton) menuBtn.focus();
  };
  const open = () => {
    menuBtn.setAttribute("aria-expanded", "true");
    list.classList.add("is-open");
    list.querySelector<HTMLAnchorElement>("a")?.focus();
  };
  menuBtn.addEventListener("click", () => {
    if (menuBtn.getAttribute("aria-expanded") === "true") close();
    else open();
  });
  list.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && list.classList.contains("is-open")) close(true);
  });
  document.addEventListener("click", (e) => {
    const t = e.target as Node;
    if (list.classList.contains("is-open") && !list.contains(t) && !menuBtn.contains(t)) close();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", () => close());
}

export {};
