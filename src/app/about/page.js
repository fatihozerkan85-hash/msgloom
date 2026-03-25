'use client';
import LegalPage from '@/components/LegalPage';

export default function AboutPage() {
  return (
    <LegalPage
      title="Hakkımızda"
      sections={[
        { title: 'Genel Tanıtım', content: 'MSGLOOM, işletmelerin dijital dönüşüm süreçlerini hızlandırmak ve müşteri iletişimini daha akıllı, hızlı ve verimli hale getirmek amacıyla geliştirilmiş yenilikçi bir SaaS (Software as a Service) platformudur. Teknoloji ve ticaretin kesişim noktasında konumlanan MSGLOOM, özellikle WhatsApp tabanlı iletişim çözümleri, otomasyon sistemleri ve yapay zeka destekli müşteri yönetimi alanlarında işletmelere güçlü altyapılar sunmaktadır.' },
        { title: 'Misyonumuz', content: 'İşletmelerin müşteri iletişim süreçlerini dijitalleştirerek daha hızlı, verimli ve sürdürülebilir hale getirmek; teknolojiyi herkes için erişilebilir kılmak.' },
        { title: 'Vizyonumuz', content: 'Global ölçekte rekabet eden, yenilikçi ve ölçeklenebilir çözümler üreterek SaaS alanında öncü markalardan biri olmak.' },
        { title: 'Neler Yapıyoruz?', content: 'WhatsApp ve çok kanallı iletişim çözümleri, yapay zeka destekli chatbot sistemleri, satış ve müşteri yönetimi otomasyonları ve e-ticaret ile CRM entegrasyonları sunarak işletmelerin dijital süreçlerini uçtan uca yönetmelerini sağlıyoruz.' },
        { title: 'Güvenlik ve Altyapı', content: 'Platformumuz, modern bulut teknolojileri üzerine inşa edilmiş olup veri güvenliği ve gizlilik en üst seviyede korunmaktadır. MSGLOOM, KVKK başta olmak üzere ilgili tüm veri koruma mevzuatlarına uyumlu şekilde hizmet sunar.' },
        { title: 'Değerlerimiz', content: 'Güvenilirlik, şeffaflık, sürekli gelişim, müşteri odaklılık ve yenilikçilik.' },
        { title: 'Neden MSGLOOM?', content: 'MSGLOOM, yalnızca bir yazılım değil; işletmelerin büyümesini destekleyen bir dijital iş ortağıdır. Esnek yapısı, güçlü entegrasyon kabiliyeti ve kullanıcı dostu arayüzü sayesinde her ölçekte işletmeye değer katmayı hedefler.' },
        { title: 'İletişim', content: 'www.msgloom.com.tr\ninfo@msgloom.com.tr' },
      ]}
    />
  );
}
