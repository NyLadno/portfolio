// Мини-игра «змейка» на сетке активности: еда — реальные дни с коммитами.
const grid = document.querySelector<HTMLElement>("[data-snake-grid]");
const hint = document.querySelector<HTMLElement>("[data-snake-hint]");
const status = document.querySelector<HTMLElement>("[data-snake-status]");

type P = { x: number; y: number };

if (grid && status) {
  const cols = Number(grid.dataset.cols);
  const rows = 7;
  const cellAt = new Map<string, HTMLElement>();
  grid.querySelectorAll<HTMLElement>(".cell").forEach((c) => cellAt.set(`${c.dataset.x}:${c.dataset.y}`, c));
  const get = (p: P) => cellAt.get(`${p.x}:${p.y}`);
  const food = [...grid.querySelectorAll<HTMLElement>("[data-commits]")];
  const totalCommits = food.reduce((n, c) => n + Number(c.dataset.commits), 0);

  let snake: P[] = [];
  let dir: P = { x: 1, y: 0 };
  let queued: P[] = [];
  let timer = 0;
  let collected = 0;
  let playing = false;

  const say = (text: string) => {
    status.hidden = false;
    status.textContent = text;
  };

  const clear = () => {
    grid.querySelectorAll(".is-snake, .is-head, .is-eaten").forEach((c) => c.classList.remove("is-snake", "is-head", "is-eaten"));
    grid.classList.remove("is-playing", "is-over");
  };

  const draw = () => {
    grid.querySelectorAll(".is-snake, .is-head").forEach((c) => c.classList.remove("is-snake", "is-head"));
    snake.forEach((p, i) => get(p)?.classList.add("is-snake", ...(i === 0 ? ["is-head"] : [])));
  };

  const stop = (text: string) => {
    window.clearInterval(timer);
    playing = false;
    grid.classList.add("is-over");
    if (hint) hint.textContent = "Нажмите на сетку, чтобы сыграть ещё";
    say(text);
  };

  const step = () => {
    const next = queued.shift();
    if (next && !(next.x === -dir.x && next.y === -dir.y)) dir = next;
    const head = { x: (snake[0].x + dir.x + cols) % cols, y: (snake[0].y + dir.y + rows) % rows };
    const hitSelf = snake.slice(0, -1).some((p) => p.x === head.x && p.y === head.y);
    if (hitSelf) return stop(`Врезался в себя. Собрано ${collected} из ${totalCommits} коммитов.`);
    snake.unshift(head);
    const cell = get(head);
    if (cell?.dataset.commits && !cell.classList.contains("is-eaten")) {
      cell.classList.add("is-eaten");
      collected += Number(cell.dataset.commits);
      say(`Собрано ${collected} из ${totalCommits} коммитов`);
      if (grid.querySelectorAll("[data-commits]:not(.is-eaten)").length === 0) {
        draw();
        return stop(`Все ${totalCommits} коммитов собраны. Теперь вы знаете мой GitHub лучше меня.`);
      }
    } else {
      snake.pop();
    }
    draw();
  };

  const start = () => {
    clear();
    window.clearInterval(timer);
    snake = [
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ];
    dir = { x: 1, y: 0 };
    queued = [];
    collected = 0;
    playing = true;
    grid.classList.add("is-playing");
    if (hint) hint.textContent = "Esc — остановить";
    say(`Стрелки или WASD, на телефоне — свайп. Соберите ${totalCommits} коммитов.`);
    draw();
    timer = window.setInterval(step, 150);
  };

  // сама сетка — кнопка запуска
  grid.addEventListener("click", () => {
    if (!playing) start();
  });
  grid.addEventListener("keydown", (e) => {
    if (!playing && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      start();
    }
  });

  const DIRS: Record<string, P> = {
    ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
  };
  window.addEventListener("keydown", (e) => {
    if (!playing) return;
    if (e.code === "Escape") return stop(`Игра остановлена. Собрано ${collected} из ${totalCommits}.`);
    const d = DIRS[e.code];
    if (!d) return;
    e.preventDefault();
    if (queued.length < 3) queued.push(d);
  });

  // свайпы на сетке
  let touch: { x: number; y: number } | null = null;
  grid.addEventListener("touchstart", (e) => {
    if (!playing) return;
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  grid.addEventListener("touchmove", (e) => {
    if (playing) e.preventDefault();
  }, { passive: false });
  grid.addEventListener("touchend", (e) => {
    if (!playing || !touch) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    queued.push(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
  });

  // остановка при уходе секции с экрана
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting && playing) stop(`Игра на паузе. Собрано ${collected} из ${totalCommits}.`);
  }).observe(grid);
}

export {};
