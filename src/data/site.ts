// Всё содержимое сайта — только проверяемые факты из репозиториев, README и сертификатов.

export const person = {
  name: "Андреев Александр",
  nameRows: ["Андреев", "Александр"],
  roleRows: ["Go", "Developer"],
  shortName: "А. Андреев",
};

export const links = {
  github: "https://github.com/NyLadno",
  telegram: "https://t.me/Ny_ladno14",
  telegramHandle: "@Ny_ladno14",
  email: "nyladno14@gmail.com",
};

const repo = (name: string) => `${links.github}/${name}`;
export const repos = {
  lyceum: repo("yandex_lyceum_self_paced_go"),
  tracker: repo("Finding-a-vacancy-for-an-internship-bot"),
  tradebot: repo("tradebot"),
};
export const file = (repoUrl: string, path: string) => `${repoUrl}/blob/main/${path}`;

export const nav = [
  { href: "#about", label: "Обо мне" },
  { href: "#certificates", label: "Сертификаты" },
  { href: "#stack", label: "Стек" },
  { href: "#projects", label: "Проекты" },
  { href: "#contact", label: "Контакты" },
];

/* ---------- стек ---------- */

export type StackItem = {
  name: string;
  icon?: string; // slug simple-icons
  evidence: { label: string; href: string };
  node?: "request" | "handler" | "logic" | "database" | "response" | "docker";
};

export const stackGroups: { title: string; note: string; items: StackItem[] }[] = [
  {
    title: "Core",
    note: "то, на чём написан основной проект",
    items: [
      { name: "Go", icon: "go", node: "logic", evidence: { label: "main.go", href: file(repos.tracker, "main.go") } },
      { name: "HTTP и REST API", node: "handler", evidence: { label: "api.go", href: file(repos.tracker, "api.go") } },
      { name: "SQL", node: "database", evidence: { label: "schema.sql", href: file(repos.tracker, "schema.sql") } },
      { name: "Тесты на Go", node: "logic", evidence: { label: "main_test.go", href: file(repos.lyceum, "main_test.go") } },
    ],
  },
  {
    title: "Working with",
    note: "подключал и настраивал сам",
    items: [
      { name: "SQLite", icon: "sqlite", node: "database", evidence: { label: "db.go", href: file(repos.tracker, "db.go") } },
      {
        name: "PostgreSQL через Supabase",
        icon: "postgresql",
        node: "database",
        evidence: { label: "supabase.py", href: file(repos.tradebot, "app/storage/supabase.py") },
      },
      { name: "Telegram Bot API", icon: "telegram", node: "response", evidence: { label: "telegram.go", href: file(repos.tracker, "telegram.go") } },
      { name: "Docker", icon: "docker", node: "docker", evidence: { label: "Dockerfile", href: file(repos.tracker, "Dockerfile") } },
      { name: "goquery, JSON-LD", node: "request", evidence: { label: "internships.go", href: file(repos.tracker, "internships.go") } },
    ],
  },
  {
    title: "Tools",
    note: "каждый день",
    items: [
      { name: "Git", icon: "git", evidence: { label: "история коммитов", href: `${repos.tracker}/commits/main` } },
      { name: "GitHub", icon: "github", evidence: { label: "NyLadno", href: links.github } },
    ],
  },
];

export const stackBeside = {
  title: "Рядом",
  text: "Python — для side-проектов: FastAPI, asyncio, httpx, LLM-API.",
  evidence: { label: "tradebot/app/main.py", href: file(repos.tradebot, "app/main.py") },
};

/* ---------- проекты ---------- */

export type InspectorNode = {
  id: string;
  title: string;
  sub: string;
  text: string;
  code?: string;
  lang?: "go" | "sql" | "docker";
  file?: { label: string; href: string };
  samples?: { title: string; pass: boolean; why: string }[];
};

