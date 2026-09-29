# Портфолио — Андреев Александр, Go Developer

Статичный сайт на [Astro](https://astro.build). Остров Preact используется только для 3D-карточек
сертификатов (компонент Aceternity «3D Card Effect», `src/components/ui/3d-card.tsx`).

## Команды

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # astro check + сборка в dist/
npm run preview      # просмотр собранного dist/
```

## Данные и ассеты

- `npm run assets` — `tools/prepare_assets.py`: сабсет шрифтов из `fonts/*.zip` в WOFF2, рендер
  сертификатов из `certificate/*.pdf`, вордмарк «Яндекс Лицей». Нужны `pip install pymupdf brotli fonttools pillow`.
- `npm run data:github` — обновляет `src/data/github.snapshot.json` (даты коммитов для блока активности).
  Сборка читает только снапшот, поэтому не зависит от GitHub API.
- Тексты, ссылки и схемы проектов — `src/data/site.ts`.

`dist/` — готовый статический сайт, его можно выложить на любой хостинг (GitHub Pages, Netlify, Vercel).
