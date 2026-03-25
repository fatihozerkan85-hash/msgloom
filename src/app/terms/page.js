'use client';
import LegalPage from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Mesafeli Satış ve SaaS Hizmet Sözleşmesi"
      sections={[
        { title: '1. TARAFLAR', content: 'Satıcı: Export Box Bilişim ve Dış Ticaret A.Ş.\nWeb: www.msgloom.com.tr\nAlıcı: Platform üzerinden hizmet satın alan kullanıcı' },
        { title: '2. KONU', content: 'İşbu sözleşme, MSGLOOM platformu üzerinden sunulan SaaS hizmetlerinin satışı, kullanımı ve tarafların hak ve yükümlülüklerini düzenler.' },
        { title: '3. HİZMET TANIMI', content: 'MSGLOOM, bulut tabanlı yazılım hizmeti sunar. Kullanıcı, hizmete internet üzerinden erişim sağlar.' },
        { title: '4. ÜYELİK VE HESAP', content: 'Kullanıcı, doğru bilgi vermekle yükümlüdür. Hesap güvenliği kullanıcıya aittir.' },
        { title: '5. ÜCRET VE ÖDEME', content: 'Ödemeler iyzico altyapısı ile gerçekleştirilir. Kredi kartı bilgileri sistemde tutulmaz.' },
        { title: '6. ABONELİK VE YENİLEME', content: 'Hizmet abonelik esasına dayanır. Süre sonunda otomatik yenilenir. Kullanıcı iptal etmediği sürece ücret tahsil edilir.' },
        { title: '7. İPTAL VE İADE', content: 'Dijital hizmetlerde ifa başladıktan sonra cayma hakkı bulunmaz. Kullanıcı aboneliğini bir sonraki dönem için iptal edebilir.' },
        { title: '8. KVKK VE VERİ KORUMA', content: 'Kişisel veriler KVKK\'ya uygun şekilde işlenir. Kullanıcı verileri korunur ve üçüncü kişilerle yalnızca gerekli durumlarda paylaşılır.' },
        { title: '9. HİZMET SEVİYESİ', content: 'Şirket kesintisiz hizmet garantisi vermez. Bakım ve güncellemeler yapılabilir.' },
        { title: '10. SORUMLULUK SINIRLARI', content: 'Şirket dolaylı zararlardan sorumlu değildir.' },
        { title: '11. FİKRİ MÜLKİYET', content: 'Tüm yazılım ve içerik hakları Export Box Bilişim ve Dış Ticaret A.Ş.\'ye aittir.' },
        { title: '12. UYUŞMAZLIK', content: 'Ankara Mahkemeleri ve İcra Daireleri yetkilidir.' },
        { title: '13. YÜRÜRLÜK', content: 'Kullanıcı ödeme yaptığı anda sözleşmeyi kabul eder.' },
      ]}
    />
  );
}
