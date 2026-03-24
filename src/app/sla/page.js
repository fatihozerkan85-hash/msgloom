'use client';
import LegalPage from '@/components/LegalPage';

export default function SlaPage() {
  return (
    <LegalPage
      title="Hizmet Seviyesi Anlaşması (SLA)"
      sections={[
        { title: '1. WhatsApp / Meta Uyumluluk Politikası (WhatsApp / Meta Compliance)', clauseCount: 60 },
        { title: '2. Hizmet Seviyesi Taahhütleri (Service Level Agreement)', clauseCount: 60 },
        { title: '3. Sorumluluk Sınırlandırması (Limitation of Liability)', clauseCount: 60 },
        { title: '4. Tazminat (Indemnification)', clauseCount: 60 },
      ]}
    />
  );
}
