export type FilenameAnalysis = {
  title: string;
  category: string;
  subcategory: string;
  size: string;
  season: string;
  tags: string[];
};

const categoryTerms: Record<string, string[]> = {
  Elbise: ["elbise", "abiye", "jile"],
  Etek: ["etek", "mini", "midi", "maksi"],
  Pantolon: ["pantolon", "pantalon", "tayt"],
  Gömlek: ["gomlek", "gömlek", "bluz", "tunik"],
  Ceket: ["ceket", "blazer", "mont", "kaban"],
  Çocuk: ["cocuk", "çocuk", "bebek", "kiz", "kız", "erkek"],
  Aksesuar: ["yaka", "kol", "manşet", "manset", "cep", "kapuson", "kapüşon"],
};

const subcategoryTerms: Record<string, string[]> = {
  Kolsuz: ["kolsuz"],
  "Uzun Kol": ["uzun", "uzunkol", "uzun-kol"],
  "Kısa Kol": ["kisa", "kısa", "kisakol", "kısa-kol"],
  "A Kesim": ["akesim", "a-kesim"],
  Pilili: ["pili", "pilili"],
  Fermuarlı: ["fermuar", "fermuarlı", "fermuarli"],
  Astarlı: ["astar", "astarlı", "astarli"],
};

const seasons: Record<string, string[]> = {
  Yaz: ["yaz", "summer"],
  Kış: ["kis", "kış", "winter"],
  İlkbahar: ["ilkbahar", "bahar", "spring"],
  Sonbahar: ["sonbahar", "autumn", "fall"],
};

const stopWords = new Set(["pdf", "kalip", "kalıp", "model", "patron"]);

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

function findByDictionary(tokens: string[], dictionary: Record<string, string[]>) {
  return (
    Object.entries(dictionary).find(([, terms]) =>
      terms.some((term) => tokens.includes(normalizeToken(term))),
    )?.[0] ?? ""
  );
}

export function analyzeFilename(filename: string): FilenameAnalysis {
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const rawTokens = baseName
    .split(/[\s_\-().,]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  const tokens = rawTokens.map(normalizeToken);

  const category = findByDictionary(tokens, categoryTerms);
  const subcategory = findByDictionary(tokens, subcategoryTerms);
  const season = findByDictionary(tokens, seasons);
  const size =
    rawTokens.find((token) => /^(xxs|xs|s|m|l|xl|xxl|[0-9]{2})$/i.test(token)) ??
    "";

  const knownTerms = new Set([
    ...Object.values(categoryTerms).flat().map(normalizeToken),
    ...Object.values(subcategoryTerms).flat().map(normalizeToken),
    ...Object.values(seasons).flat().map(normalizeToken),
    normalizeToken(size),
    ...Array.from(stopWords).map(normalizeToken),
  ]);

  const tags = Array.from(
    new Set(
      rawTokens
        .filter((token) => token.length > 1)
        .filter((token) => !knownTerms.has(normalizeToken(token)))
        .filter((token) => !/^[0-9]{2}$/.test(token)),
    ),
  );

  return {
    title: baseName.replace(/[_-]+/g, " ").trim(),
    category,
    subcategory,
    size,
    season,
    tags,
  };
}

export const defaultCategories = Object.keys(categoryTerms);
export const defaultSeasons = Object.keys(seasons);
