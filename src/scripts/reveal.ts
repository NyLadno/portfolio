// Добавляет .is-in элементам [data-reveal], когда они попадают в экран (один раз).
const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduce || !("IntersectionObserver" in window)) {
  els.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

export {};
