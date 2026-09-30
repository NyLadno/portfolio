// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";

// Vercel serves the project from the domain root, while GitHub Pages
// serves it under /portfolio — VERCEL is set automatically by Vercel builds.
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  // Проектный сайт: https://nyladno.github.io/portfolio/
  site: onVercel ? "https://portfolio-eight-zeta-kh5yyr17ry.vercel.app" : "https://nyladno.github.io",
  base: onVercel ? "/" : "/portfolio",
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()],
  },
});
