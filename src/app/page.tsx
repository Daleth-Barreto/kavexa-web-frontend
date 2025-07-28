
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
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.1 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.1 }} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
                    </linearGradient>
                  </defs>
                  
                  <rect width="600" height="400" rx="12" fill="hsl(var(--muted))" />
                  
                  <g transform="translate(50 50) scale(0.9)">
                    <rect x="0" y="0" width="500" height="300" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
                    
                    <path d="M 20 20 L 220 20" stroke="hsl(var(--muted-foreground))" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 20 40 L 180 40" stroke="hsl(var(--muted-foreground))" strokeWidth="10" strokeLinecap="round" />

                    <rect x="250" y="20" width="230" height="60" rx="4" fill="url(#grad1)" />
                    
                    <g transform="translate(340 50) scale(1.5)">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" />
                    </g>
                    
                    <g transform="translate(20 80)">
                      <rect x="0" y="0" width="210" height="200" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
                       <path d="M 10 180 L 40 150 L 70 165 L 100 130 L 130 145 L 160 110 L 190 125" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" />
                       <circle cx="160" cy="110" r="4" fill="hsl(var(--primary))" />
                    </g>

                     <g transform="translate(250 100)">
                      <rect x="0" y="0" width="230" height="180" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--border))" />
                        <rect x="20" y="20" width="190" height="20" rx="2" fill="hsl(var(--muted))" />
                        <rect x="20" y="50" width="120" height="20" rx="2" fill="hsl(var(--muted))" />
                        <rect x="20" y="80" width="190" height="20" rx="2" fill="hsl(var(--muted))" />
                        <rect x="20" y="110" width="150" height="20" rx="2" fill="hsl(var(--muted))" />
                         <rect x="20" y="140" width="190" height="20" rx="2" fill="hsl(var(--muted))" />
                    </g>
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
