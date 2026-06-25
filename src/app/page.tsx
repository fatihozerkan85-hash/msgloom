"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LoginScreen } from "@/components/login-screen";
import {
  analyzeFilename,
  defaultCategories,
  defaultSeasons,
  extractTitleFromFilename,
  resolveCategory,
} from "@/lib/filename-analysis";
import { isSupabaseConfigured, storageBucket, supabase } from "@/lib/supabase";

type PatternRecord = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  subcategory: string;
  size: string;
  season: string;
  tags: string[];
  notes: string;
  pdf_url: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  previewUrl?: string;
};

type PatternForm = {
  title: string;
  category: string;
  subcategory: string;
  size: string;
  season: string;
  tags: string;
  notes: string;
};

const emptyForm: PatternForm = {
  title: "",
  category: "",
  subcategory: "",
  size: "",
  season: "",
  tags: "",
  notes: "",
};

const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
];

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function textToTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<PatternForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [patterns, setPatterns] = useState<PatternRecord[]>([]);
  const [editing, setEditing] = useState<PatternRecord | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [activePreview, setActivePreview] = useState<PatternRecord | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);

  const loadPatterns = useCallback(async () => {
    const client = supabase;
    if (!client) return;

    const { data, error: loadError } = await client
      .from("patterns")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message);
      return;
    }

    const rows = (data ?? []) as PatternRecord[];
    const rowsWithPreviews = await Promise.all(
      rows.map(async (pattern) => {
        const signed = await client.storage
          .from(storageBucket)
          .createSignedUrl(pattern.storage_path, 60 * 60);

        return {
          ...pattern,
          previewUrl: signed.data?.signedUrl,
        };
      }),
    );

    setPatterns(rowsWithPreviews);
    setActivePreview((current) =>
      current
        ? rowsWithPreviews.find((pattern) => pattern.id === current.id) ?? null
        : rowsWithPreviews[0] ?? null,
    );
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
      if (data.session) {
        void loadPatterns();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        void loadPatterns();
      } else {
        setPatterns([]);
        setActivePreview(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadPatterns]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set([
          ...defaultCategories,
          ...patterns.map((pattern) => pattern.category).filter(Boolean),
        ]),
      ),
    [patterns],
  );

  const tags = useMemo(
    () => Array.from(new Set(patterns.flatMap((pattern) => pattern.tags))).sort(),
    [patterns],
  );

  const filteredPatterns = useMemo(() => {
    const query = search.toLocaleLowerCase("tr-TR");

    return patterns.filter((pattern) => {
      const matchesSearch =
        !query ||
        [
          pattern.title,
          pattern.category,
          pattern.subcategory,
          pattern.size,
          pattern.season,
          pattern.notes,
          ...pattern.tags,
        ]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(query);

      const matchesCategory = !categoryFilter || pattern.category === categoryFilter;
      const matchesTag = !tagFilter || pattern.tags.includes(tagFilter);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [categoryFilter, patterns, search, tagFilter]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError("");
    setMessage("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (loginError) {
      setError(loginError.message);
    }
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    setMessage("");
    setError("");

    if (!nextFile) return;

    if (nextFile.type !== "application/pdf" && !nextFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Lütfen PDF formatında bir kalıp dosyası seçin.");
      return;
    }

    const analysis = analyzeFilename(nextFile.name);
    setForm((current) => ({
      ...current,
      title: extractTitleFromFilename(nextFile.name),
      category: resolveCategory(nextFile.name, current.category),
      subcategory: current.subcategory || analysis.subcategory,
      size: current.size || analysis.size,
      season: current.season || analysis.season,
      tags: current.tags || tagsToText(analysis.tags),
    }));
  }

  function startEditing(pattern: PatternRecord) {
    setEditing(pattern);
    setFile(null);
    setForm({
      title: pattern.title,
      category: pattern.category,
      subcategory: pattern.subcategory,
      size: pattern.size,
      season: pattern.season,
      tags: tagsToText(pattern.tags),
      notes: pattern.notes,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setFile(null);
    setEditing(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !session?.user) return;

    if (!editing && !file) {
      setError("Yeni kayıt oluşturmak için bir PDF dosyası seçin.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      let storagePath = editing?.storage_path ?? "";

      if (file) {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          throw new Error("Lütfen PDF formatında bir kalıp dosyası seçin.");
        }

        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        storagePath = `${session.user.id}/${Date.now()}-${safeName}`;
        const upload = await supabase.storage
          .from(storageBucket)
          .upload(storagePath, file, { contentType: "application/pdf" });

        if (upload.error) throw upload.error;
      }

      const payload = {
        user_id: session.user.id,
        title: form.title.trim() || extractTitleFromFilename(file?.name ?? ""),
        category: resolveCategory(file?.name ?? "", form.category),
        subcategory: form.subcategory.trim(),
        size: form.size.trim(),
        season: form.season.trim(),
        tags: textToTags(form.tags),
        notes: form.notes.trim(),
        pdf_url: "",
        storage_path: storagePath,
      };

      if (!payload.title) {
        throw new Error("Kalıp adı zorunludur.");
      }

      if (editing) {
        const update = await supabase
          .from("patterns")
          .update(payload)
          .eq("id", editing.id);
        if (update.error) throw update.error;

        if (file && editing.storage_path !== storagePath) {
          await supabase.storage.from(storageBucket).remove([editing.storage_path]);
        }

        setMessage("Kalıp kaydı güncellendi.");
      } else {
        const insert = await supabase.from("patterns").insert(payload);
        if (insert.error) throw insert.error;
        setMessage("PDF kalıp arşive eklendi.");
      }

      resetForm();
      await loadPatterns();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pattern: PatternRecord) {
    if (!supabase) return;
    const confirmed = window.confirm(`${pattern.title} kaydını silmek istiyor musunuz?`);
    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    const deleteRecord = await supabase.from("patterns").delete().eq("id", pattern.id);

    if (deleteRecord.error) {
      setError(deleteRecord.error.message);
      setLoading(false);
      return;
    }

    await supabase.storage.from(storageBucket).remove([pattern.storage_path]);
    setMessage("Kayıt silindi.");
    await loadPatterns();
    setLoading(false);
  }

  if (authLoading) {
    return (
      <main className="login-loading-screen">
        <div className="login-loading-card">
          <span className="login-spinner border-stone-300 border-t-stone-700" />
          <p className="text-sm font-medium text-stone-600">Arşiv hazırlanıyor...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <LoginScreen
        configured={isSupabaseConfigured}
        email={email}
        error={error}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        password={password}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,transparent_32%),linear-gradient(135deg,#fffaf5,#f6efe8_45%,#eadfd3)] text-stone-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.35em] text-amber-700">
                KALIP ARŞİVİ
              </p>
              <h1 className="font-[var(--font-brand-script)] text-5xl font-bold text-stone-900 sm:text-6xl md:text-7xl">
                Özlem Akyüz
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                PDF giysi kalıplarını bulutta saklayın, dosya adından otomatik
                kategori önerisi alın ve arşivi mobil cihazdan da yönetin.
              </p>
            </div>

            <button className="secondary-button" onClick={handleLogout} type="button">
              Çıkış Yap
            </button>
          </div>
        </header>

        {error ? <div className="status-card border-red-200 bg-red-50 text-red-700">{error}</div> : null}
        {message ? (
          <div className="status-card border-emerald-200 bg-emerald-50 text-emerald-700">
            {message}
          </div>
        ) : null}

        <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <form className="panel grid gap-4 p-5 sm:p-6" onSubmit={handleSave}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  {editing ? "Kayıt Düzenle" : "Yeni PDF Kalıp"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {editing ? editing.title : "Kalıp Yükle"}
                </h2>
              </div>

              <label className="field-label">
                PDF Dosyası
                <input
                  accept="application/pdf,.pdf"
                  className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                  required={!editing}
                  type="file"
                />
              </label>

              <label className="field-label">
                Kalıp adı
                <input
                  className="field-input"
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                  value={form.title}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <label className="field-label">
                  Kategori
                  <input
                    className="field-input"
                    list="category-options"
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    placeholder="Elbise, Etek..."
                    value={form.category}
                  />
                </label>
                <label className="field-label">
                  Alt kategori
                  <input
                    className="field-input"
                    onChange={(event) => setForm({ ...form, subcategory: event.target.value })}
                    placeholder="Kolsuz, A kesim..."
                    value={form.subcategory}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Beden
                  <input
                    className="field-input"
                    list="size-options"
                    onChange={(event) => setForm({ ...form, size: event.target.value })}
                    placeholder="38, M..."
                    value={form.size}
                  />
                </label>
                <label className="field-label">
                  Sezon
                  <input
                    className="field-input"
                    list="season-options"
                    onChange={(event) => setForm({ ...form, season: event.target.value })}
                    placeholder="Yaz, Kış..."
                    value={form.season}
                  />
                </label>
              </div>

              <label className="field-label">
                Etiketler
                <input
                  className="field-input"
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="kolsuz, fermuarlı, prova"
                  value={form.tags}
                />
              </label>

              <label className="field-label">
                Notlar
                <textarea
                  className="field-input min-h-28 resize-y"
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Model, müşteri veya dikim notu"
                  value={form.notes}
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="primary-button flex-1" disabled={loading} type="submit">
                  {loading ? "Kaydediliyor..." : editing ? "Güncelle" : "Arşive Ekle"}
                </button>
                {editing ? (
                  <button className="secondary-button flex-1" onClick={resetForm} type="button">
                    Vazgeç
                  </button>
                ) : null}
              </div>
            </form>

            <section className="grid gap-5">
              <div className="panel grid gap-4 p-5 sm:p-6">
                <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
                  <input
                    className="field-input"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Kalıp adı, etiket, beden veya not ara..."
                    value={search}
                  />
                  <select
                    className="field-input"
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    value={categoryFilter}
                  >
                    <option value="">Tüm kategoriler</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    className="field-input"
                    onChange={(event) => setTagFilter(event.target.value)}
                    value={tagFilter}
                  >
                    <option value="">Tüm etiketler</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-stone-500">
                  {filteredPatterns.length} kayıt gösteriliyor.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="grid gap-3">
                  {filteredPatterns.length === 0 ? (
                    <div className="panel p-6 text-sm text-stone-600">
                      Henüz kayıt yok veya filtrelere uygun sonuç bulunamadı.
                    </div>
                  ) : (
                    filteredPatterns.map((pattern) => (
                      <article className="pattern-card" key={pattern.id}>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold">{pattern.title}</h3>
                          <p className="mt-1 text-sm text-stone-500">
                            {[pattern.category, pattern.subcategory, pattern.size, pattern.season]
                              .filter(Boolean)
                              .join(" · ") || "Kategori bilgisi eklenmedi"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {pattern.tags.map((tag) => (
                              <button
                                className="tag-chip"
                                key={tag}
                                onClick={() => setTagFilter(tag)}
                                type="button"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                          <button
                            className="secondary-button"
                            onClick={() => setActivePreview(pattern)}
                            type="button"
                          >
                            Önizle
                          </button>
                          {pattern.previewUrl ? (
                            <a className="secondary-button text-center" href={pattern.previewUrl}>
                              İndir
                            </a>
                          ) : null}
                          <button
                            className="secondary-button"
                            onClick={() => startEditing(pattern)}
                            type="button"
                          >
                            Düzenle
                          </button>
                          <button
                            className="danger-button"
                            disabled={loading}
                            onClick={() => void handleDelete(pattern)}
                            type="button"
                          >
                            Sil
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <aside className="panel sticky top-5 h-fit overflow-hidden">
                  <div className="border-b border-stone-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                      PDF Önizleme
                    </p>
                    <h2 className="mt-2 font-semibold">
                      {activePreview?.title ?? "Bir kalıp seçin"}
                    </h2>
                  </div>
                  {activePreview?.previewUrl ? (
                    <iframe
                      className="h-[520px] w-full bg-stone-100"
                      src={activePreview.previewUrl}
                      title={`${activePreview.title} PDF önizleme`}
                    />
                  ) : (
                    <div className="p-5 text-sm leading-6 text-stone-600">
                      Listeden bir kayıt seçerek PDF dosyasını burada önizleyebilir
                      veya telefonda indirme bağlantısını kullanabilirsiniz.
                    </div>
                  )}
                </aside>
              </div>
            </section>
          </section>

        <datalist id="category-options">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <datalist id="season-options">
          {defaultSeasons.map((season) => (
            <option key={season} value={season} />
          ))}
        </datalist>
        <datalist id="size-options">
          {sizeOptions.map((size) => (
            <option key={size} value={size} />
          ))}
        </datalist>
      </section>
    </main>
  );
}
