// Неразрывные пробелы после коротких слов и перед тире — чтобы предлоги не висели в конце строки.
const SHORT =
  /(^|[\s(«"])(в|во|и|с|со|к|ко|о|об|у|а|я|на|по|не|ни|из|за|до|от|для|без|под|над|при|про|что|как|или|но|же|ее|её|их|мне|раз|без)\s+/giu;

export function typo(text: string): string {
  return text
    .replace(SHORT, (_m, before: string, word: string) => `${before}${word} `)
    .replace(SHORT, (_m, before: string, word: string) => `${before}${word} `)
    .replace(/\s+—/g, " —")
    .replace(/(\d)\s+(мин|ч|окон|коммит)/g, "$1 $2");
}

const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export function shortDate(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return `${get("day")} ${MONTHS[get("month") - 1]} ${get("year")}`;
}

export function dottedDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
