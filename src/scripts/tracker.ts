// Схема Internship Tracker: выбор узла → инспектор с кодом; прогон «одной вакансии» по схеме.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

document.querySelectorAll<HTMLElement>("[data-td]").forEach((root) => {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("button[data-node]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];

  const activate = (id: string) => {
    if (root.dataset.active === id) return;
    root.dataset.active = id;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.node === id)));
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
  };

  let hoverTimer = 0;
  buttons.forEach((b) => {
    const id = b.dataset.node!;
    b.addEventListener("click", () => {
      activate(id);
      // на узком экране инспектор под схемой — подкручиваем его в поле зрения
      if (window.matchMedia("(max-width: 1080px)").matches) {
        const panel = root.querySelector<HTMLElement>(`[data-panel="${id}"]`);
        const r = panel?.getBoundingClientRect();
        if (panel && r && (r.top > window.innerHeight - 80 || r.bottom < 0)) {
          panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
      }
    });
    if (fine) {
      b.addEventListener("pointerenter", () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => activate(id), 90);
      });
      b.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));
    }
  });

  // прогон: путь новой вакансии от сайта до уведомления в Telegram
  const path = ["source", "fetch", "parse", "filter", "details", "store", "wire:push", "bot", "wire:user", "user"];
  const el = (step: string) =>
    step.startsWith("wire:")
      ? root.querySelector<HTMLElement>(`[data-wire="${step.slice(5)}"]`)
      : root.querySelector<HTMLElement>(`.td__node[data-node="${step}"]`);

  let timers: number[] = [];
  const run = () => {
    if (reduce) return;
    timers.forEach(clearTimeout);
    root.querySelectorAll(".is-lit").forEach((n) => n.classList.remove("is-lit"));
    timers = path.map((step, i) =>
      window.setTimeout(() => {
        const node = el(step);
        if (!node) return;
        node.classList.add("is-lit");
        timers.push(window.setTimeout(() => node.classList.remove("is-lit"), 620));
      }, i * 280),
    );
  };

  root.querySelector("[data-td-replay]")?.addEventListener("click", run);

  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      window.setTimeout(run, 250);
    },
    { threshold: 0.45 },
  );
  io.observe(root.querySelector(".td__grid") ?? root);
});

// счётчики: один раз досчитать от 0 до значения
const counters = document.querySelectorAll<HTMLElement>("[data-count]");
if (!reduce && counters.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const to = Number(el.dataset.count);
        const dur = 900 + Math.min(to, 60) * 8;
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = String(Math.round(to * eased));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  counters.forEach((c) => {
    // резервируем ширину, чтобы цифры не толкали соседей
    c.style.display = "inline-block";
    c.style.minWidth = `${String(c.dataset.count).length}ch`;
    c.textContent = "0";
    io.observe(c);
  });
}

export {};
