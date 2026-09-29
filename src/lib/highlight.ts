// Минимальная подсветка для коротких фрагментов: комментарии, строки, ключевые слова.
const KEYWORDS =
  /\b(func|var|const|if|for|range|return|go|defer|type|struct|INSERT|INTO|VALUES|ON|CONFLICT|DO|NOTHING|FROM|RUN|VOLUME|AS)\b/g;

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (/^(\/\/|--|#)/.test(trimmed)) return `<span class="c">${escape(line)}</span>`;
      // строки и raw-строки выделяем до ключевых слов, чтобы не подсветить слова внутри них
      const parts = line.split(/("(?:[^"\\]|\\.)*"|`[^`]*`)/g);
      return parts
        .map((part, i) => (i % 2 ? `<span class="s">${escape(part)}</span>` : escape(part).replace(KEYWORDS, '<span class="k">$1</span>')))
        .join("");
    })
    .join("\n");
}
