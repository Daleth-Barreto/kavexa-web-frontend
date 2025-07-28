
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Image from 'next/image';

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
                  <Button asChild size="lg" className="w-full sm:w-auto">
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
                    <linearGradient id="glow" x1="50%" y1="50%" x2="50%" y2="100%">
                      <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.1}} />
                      <stop offset="100%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0}} />
                    </linearGradient>
                  </defs>
                  
                  <rect width="600" height="400" rx="12" fill="hsl(var(--background))" />

                  {/* Base Shapes */}
                  <g opacity="0.8">
                    {/* Abstract bar chart */}
                    <rect x="100" y="150" width="40" height="150" rx="8" fill="hsl(var(--primary))" />
                    <rect x="160" y="100" width="40" height="200" rx="8" fill="hsl(var(--primary))" />
                    <rect x="220" y="180" width="40" height="120" rx="8" fill="hsl(var(--primary))" />

                    {/* Abstract pie chart / circle */}
                    <circle cx="420" cy="200" r="100" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="12"/>
                    <path d="M 420 200 L 420 100 A 100 100 0 0 1 506.6 150 Z" fill="hsl(var(--accent))" />

                    {/* Decorative elements */}
                    <circle cx="150" cy="80" r="15" fill="hsl(var(--accent))"/>
                    <rect x="350" y="80" width="120" height="20" rx="5" fill="hsl(var(--muted))" />
                    <rect x="350" y="110" width="80" height="20" rx="5" fill="hsl(var(--muted))" />
                  </g>

                  {/* Glow effect at the bottom */}
                  <rect x="0" y="200" width="600" height="200" fill="url(#glow)" />
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
