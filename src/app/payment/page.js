'use client';
import LegalPage from '@/components/LegalPage';

export default function PaymentPage() {
  return (
    <LegalPage
      title="Ödeme ve İade Politikası"
      sections={[
        { title: '1. Ödeme Koşulları ve iyzico Entegrasyonu', clauseCount: 60 },
        { title: '2. İade ve Cayma Hakkı', clauseCount: 60 },
      ]}
    />
  );
}
