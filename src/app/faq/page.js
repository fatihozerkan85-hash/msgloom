'use client';
import LegalPage from '@/components/LegalPage';

export default function FaqPage() {
  return (
    <LegalPage
      title="Sıkça Sorulan Sorular (SSS)"
      sections={[
        { title: 'MSGLOOM nedir?', content: 'MSGLOOM, işletmelerin müşteri iletişimini yönetmesini sağlayan, WhatsApp ve çok kanallı iletişim altyapıları sunan bulut tabanlı (SaaS) bir platformdur.' },
        { title: 'MSGLOOM hangi hizmetleri sunar?', content: 'WhatsApp mesajlaşma çözümleri, yapay zeka destekli chatbot sistemleri, müşteri destek ve satış otomasyonu ile CRM ve e-ticaret entegrasyonları sunar.' },
        { title: 'MSGLOOM\'u kullanmak için teknik bilgi gerekir mi?', content: 'Hayır. Kullanıcı dostu arayüzü sayesinde teknik bilgi gerektirmez.' },
        { title: 'WhatsApp ile nasıl entegre olur?', content: 'Resmi WhatsApp Business API üzerinden entegre edilir ve kurulum sürecinde destek sağlanır.' },
        { title: 'Verilerim güvende mi?', content: 'Evet. KVKK\'ya uygun şekilde yüksek güvenlik standartları ile korunur.' },
        { title: 'Ücretlendirme nasıl yapılır?', content: 'Abonelik modeli ile aylık veya yıllık planlar üzerinden yapılır.' },
        { title: 'Ödeme yöntemleri nelerdir?', content: 'iyzico altyapısı üzerinden kredi kartı ve desteklenen diğer yöntemlerle ödeme yapılır.' },
        { title: 'Aboneliğimi iptal edebilir miyim?', content: 'Evet. İptal işlemi mevcut fatura dönemi sonunda geçerli olur.' },
        { title: 'İade yapılıyor mu?', content: 'Dijital hizmet olması nedeniyle hizmet başladıktan sonra iade yapılmamaktadır.' },
        { title: 'Destek alabilir miyim?', content: 'Evet. Teknik destek ve müşteri hizmetleri sunulmaktadır.' },
        { title: 'Hangi sektörler kullanabilir?', content: 'E-ticaret, hizmet sektörü, ajanslar ve kurumsal firmalar başta olmak üzere tüm işletmeler kullanabilir.' },
        { title: 'Deneme sürümü var mı?', content: 'Planlara bağlı olarak demo veya deneme süreci sunulabilir.' },
        { title: 'Entegrasyon desteği var mı?', content: 'Evet. CRM, e-ticaret ve üçüncü parti sistemlerle entegrasyon sağlanır.' },
        { title: 'Birden fazla kullanıcı ekleyebilir miyim?', content: 'Evet. Planlara bağlı olarak çoklu kullanıcı ve yetkilendirme yapılabilir.' },
        { title: 'MSGLOOM neden tercih edilmeli?', content: 'Güçlü altyapısı, kolay kullanımı ve yapay zeka destekli çözümleri ile iletişim ve satış süreçlerini optimize eder.' },
      ]}
    />
  );
}