export const trackerNodes: InspectorNode[] = [
  {
    id: "source",
    title: "Источник",
    sub: "youngjunior.ru",
    text: "Страница со списком Go-стажировок. Раньше я проверял её руками.",
    code: `const (\n\tbaseURL   = "https://youngjunior.ru"\n\ttargetURL = baseURL + "/go/internships"\n)`,
    lang: "go",
    file: { label: "internships.go", href: file(repos.tracker, "internships.go") },
  },
  {
    id: "fetch",
    title: "Раз в час",
    sub: "time.Ticker · net/http",
    text: "Главный цикл: при старте сразу проверяет сайт, дальше — по тикеру раз в час.",
    code: `checkInterval = time.Hour\n// …\nticker := time.NewTicker(checkInterval)\nfor range ticker.C {\n\tcheckInternships(db, bot)\n}`,
    lang: "go",
    file: { label: "main.go", href: file(repos.tracker, "main.go") },
  },
  {
    id: "parse",
    title: "Парсинг",
    sub: "goquery · h3",
    text: "Из HTML достаются заголовки вакансий и ссылки на них; относительные ссылки превращаются в абсолютные.",
    code: `doc.Find("h3.__className_dda9cc").Each(func(i int, s *goquery.Selection) {\n\ttitle := strings.TrimSpace(s.Text())\n\t// …\n\thref, ok := s.Closest("a").Attr("href")`,
    lang: "go",
    file: { label: "internships.go", href: file(repos.tracker, "internships.go") },
  },
  {
    id: "filter",
    title: "Фильтр",
    sub: "2 × regexp",
    text: "В заголовке должно быть и Go, и слово про стажировку. Так отсеиваются стажировки на других языках.",
    code: `var goLangRe = regexp.MustCompile(\`(?i)\\b(go|golang)\\b\`)\nvar internRe = regexp.MustCompile(\`(?i)(стажер|стажёр|стажировк|intern|trainee)\`)\n\nif !goLangRe.MatchString(title) || !internRe.MatchString(title) {\n\treturn\n}`,
    lang: "go",
    file: { label: "internships.go", href: file(repos.tracker, "internships.go") },
    samples: [
      { title: "Стажёр Go-разработчик", pass: true, why: "go + стажёр" },
      { title: "Golang trainee", pass: true, why: "golang + trainee" },
      { title: "Python intern", pass: false, why: "нет go" },
      { title: "Go-разработчик (middle)", pass: false, why: "не стажировка" },
    ],
  },
  {
    id: "details",
    title: "Детали",
    sub: "JSON-LD · JobPosting",
    text: "Для новой вакансии открывается её страница, и полное описание берётся из разметки schema.org.",
    code: `doc.Find(\`script[type="application/ld+json"]\`).EachWithBreak(...)\n// …\nif posting.Type == "JobPosting" && posting.Description != "" {\n\tbody = posting.Description`,
    lang: "go",
    file: { label: "internships.go", href: file(repos.tracker, "internships.go") },
  },
  {
    id: "store",
    title: "SQLite",
    sub: "без дублей",
    text: "URL уникален, поэтому одна вакансия не сохранится и не придёт в Telegram дважды. Пул соединений — одно: API, бот и чекер пишут в базу параллельно.",
    code: `INSERT INTO vacancies (url, title, body, published_at)\nVALUES (?, ?, ?, ?)\nON CONFLICT(url) DO NOTHING\n\n// db.go\ndb.SetMaxOpenConns(1)`,
    lang: "sql",
    file: { label: "vacancy.go", href: file(repos.tracker, "vacancy.go") },
  },
  {
    id: "api",
    title: "REST API",
    sub: "net/http · :8080",
    text: "Четыре эндпоинта для управления базой. Ими пользуется бот, но можно и напрямую — curl, Postman.",
    code: `mux.HandleFunc("GET /api/vacancies", handleListVacancies(db))\nmux.HandleFunc("GET /api/vacancies/{id}", handleGetVacancy(db))\nmux.HandleFunc("PATCH /api/vacancies/{id}", handleUpdateVacancy(db))\nmux.HandleFunc("DELETE /api/vacancies/{id}", handleDeleteVacancy(db))`,
    lang: "go",
    file: { label: "api.go", href: file(repos.tracker, "api.go") },
  },
  {
    id: "bot",
    title: "Telegram-бот",
    sub: "ходит в базу через API",
    text: "Присылает новую вакансию с кнопками. Нажатия превращаются в PATCH и DELETE к REST API, а не в прямые запросы к базе.",
    code: `tgbotapi.NewInlineKeyboardButtonData("✏️ Изменить", fmt.Sprintf("edit:%d", id)),\ntgbotapi.NewInlineKeyboardButtonData("🗑 Удалить", fmt.Sprintf("del:%d", id)),\ntgbotapi.NewInlineKeyboardButtonData("✅ Откликнуться", fmt.Sprintf("apply:%d", id)),`,
    lang: "go",
    file: { label: "telegram.go", href: file(repos.tracker, "telegram.go") },
  },
  {
    id: "user",
    title: "Я в Telegram",
    sub: "уведомление + кнопки",
    text: "Новая Go-стажировка приходит сообщением: описание и три кнопки. Отклик отмечается прямо в чате.",
  },
  {
    id: "docker",
    title: "Docker",
    sub: "multi-stage → distroless",
    text: "Сборка в golang:alpine, запуск в distroless без шелла. SQLite на чистом Go, поэтому бинарник статический.",
    code: `RUN CGO_ENABLED=0 go build -o /out/internship-tracker .\n\n# --- runtime stage ---\nFROM gcr.io/distroless/static-debian12\nVOLUME ["/app"]`,
    lang: "docker",
    file: { label: "Dockerfile", href: file(repos.tracker, "Dockerfile") },
  },
];

