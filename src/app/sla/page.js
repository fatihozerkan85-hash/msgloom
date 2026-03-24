'use client';
import LegalPage from '@/components/LegalPage';

export default function SlaPage() {
  return (
    <LegalPage
      title="Hizmet Seviyesi Anlaşması (SLA)"
      sections={[
        { title: '1. Hizmet Seviyesi Taahhütleri', clauseCount: 60 },
        { title: '2. Sorumluluk Sınırlandırması', clauseCount: 60 },
        { title: '3. Tazminat (Indemnification)', clauseCount: 60 },
        { title: '4. WhatsApp / Meta Uyumluluk Politikası', clauseCount: 60 },
      ]}
    />
  );
}
