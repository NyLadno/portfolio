// Обновляет src/data/github.snapshot.json реальными данными GitHub API.
// Сборка сайта читает только снапшот, поэтому она детерминирована и не упирается в rate limit.
// Запуск: npm run data:github   (опционально GITHUB_TOKEN=... для лимита выше)

import { writeFile } from "node:fs/promises";

const USER = "NyLadno";
const REPOS = [
  "yandex_lyceum_self_paced_go",
  "Finding-a-vacancy-for-an-internship-bot",
  "tradebot",
];

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "andreev-portfolio",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${path}`);
  return res.json();
}

async function commits(repo) {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await get(`/repos/${USER}/${repo}/commits?per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.map((c) => c.commit.author.date);
}

const repos = [];
for (const name of REPOS) {
  const [meta, languages, dates] = await Promise.all([
    get(`/repos/${USER}/${name}`),
    get(`/repos/${USER}/${name}/languages`),
    commits(name),
  ]);
  repos.push({
    name,
    url: meta.html_url,
    language: meta.language,
    languages,
    createdAt: meta.created_at,
    pushedAt: meta.pushed_at,
    commits: dates.sort(),
  });
  console.log(`${name}: ${dates.length} commits`);
}

const snapshot = { fetchedAt: new Date().toISOString(), user: USER, repos };
await writeFile(new URL("../src/data/github.snapshot.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log("src/data/github.snapshot.json updated");
