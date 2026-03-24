'use client';
import LegalPage from '@/components/LegalPage';

export default function PaymentPage() {
  return (
    <LegalPage
      title="Ödeme ve İade Politikası"
      sections={[
        { title: '1. Ödeme Koşulları ve İade — iyzico Entegrasyonu (Payment and Refund)', clauseCount: 60 },
      ]}
    />
  );
}
