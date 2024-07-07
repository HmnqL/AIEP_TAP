import './ui/global.css';
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | TAP by HmnqL',
    default : 'TAP AIEP & CO Dashboard'
  },
  description: 'Proyecto de Titulo para AIEP Maipu',
  metadataBase: new URL('www.codeone.cl'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
