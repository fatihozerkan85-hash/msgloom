'use client';
import LegalPage from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası ve Kişisel Verilerin Korunması"
      sections={[
        { title: '1. Veri Koruma — GDPR & KVKK Uyumu', clauseCount: 60 },
        { title: '2. Veri İşleme Sözleşmesi (DPA)', clauseCount: 60 },
        { title: '3. Alt İşleyiciler (Sub-processors)', clauseCount: 60 },
        { title: '4. Veri İhlali Bildirimi — 72 Saat Kuralı', clauseCount: 60 },
      ]}
    />
  );
}
