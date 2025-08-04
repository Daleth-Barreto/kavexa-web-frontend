
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/kavexa/theme-provider';
import { I18nProvider } from '@/contexts/i18n-context';

const APP_NAME = "Kavexa";
const APP_DESCRIPTION = "Asistente inteligente de negocios y finanzas personales, diseñado para ser rápido, privado y funcional offline.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Kavexa - Asistente Financiero y de Inventario",
    template: "%s - Kavexa",
  },
  description: APP_DESCRIPTION,
  keywords: ["erp", "crm", "pyme", "finanzas", "inventario", "asistente virtual", "business management", "local-first"],
  authors: [{ name: "Kavexa Team", url: "https://kavexa.com" }],
  creator: "Kavexa Team",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  openGraph: {
    type: "website",
    url: "https://kavexa.com",
    title: "Kavexa - Inteligencia para tus Finanzas",
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{
      url: "/og-image.png", // Debes crear esta imagen en la carpeta /public
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavexa - Inteligencia para tus Finanzas",
    description: APP_DESCRIPTION,
    images: ["/og-image.png"], // Debes crear esta imagen en la carpeta /public
  },
};

export const viewport: Viewport = {
  themeColor: '#967acc',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23967acc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 12 L12 2 L14.5 10 L20 11 L12 22 L9.5 14 Z' /></svg>`;
  const faviconDataUrl = `data:image/svg+xml,${faviconSvg}`;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconDataUrl} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
