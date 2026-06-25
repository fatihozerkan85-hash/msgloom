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
  Şort: ["sort", "şort", "shorts"],
  Gömlek: ["gomlek", "gömlek", "bluz", "tunik"],
  Tişört: ["tisort", "tişört", "tshirt", "t-shirt", "t shirt"],
  Ceket: ["ceket", "blazer", "mont", "kaban"],
  Çocuk: ["cocuk", "çocuk", "bebek"],
  Aksesuar: ["yaka", "manset", "manşet", "cep", "kapuson", "kapüşon"],
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
  Kış: ["kis", "kış", "winter"],
  İlkbahar: ["ilkbahar", "bahar", "spring"],
  Sonbahar: ["sonbahar", "autumn", "fall"],
};


function normalizeToken(value: string) {
  return value
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
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const rawTokens = baseName
    .split(/[\s_\-().,+#]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return {
    baseName,
    rawTokens,
    tokens: rawTokens.map(normalizeToken),
  };
}

function findByDictionary(tokens: string[], dictionary: Record<string, string[]>) {
  return (
    Object.entries(dictionary).find(([, terms]) =>
      terms.some((term) => tokens.includes(normalizeToken(term))),
    )?.[0] ?? ""
  );
}

export function extractCategoryFromFilename(filename: string): string {
  const { tokens } = tokenizeFilename(filename);
  return findByDictionary(tokens, categoryTerms);
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

export function analyzeFilename(filename: string): FilenameAnalysis {
  const { baseName, rawTokens, tokens } = tokenizeFilename(filename);

  const category = extractCategoryFromFilename(filename);
  const subcategory = findByDictionary(tokens, subcategoryTerms);
  const season = findByDictionary(tokens, seasons);
  const size =
    rawTokens.find((token) => /^(xxs|xs|s|m|l|xl|xxl|[0-9]{2})$/i.test(token)) ??
    "";

  const tags = [subcategory, season].filter(Boolean);

  return {
    title: baseName.replace(/[_-]+/g, " ").trim(),
    category,
    subcategory,
    size,
    season,
    tags,
  };
}

export const defaultCategories = [...Object.keys(categoryTerms), DEFAULT_CATEGORY];
export const defaultSeasons = Object.keys(seasons);
