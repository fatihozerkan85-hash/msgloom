'use client';
import LegalPage from '@/components/LegalPage';

export default function SecurityPage() {
  return (
    <LegalPage
      title="Bilgi Güvenliği Politikası"
      sections={[
        {
          title: 'Genel',
          content: `Msgloom (Export Box Bilişim ve Dış Ticaret A.Ş.) olarak, tüm ilgili taraflarımıza üst düzeyde gizlilik ve güvenlik sağlamak amacıyla üzerimize düşen tüm tedbirleri almaktayız. Yasalar gerektirmediği sürece, veri ve bilgileriniz kesinlikle herhangi bir üçüncü taraf erişimine açılmayacaktır.`
        },
        {
          title: 'Taahhütlerimiz',
          content: `Msgloom (Export Box Bilişim ve Dış Ticaret A.Ş.) olarak, Bilgi Güvenliğimize ve Bilgi Varlıklarımıza yönelik her türlü riski yönetmek amacıyla;

• Kurumsal bilgileri ve tüm ilgili tarafların bilgilerini değerli ve kritik kabul ederek bilgi güvenliği ile ilgili yasaların gerektirdiği zorunlulukları yerine getirmeyi
• Kurumsal faaliyetlerimizin gerçekleşmesinde kullanılan bilişim hizmetlerinin kesintisiz devam etmesi, kişisel ve özel verilere erişimin yalnızca yetkili kişilerce sağlanması amacıyla gerekli altyapıyı sağlamayı ve gerekli güvenlik tedbirlerini almayı
• Bilgi güvenliği yönetim sistemimizin ISO/IEC 27001 standardının gereklerini yerine getirecek şekilde dokümante etmeyi ve sürekli iyileştirmeyi
• Bilgi güvenliği ile ilgili tüm yasal mevzuat ve sözleşmelere uymayı
• Bilgi varlıklarına yönelik riskleri sistematik olarak yönetmeyi
• Bilgi güvenliği farkındalığını artırmak amacıyla teknik ve davranışsal yetkinlikleri geliştirecek faaliyetler gerçekleştirmeyi

taahhüt etmekte, sektörümüzde bilgi güvenliği açısından örnek bir kuruluş olmak için tüm gücümüzle çalışmaktayız.`
        },
        {
          title: 'Politika Değişiklikleri',
          content: `Bu gizlilik politikasını herhangi bir zamanda değiştirme hakkı Msgloom (Export Box Bilişim ve Dış Ticaret A.Ş.)'nde saklıdır, değişiklikler ve açıklamalar, web sitesinde yayınlandıktan hemen sonra yürürlüğe girecektir. Bu politikada önemli değişiklikler yapıldığı takdirde, ilgili politikanın güncellendiğini kamuoyuna açık platformlar ile sizlere bildireceğiz.`
        },
      ]}
    />
  );
}