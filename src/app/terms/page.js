'use client';
import LegalPage from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      sections={[
        { title: '1. Tanımlar (Definitions)', clauseCount: 60 },
        { title: '2. Hizmet Kapsamı (Scope of Service)', clauseCount: 60 },
        { title: '3. Kullanıcı Yükümlülükleri (User Obligations)', clauseCount: 60 },
        { title: '4. Kabul Edilebilir Kullanım (Acceptable Use)', clauseCount: 60 },
        { title: '5. Fesih ve Hesap Kapatma (Termination)', clauseCount: 60 },
        { title: '6. Uygulanacak Hukuk (Governing Law)', clauseCount: 60 },
      ]}
    />
  );
}
