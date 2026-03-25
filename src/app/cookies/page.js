'use client';
import LegalPage from '@/components/LegalPage';

export default function CookiesPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      sections={[
        {
          title: 'Genel Bilgilendirme',
          content: `Export Box Bilişim ve Dış Ticaret A.Ş. olarak sahip olduğumuz https://www.msgloom.com.tr/ alan adlı web sitemizin ("Web Sitesi") ziyaretçilerinin gizlilik ve kişisel verilerinin korunması haklarını gözeterek ziyaretçilerimize daha iyi bir kullanım deneyimi sağlayabilmek için kişisel verilerini işlemekte ve piksel etiketleri ("pikseller"), yerel saklama teknolojileri ve internet çerezleri ("çerezler") kullanmaktayız. Web Sitesi'nde hangi Çerezlerin kullanıldığını ve kullanıcıların bu konudaki tercihlerini nasıl yönetebileceğini açıklamak amacıyla hazırlamıştır. Şirketimiz tarafından kişisel verilerinizin işlenmesine ilişkin daha detaylı bilgi için Kişisel Verilerin İşlenmesi Politikasını incelemenizi tavsiye ederiz.`
        },
        {
          title: 'Hangi Tür Çerezler Kullanılmaktadır',
          content: `Web Sitesi'nde farklı türlerde çerezler kullanmaktayız. Bunlar Web Sitesi'nin çalışmasını sağlamak için kullanılması zorunlu olan çerezler, işlev çerezleri, performans-analitik çerezler, reklam/pazarlama çerezleri, kalıcı çerezler ve oturum çerezleridir.`
        },
        {
          title: '1. Kullanım Bakımından Çerez Türleri',
          content: `Kullanılması Zorunlu Olan Çerezler: Bu çerezler, Web Sitesi'nin düzgün şekilde çalışması için mutlaka gerekli olan çerezlerdir. Ayrıca bunlara bağlı servislerden ve hizmetlerden yararlanmanızı sağlamaktadır. Bu çerezlere, sistemin yönetilebilmesi, sahte işlemlerin önlenmesi için ihtiyaç vardır ve engellenmesi halinde Web Sitesi çalışamayacaktır.

İşlev Çerezleri: Bu çerezler size daha gelişmiş ve kolay bir kullanım deneyimi yaşatmak için kullanılan çerezlerdir. Örneğin önceki tercihlerinizi hatırlamak, Web Sitesi üzerinde yer alan bazı içeriklere rahatça erişmenizi sağlamak işlevlerini yerine getirmektedir.

Performans-Analitik Çerezler: İnternet sitelerinde kullanıcıların davranışlarını analiz etmek amacıyla istatistiki ölçümüne imkân veren çerezlerdir. Bu çerezler, sitenin iyileştirilmesi için sıklıkla kullanılmakta olup bu duruma reklamların ilgili kişiler üzerindeki etkisinin ölçümü de dâhildir.

Reklam/Pazarlama Çerezleri: Reklam ve pazarlama amaçlı çerezler ile internet ortamında kullanıcıların çevrimiçi hareketleri takip edilerek kişisel ilgi alanlarının saptanıp bu ilgi alanlarına yönelik internet ortamında kullanıcılara reklam gösterilmesini hedeflemektedirler.`
        },
        {
          title: '2. Saklandığı Süre Bakımından Çerez Türleri',
          content: `Kalıcı Çerezler (Persistent Cookies): Kişinin bilgisayarında belirli bir tarihe veya kullanıcı tarafından silinene kadar varlığını sürdüren çerezlerdir. Bu çerezler, çoğunlukla kullanıcıların site hareketlerini ve tercihlerini ölçmek amacıyla kullanılır.

Oturum Çerezleri (Session Cookies): Bu çerezler kullanıcının ziyaretini oturumlara ayırmak için kullanılır ve kullanıcıdan veri toplamaz. Çerez, kullanıcı ziyaret ettiği web sayfasını kapattığında veya belli bir süre pasif kaldığında silinir.`
        },
        {
          title: 'Çerez Tercihlerinizi Nasıl Yönetebilirsiniz',
          content: `Kullanıcılar, kullanmakta oldukları tarayıcı ayarlarını değiştirerek veya sunulan çerez butonu kapsamında seçebileceği veya reddebileceği çerezler üzerinden çerezleri yönetebilecektir.`
        },
        {
          title: 'Hangi Haklara Sahipsiniz',
          content: `6698 Sayılı Kişisel Verilerin Korunması Kanunu'nun ("Kanun") 11. maddesi uyarınca ziyaretçiler, Export Box Bilişim ve Dış Ticaret A.Ş.'ye başvurarak kendileriyle ilgili web sitesinde bulunan Kişisel Verilerin Korunmasına İlişkin Aydınlatma Metninde belirtilen yollar ile taleplerini iletebilirler.`
        },
        {
          title: 'Kullanılan Çerezler',
          content: `• local_storage_support_test — Tarayıcının yerel depolama özelliğini destekleyip desteklemediğini kontrol eder. Oturum süresince tutulur. Zorunlu çerez.

• _cfuvid — Cloudflare'ın ziyaretçileri tanımlamasına yardımcı olur ve performansı izlemek, potansiyel saldırılara karşı koruma sağlamak için kullanılır. 1 yıl süreyle saklanır. Zorunlu çerez.

• previousPage — Kullanıcının önceki ziyaret ettiği sayfayı saklar. Oturum süresince tutulur. Zorunlu çerez.

• cart_session_id — Alışveriş sepetindeki ürünleri ve sepetin durumunu takip etmek için kullanılır. Oturum süresince tutulur. Zorunlu çerez.

• anticsrf — CSRF saldırılarının önlenmesi amacıyla kullanılmaktadır. Oturum süresince tutulur. Zorunlu çerez.

• uids — Benzersiz kullanıcı kimliğini saklamak için kullanılır. 1 yıl süreyle geçerlidir. Zorunlu çerez.

• _conv_v — Ziyaretçiye odaklı çerez, son güncelleme zamanından itibaren maksimum 6 ay süreyle geçerlidir. Zorunlu çerez.

• _conv_s — Oturum merkezli çerez, son güncelleme zamanından itibaren 20 dakika süreyle geçerlidir. Zorunlu çerez.

• VISITOR_PRIVACY_METADATA — Kullanıcıların gizlilik tercihlerini ve ayarlarını saklar. Zorunlu çerez.

• init — Kullanıcı oturum başlatma çerezi. Oturum süresince saklanır. Zorunlu çerez.

• cee — Kullanıcı oturum yönetimi veya izleme çerezi. Oturum süresince saklanır. Zorunlu çerez.

• YSC — YouTube'da izlenen videoların istatistiklerini tutmak için benzersiz kimlik kaydeder. Oturum süresince saklanır. İşlevsel çerez.

• __cf_bm — Cloudflare bot koruması, kötü amaçlı botlardan korunmak için otomatik trafiği tespit eder. Oturum süresince saklanır. İşlevsel çerez.

• PHPSESSID — Kullanıcı oturum değişkenlerini korumak için kullanılır. Oturum süresince saklanır. İşlevsel çerez.

• _ga — Kullanıcıları tanımlamak için kullanılır. 2 yıl süre ile tutulur. Reklam/pazarlama çerezi.

• VISITOR_INFO1_LIVE — YouTube videoları entegre edilmiş sayfalarda bant genişliğini tahmin eder. 179 gün süreyle saklanır. Reklam/pazarlama çerezi.

• _gcl_au — Google AdSense tarafından reklam verimliliğini test etmek için kullanılır. 3 ay süre ile tutulur. Reklam/pazarlama çerezi.

• _fbp — Facebook tarafından çeşitli reklam ürünlerini sunmak için kullanılır. 4 ay süre ile tutulur. Reklam/pazarlama çerezi.`
        },
      ]}
    />
  );
}