'use client';
import LegalPage from '@/components/LegalPage';

export default function UsageTermsPage() {
  return (
    <LegalPage
      title="Kullanım Koşulları"
      sections={[
        { title: 'Genel Hükümler', content: 'İşbu Kullanım Koşulları, MSGLOOM.COM.TR ("Platform") üzerinden sunulan tüm hizmetlerin kullanımına ilişkin şartları düzenlemektedir. Platformu kullanan tüm gerçek ve tüzel kişiler, aşağıda yer alan koşulları kabul etmiş sayılır.' },
        { title: 'Tanımlar', content: 'Platform: MSGLOOM.COM.TR internet sitesi ve bağlı hizmetler\nKullanıcı: Platforma erişen ve/veya hizmetlerden faydalanan kişi\nŞirket: Export Box Bilişim ve Dış Ticaret A.Ş.' },
        { title: 'Hizmetin Kapsamı', content: 'MSGLOOM, kullanıcılarına dijital hizmetler, yazılım çözümleri ve SaaS (Software as a Service) altyapıları sunmaktadır. Sunulan hizmetlerin kapsamı, Şirket tarafından belirlenir ve gerekli görüldüğünde değiştirilebilir.' },
        { title: 'Kullanım Şartları', content: 'Kullanıcı; platformu hukuka uygun şekilde kullanacağını, üçüncü kişilerin haklarını ihlal etmeyeceğini, sisteme zarar verecek herhangi bir girişimde bulunmayacağını ve yanıltıcı veya sahte bilgi paylaşmayacağını kabul eder.' },
        { title: 'Hesap Güvenliği', content: 'Kullanıcı, kendisine ait hesap bilgilerinin gizliliğinden sorumludur. Hesap üzerinden yapılan tüm işlemler kullanıcıya ait kabul edilir. Yetkisiz kullanım durumunda derhal Şirket\'e bildirim yapılmalıdır.' },
        { title: 'Fikri Mülkiyet Hakları', content: 'Platformda yer alan tüm içerikler (yazılım, tasarım, metin, logo vb.) Export Box Bilişim ve Dış Ticaret A.Ş.\'ye aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz.' },
        { title: 'Hizmet Kesintileri', content: 'Şirket; teknik bakım, güncelleme veya altyapı değişiklikleri nedeniyle hizmeti geçici olarak durdurabilir. Bu durumdan doğabilecek kesintilerden dolayı Şirket sorumlu tutulamaz.' },
        { title: 'Sorumluluğun Sınırlandırılması', content: 'MSGLOOM, platformun kullanımından doğabilecek dolaylı veya doğrudan zararlardan sorumlu değildir. Kullanıcı, hizmeti kendi sorumluluğu altında kullandığını kabul eder.' },
        { title: 'Üçüncü Taraf Hizmetler', content: 'Platform üzerinden üçüncü taraf hizmetlere yönlendirme yapılabilir. Bu hizmetlerin içeriği ve güvenliği ilgili üçüncü tarafın sorumluluğundadır.' },
        { title: 'Değişiklikler', content: 'Şirket, işbu Kullanım Koşulları üzerinde dilediği zaman değişiklik yapma hakkını saklı tutar. Güncel metin platform üzerinde yayımlandığı anda yürürlüğe girer.' },
        { title: 'Uygulanacak Hukuk ve Yetki', content: 'Bu sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.' },
        { title: 'Yürürlük', content: 'Kullanıcı, platformu kullanmaya başladığı andan itibaren işbu Kullanım Koşulları\'nı kabul etmiş sayılır.' },
      ]}
    />
  );
}
