// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Сайт-пользователь: репозиторий NyLadno.github.io отдаётся с корня, поэтому base не нужен.
  site: "https://nyladno.github.io",
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()],
  },
});
