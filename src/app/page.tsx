
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Zap className="h-6 w-6 text-primary" />
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
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/welcome">
                      Empezar
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto flex items-center justify-center aspect-[3/2] overflow-hidden rounded-xl sm:w-full lg:order-last">
                 <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 600 400"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-xl object-cover"
                >
                  <defs>
                    <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.8 }} />
                    </linearGradient>
                     <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.4 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.4 }} />
                    </linearGradient>
                     <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                    </filter>
                  </defs>
                  
                  <rect width="600" height="400" rx="12" fill="hsl(var(--background))" />
                  
                  <g filter="url(#blur)" opacity="0.6">
                      <circle cx="200" cy="150" r="150" fill="url(#waveGradient1)" />
                      <circle cx="450" cy="250" r="180" fill="url(#waveGradient2)" />
                      <circle cx="300" cy="300" r="120" fill="hsl(var(--primary))" />
                  </g>
                  
                  <path d="M0 250 Q 150 150, 300 250 T 600 250" stroke="url(#waveGradient1)" fill="none" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
                  <path d="M0 280 Q 150 380, 300 280 T 600 280" stroke="url(#waveGradient2)" fill="none" strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
                   <g transform="translate(280 180) scale(2)">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" opacity="0.9" />
                   </g>
                </svg>
              </div>
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
