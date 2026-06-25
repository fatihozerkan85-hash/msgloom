export type FilenameAnalysis = {
  title: string;
  category: string;
  subcategory: string;
  size: string;
  season: string;
  tags: string[];
};

export const DEFAULT_CATEGORY = "Diğer";

const categoryTerms: Record<string, string[]> = {
  Elbise: ["elbise", "abiye", "jile"],
  Etek: ["etek"],
  Pantolon: ["pantolon", "pantalon", "tayt"],
  Şort: ["şort", "sort", "shorts"],
  Gömlek: ["gömlek", "gomlek", "bluz", "tunik"],
  Tişört: ["tişört", "tisort", "t-shirt", "tshirt", "t shirt"],
  Ceket: ["ceket", "blazer", "mont", "kaban"],
  Çocuk: ["çocuk", "cocuk", "bebek"],
  Aksesuar: ["yaka", "manşet", "manset", "cep", "kapüşon", "kapuson"],
};

const subcategoryTerms: Record<string, string[]> = {
  Kolsuz: ["kolsuz"],
  "Uzun Kol": ["uzun", "uzunkol", "uzun-kol"],
  "Kısa Kol": ["kisa", "kısa", "kisakol", "kısa-kol"],
  "A Kesim": ["akesim", "a-kesim"],
  Pilili: ["pili", "pilili"],
  Fermuarlı: ["fermuar", "fermuarlı", "fermuarli"],
  Astarlı: ["astar", "astarlı", "astarli"],
  Mini: ["mini"],
  Midi: ["midi"],
  Maksi: ["maksi"],
};

const seasons: Record<string, string[]> = {
  Yaz: ["yaz", "summer"],
  Kış: ["kış", "kis", "winter"],
  İlkbahar: ["ilkbahar", "bahar", "spring"],
  Sonbahar: ["sonbahar", "autumn", "fall"],
};

const categoryMatchers = Object.entries(categoryTerms).flatMap(([category, terms]) =>
  terms.map((term) => ({
    category,
    term,
    normalizedTerm: normalizeText(term),
  })),
).sort((a, b) => b.normalizedTerm.length - a.normalizedTerm.length);

function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function tokenizeFilename(filename: string) {
  const baseName = extractTitleFromFilename(filename);
  const rawTokens = baseName
    .split(/[\s_\-().,+#]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return {
    baseName,
    rawTokens,
    tokens: rawTokens.map(normalizeText),
  };
}

function findByDictionary(tokens: string[], dictionary: Record<string, string[]>) {
  return (
    Object.entries(dictionary).find(([, terms]) =>
      terms.some((term) => tokens.includes(normalizeText(term))),
    )?.[0] ?? ""
  );
}

function termAppearsInBasename(normalizedBase: string, normalizedTerm: string) {
  if (!normalizedTerm) return false;
  if (normalizedBase === normalizedTerm) return true;

  const separatedPattern = new RegExp(
    `(?:^|[\\s_\\-().,+#])${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|[\\s_\\-().,+#])`,
  );
  if (separatedPattern.test(` ${normalizedBase} `)) return true;

  if (!normalizedBase.endsWith(normalizedTerm)) return false;

  const prefix = normalizedBase.slice(0, -normalizedTerm.length);
  if (!prefix) return true;
  if (/[\s_\-().,+#]$/.test(prefix)) return true;

  return /^[a-z0-9]+$/i.test(prefix);
}

export function extractCategoryFromFilename(filename: string): string {
  const { tokens, baseName } = tokenizeFilename(filename);
  const normalizedBase = normalizeText(baseName);

  const fromTokens = findByDictionary(tokens, categoryTerms);
  if (fromTokens) return fromTokens;

  for (const matcher of categoryMatchers) {
    if (termAppearsInBasename(normalizedBase, matcher.normalizedTerm)) {
      return matcher.category;
    }
  }

  return "";
}

function isManualCategoryAllowed(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/[\d]/.test(trimmed)) return false;
  if (/^[^a-zA-ZçğıöşüÇĞİÖŞÜ]+$/.test(trimmed)) return false;
  return true;
}

export function resolveCategory(filename: string, manualCategory = "") {
  const fromFilename = extractCategoryFromFilename(filename);
  if (fromFilename) return fromFilename;

  const manual = manualCategory.trim();
  if (isManualCategoryAllowed(manual)) return manual;

  return DEFAULT_CATEGORY;
}

export function extractTitleFromFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "").trim();
}

export function analyzeFilename(filename: string): FilenameAnalysis {
  const { rawTokens, tokens } = tokenizeFilename(filename);

  const category = extractCategoryFromFilename(filename);
  const subcategory = findByDictionary(tokens, subcategoryTerms);
  const season = findByDictionary(tokens, seasons);
  const size =
    rawTokens.find((token) => /^(xxs|xs|s|m|l|xl|xxl|[0-9]{2})$/i.test(token)) ??
    "";

  const tags = [subcategory, season].filter(Boolean);

  return {
    title: extractTitleFromFilename(filename),
    category,
    subcategory,
    size,
    season,
    tags,
  };
}

export const defaultCategories = [...Object.keys(categoryTerms), DEFAULT_CATEGORY];
export const defaultSeasons = Object.keys(seasons);
