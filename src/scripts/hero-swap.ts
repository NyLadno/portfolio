// Hero: «Go Developer» ⇄ «Андреев Александр». Вся анимация — CSS transitions,
// здесь только состояние: имя при загрузке → роль, hover мышью → имя, тап → переключение.
const swap = document.querySelector<HTMLElement>("[data-hero-swap]");

if (swap) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovering = false;
  let pinned = false;
  const set = (state: "name" | "role") => {
    swap.dataset.state = state;
  };

  if (reduce) {
    set("role");
  } else {
    // имя видно первым; после загрузки шрифтов — волна в роль
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      window.setTimeout(() => {
        if (!hovering && !pinned) set("role");
      }, 900);
    });
  }

  swap.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = true;
    set("name");
  });
  swap.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    hovering = false;
    if (!pinned) set("role");
  });
  // touch и перо: тап переключает
  swap.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse") return;
    pinned = swap.dataset.state !== "name";
    set(pinned ? "name" : "role");
  });
}

export {};
