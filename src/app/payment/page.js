'use client';
import LegalPage from '@/components/LegalPage';

export default function PaymentPage() {
  return (
    <LegalPage
      title="İptal ve İade Koşulları"
      sections={[
        { title: '1. GENEL HÜKÜMLER', content: 'İşbu İptal ve İade Koşulları, MSGLOOM.COM.TR üzerinden sunulan SaaS (Software as a Service) hizmetlerine ilişkin iptal, iade ve geri ödeme süreçlerini düzenler.' },
        { title: '2. HİZMETİN NİTELİĞİ', content: 'Sunulan hizmetler dijital içerik ve anında erişim sağlanan yazılım hizmetleridir. Bu nedenle fiziksel ürün teslimi söz konusu değildir.' },
        { title: '3. CAYMA HAKKI', content: '6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, dijital içerik hizmetlerinde ifaya başlanması ile birlikte cayma hakkı ortadan kalkar.\nKullanıcı, hizmeti satın alarak bu durumu kabul eder.' },
        { title: '4. ABONELİK İPTALİ', content: 'Kullanıcı, aboneliğini istediği zaman iptal edebilir.\nİptal işlemi, mevcut fatura döneminin sonunda yürürlüğe girer.\nİptal sonrası, kullanıcıya ilgili dönem için yeniden ücretlendirme yapılmaz.' },
        { title: '5. İADE KOŞULLARI', content: 'Aşağıdaki durumlar dışında iade yapılmaz:\n\n• Teknik hata nedeniyle hizmetin hiç sağlanamaması\n• Kullanıcının ödeme yaptığı halde hizmete erişememesi\n• Sistemsel hatalar sonucu mükerrer ödeme alınması\n\nBu durumlarda kullanıcı, destek ekibi ile iletişime geçerek iade talebinde bulunabilir.' },
        { title: '6. İADE SÜRECİ', content: 'Onaylanan iadeler:\n\n• Ödemenin yapıldığı yöntem ile\n• iyzico ödeme altyapısı üzerinden\n• 7-14 iş günü içerisinde gerçekleştirilir' },
        { title: '7. OTOMATİK YENİLEME VE İADE', content: 'Abonelikler otomatik olarak yenilenir.\nYenileme sonrası yapılan ödemeler için, ilgili dönem başlamış ise iade yapılmaz.' },
        { title: '8. SORUMLULUK REDDİ', content: 'Kullanıcının hizmeti kullanamaması, internet bağlantısı veya üçüncü taraf kaynaklı sorunlardan doğan iade talepleri kabul edilmez.' },
        { title: '9. İLETİŞİM', content: 'İptal ve iade talepleriniz için:\ninfo@msgloom.com.tr adresi üzerinden bizimle iletişime geçebilirsiniz.' },
        { title: '10. YÜRÜRLÜK', content: 'Kullanıcı, platform üzerinden hizmet satın alarak işbu koşulları kabul etmiş sayılır.' },
      ]}
    />
  );
}
