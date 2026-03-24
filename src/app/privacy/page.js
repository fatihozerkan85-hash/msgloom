'use client';
import LegalPage from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası ve Kişisel Verilerin Korunması"
      sections={[
        { title: '1. Veri Koruma — GDPR & KVKK (Data Protection)', clauseCount: 60 },
        { title: '2. Veri İşleme Sözleşmesi (Data Processing Agreement / DPA)', clauseCount: 60 },
        { title: '3. Alt İşleyiciler (Sub-processors)', clauseCount: 60 },
        { title: '4. Güvenlik ve Kayıt Tutma (Security & Logging)', clauseCount: 60 },
        { title: '5. Veri İhlali Bildirimi — 72 Saat Kuralı (Data Breach)', clauseCount: 60 },
      ]}
    />
  );
}
