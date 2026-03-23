import './globals.css';

export const metadata = {
  title: 'MsgLoom - Admin Panel',
  description: 'WhatsApp & Telegram Mesajlaşma Yönetimi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
