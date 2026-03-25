import { getUser } from '@/lib/auth';
import Iyzipay from 'iyzipay';

let _iyzipay;
function getIyzipay() {
  if (!_iyzipay) {
    _iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
    });
  }
  return _iyzipay;
}

const PLANS = {
  starter: { name: 'Başlangıç', price: '999.00', id: 'starter' },
  pro: { name: 'Profesyonel', price: '2499.00', id: 'pro' },
};

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Giriş yapmanız gerekiyor', requireLogin: true }, { status: 401 });

  try {
    const { planId } = await request.json();
    const plan = PLANS[planId];
    if (!plan) return Response.json({ error: 'Geçersiz plan' }, { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://msgloom.com.tr';

    const checkoutRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `${user.id}-${planId}-${Date.now()}`,
      price: plan.price,
      paidPrice: plan.price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `plan-${planId}-${user.id}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${baseUrl}/api/payment/callback`,
      enabledInstallments: [1],
      buyer: {
        id: String(user.id),
        name: user.name?.split(' ')[0] || 'Kullanıcı',
        surname: user.name?.split(' ').slice(1).join(' ') || '-',
        email: user.email,
        identityNumber: '11111111111',
        registrationAddress: 'İstanbul, Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: user.name || 'Kullanıcı',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'İstanbul, Türkiye',
      },
      billingAddress: {
        contactName: user.name || 'Kullanıcı',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'İstanbul, Türkiye',
      },
      basketItems: [
        {
          id: planId,
          name: `MsgLoom ${plan.name} Plan`,
          category1: 'SaaS',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: plan.price,
        }
      ]
    };

    return new Promise((resolve) => {
      getIyzipay().checkoutFormInitialize.create(checkoutRequest, (err, result) => {
        if (err || result.status !== 'success') {
          console.error('iyzico error:', err || result);
          resolve(Response.json({ error: result?.errorMessage || 'Ödeme başlatılamadı' }, { status: 500 }));
        } else {
          resolve(Response.json({
            success: true,
            checkoutFormContent: result.checkoutFormContent,
            token: result.token,
          }));
        }
      });
    });
  } catch (error) {
    console.error('Payment checkout error:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
