// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Проектный сайт: https://nyladno.github.io/portfolio/
  site: "https://nyladno.github.io",
  base: "/portfolio",
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()],
  },
});