export const trackerCounters = [
  { value: 60, unit: "мин", label: "между проверками сайта" },
  { value: 4, unit: "", label: "эндпоинта REST API" },
  { value: 3, unit: "", label: "горутины работают параллельно" },
  { value: 1, unit: "", label: "соединение к SQLite — осознанно" },
];

export const tradebotSources = ["Google News RSS", "NewsAPI", "ТАСС", "РИА Новости", "Интерфакс", "Ведомости", "Лента.ру", "Mail.ru"];

export const tradebotSteps = [
  { title: "Сбор", sub: "APScheduler · каждые 5 мин, 09–22 МСК", href: file(repos.tradebot, "app/main.py") },
  { title: "Фильтр и дедуп", sub: "релевантность эмитенту, уникальный URL", href: file(repos.tradebot, "app/storage/pipeline.py") },
  { title: "LLM-оценка риска", sub: "Gemini → JSON, итог пересчитывается в коде", href: file(repos.tradebot, "app/llm/evaluator.py") },
  { title: "База", sub: "Supabase · PostgreSQL, RLS", href: file(repos.tradebot, "app/storage/news_alerts.py") },
];

export const tradebotOutputs = [
  { title: "Telegram", sub: "только если новость блокирует торговлю, без повторов" },
  { title: "Торговый движок", sub: "пара TATN/TATNP, по умолчанию PAPER" },
];

export const tradebotFeatures = ["Async pipeline", "Retry", "Deduplication", "REST API", "WebSocket", "Risk evaluation"];

/* ---------- путь ---------- */

export const timeline = [
  { date: "окт 2023 — май 2024", title: "Учёба", text: "Продвинутый Python: визуализация и анализ данных" },
  { date: "ноя 2025", title: "Яндекс Лицей", text: "Курс «Go: шаг за шагом», первый Go-репозиторий" },
  { date: "дек 2025", title: "Go", text: "Сертификат Go, тесты и работа с файлами" },
  { date: "июл 2026", title: "Backend-проекты", text: "TradeBot: async-пайплайн, LLM, PostgreSQL" },
  { date: "сен 2026", title: "Реальная автоматизация", text: "Internship Tracker: Go, REST API, SQLite, Docker" },
  { date: "сейчас", title: "Поиск стажировки", text: "Ищу первую команду: backend / Go", now: true },
];
