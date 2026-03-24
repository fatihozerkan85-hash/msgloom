'use client';
import LegalPage from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      sections={[
        { title: '1. Tanımlar', clauseCount: 60 },
        { title: '2. Hizmet Kapsamı', clauseCount: 60 },
        { title: '3. Kullanıcı Yükümlülükleri', clauseCount: 60 },
        { title: '4. Kabul Edilebilir Kullanım Politikası', clauseCount: 60 },
        { title: '5. Fesih ve Hesap Kapatma', clauseCount: 60 },
        { title: '6. Uygulanacak Hukuk ve Uyuşmazlık Çözümü', clauseCount: 60 },
      ]}
    />
  );
}
