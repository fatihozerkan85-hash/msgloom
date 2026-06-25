# Özlem Akyüz Kalıp Arşivi (msgloom.com.tr)

PDF giysi kalıplarını bulutta saklamak, dosya adından kategori/etiket önerisi üretmek ve mobil cihazdan yönetmek için hazırlanmış Next.js uygulaması.

## Kurulum

1. Supabase üzerinde yeni bir proje oluşturun.
2. `supabase/schema.sql` dosyasındaki SQL içeriğini Supabase SQL Editor içinde çalıştırın.
3. Supabase Auth bölümünden Özlem Akyüz için bir kullanıcı oluşturun.
4. `.env.example` dosyasını `.env.local` olarak kopyalayıp değerleri doldurun.
5. Uygulamayı çalıştırın:

```bash
npm install
npm run dev
```

## Özellikler

- Kullanıcı girişli arşiv ekranı
- PDF yükleme ve Supabase Storage üzerinde saklama
- Dosya adından otomatik kategori, alt kategori, beden, sezon ve etiket önerisi
- Manuel kategori, etiket, beden, sezon ve not düzenleme
- Metin araması, kategori filtresi ve etiket filtresi
- PDF önizleme ve indirme
- Telefon, tablet ve masaüstüne uygun responsive arayüz

## Canlı Ortam

- Üretim: https://msgloom.com.tr
- Vercel projesi: `msgloom`

