// Split-flap табло: каждая ячейка листает свой барабан символов и останавливается на целевом.
const board = document.querySelector<HTMLElement>("[data-board]");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DRUMS: Record<string, string> = {
  num: " 0123456789",
  alpha: " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  status: " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
const show = (ch: string) => (ch === " " ? " " : ch);

type Cell = {
  el: HTMLElement;
  kind: string;
  target: string;
  current: string;
  r: number;
  c: number;
  parts: { top: HTMLElement; bottom: HTMLElement; leafTop: HTMLElement; leafBottom: HTMLElement };
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

function setAll(cell: Cell, ch: string) {
  const { top, bottom, leafTop, leafBottom } = cell.parts;
  for (const p of [top, bottom, leafTop, leafBottom]) p.firstElementChild!.textContent = show(ch);
  cell.current = ch;
}

async function flip(cell: Cell, to: string, dur: number) {
  const { top, bottom, leafTop, leafBottom } = cell.parts;
  const from = cell.current;
  top.firstElementChild!.textContent = show(to);
  bottom.firstElementChild!.textContent = show(from);
  leafTop.firstElementChild!.textContent = show(from);
  leafBottom.firstElementChild!.textContent = show(to);
  const a = leafTop.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
    duration: dur / 2,
    easing: "cubic-bezier(.55,0,.9,.4)",
    fill: "forwards",
  });
  await a.finished;
  const b = leafBottom.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
    duration: dur / 2,
    easing: "cubic-bezier(.2,.7,.35,1.25)",
    fill: "forwards",
  });
  await b.finished;
  bottom.firstElementChild!.textContent = show(to);
  leafTop.firstElementChild!.textContent = show(to);
  a.cancel();
  b.cancel();
  cell.current = to;
}

async function spin(cell: Cell, delay: number) {
  const drum = DRUMS[cell.kind];
  const targetIdx = drum.indexOf(cell.target);
  // число шагов: разное у каждой ячейки, чтобы табло «разъезжалось» и садилось волной
  const steps = 8 + Math.floor(Math.random() * 6) + Math.round(cell.c * 0.7) + cell.r * 2 + (cell.kind === "status" ? 3 : 0);
  let idx = (((targetIdx - steps) % drum.length) + drum.length) % drum.length;
  await sleep(delay);
  for (let s = 0; s < steps; s++) {
    idx = (idx + 1) % drum.length;
    const left = steps - s;
    const dur = left <= 3 ? 150 + (3 - left) * 40 : 86;
    await flip(cell, drum[idx], dur);
  }
  if (cell.current !== cell.target) await flip(cell, cell.target, 180);
}

if (board) {
  const cells: Cell[] = [...board.querySelectorAll<HTMLElement>("[data-flap]")].map((el) => ({
    el,
    kind: el.dataset.kind ?? "alpha",
    target: el.dataset.target ?? " ",
    current: el.dataset.target ?? " ",
    r: Number(el.style.getPropertyValue("--r")) || 0,
    c: Number(el.style.getPropertyValue("--c")) || 0,
    parts: {
      top: el.querySelector<HTMLElement>(".flap__half--top")!,
      bottom: el.querySelector<HTMLElement>(".flap__half--bottom")!,
      leafTop: el.querySelector<HTMLElement>(".flap__leaf--top")!,
      leafBottom: el.querySelector<HTMLElement>(".flap__leaf--bottom")!,
    },
  }));

  let running = false;
  const run = async () => {
    if (running || reduce) return;
    running = true;
    board.dataset.state = "spinning";
    await Promise.all(cells.map((cell) => spin(cell, cell.c * 35 + cell.r * 80)));
    board.dataset.state = "done";
    running = false;
  };

  if (!reduce) {
    // до появления в экране табло пустое
    cells.forEach((c) => setAll(c, " "));
    board.dataset.state = "spinning";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    io.observe(board);
  }

  document.querySelector("[data-board-replay]")?.addEventListener("click", async () => {
    if (running) return;
    cells.forEach((c) => setAll(c, " "));
    await sleep(120);
    run();
  });
}

export {};
