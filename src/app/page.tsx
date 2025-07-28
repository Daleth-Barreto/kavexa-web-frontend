
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquareQuote } from 'lucide-react';
import { InstallPwaButton } from '@/components/kavexa/install-pwa-button';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';
import { AbstractDashboard } from '@/components/kavexa/abstract-dashboard';

export default function LandingPage() {
  const GOOGLE_FORM_URL = "https://forms.gle/sYJRQ3rWXpjxjcCZ7"; 

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <KavexaLogoIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">Kavexa</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/welcome">Registrarse</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    La herramienta que se adapta a tu negocio
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Finanzas, inventario, clientes y más. Elige los módulos que necesitas y gestiona tu pyme de forma inteligente y personalizada.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row flex-wrap">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/welcome">
                      Empezar
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href={GOOGLE_FORM_URL} target="_blank">
                       <MessageSquareQuote className="mr-2 h-4 w-4" />
                       Danos tu opinión
                    </Link>
                  </Button>
                  <div className="w-full sm:w-auto">
                    <InstallPwaButton />
                  </div>
                </div>
              </div>
              <AbstractDashboard className="mx-auto aspect-[4/3] w-full overflow-hidden rounded-xl lg:order-last" />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Kavexa. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
