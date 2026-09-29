const root = document.documentElement;
const toggles = document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]");
const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

const label = (theme: string) => (theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему");

const apply = (theme: "light" | "dark", animate: boolean) => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduce) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 480);
  }
  root.dataset.theme = theme;
  metaTheme?.setAttribute("content", theme === "dark" ? "#141412" : "#f2f1ed");
  toggles.forEach((b) => b.setAttribute("aria-label", label(theme)));
};

toggles.forEach((btn) => {
  btn.setAttribute("aria-label", label(root.dataset.theme ?? "light"));
  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next, true);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* приватный режим — тема просто не запомнится */
    }
  });
});

// если пользователь не выбирал тему явно — следуем системе
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {
    /* noop */
  }
  if (!stored) apply(e.matches ? "dark" : "light", true);
});

export {};
