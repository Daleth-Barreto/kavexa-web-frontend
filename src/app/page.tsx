
import Link from 'next/link';
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
              <div className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
                <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 600 400" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="rounded-xl"
                    aria-label="Hero Illustration"
                >
                    <defs>
                        <linearGradient id="hero-gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.05}} />
                            <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.05}} />
                        </linearGradient>
                        <filter id="hero-shadow-soft" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                            <feOffset dx="0" dy="4" result="offsetblur"/>
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.1"/>
                            </feComponentTransfer>
                            <feMerge> 
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/> 
                            </feMerge>
                        </filter>
                    </defs>

                    <rect width="600" height="400" fill="url(#hero-gradient-bg)" />

                    {/* Person silhouette */}
                    <g transform="translate(100 120) scale(1.2)">
                        <circle cx="80" cy="40" r="20" fill="hsl(var(--accent) / 0.5)" />
                        <path d="M 40 140 C 40 100, 120 100, 120 140 L 110 220 L 50 220 Z" fill="hsl(var(--accent) / 0.5)" />
                    </g>

                    {/* Dashboard floating card */}
                    <g transform="translate(250 80)" filter="url(#hero-shadow-soft)">
                        <rect x="0" y="0" width="300" height="240" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                        
                        {/* Header */}
                        <rect x="20" y="20" width="100" height="15" rx="4" fill="hsl(var(--muted))" />
                        <circle cx="270" cy="28" r="8" fill="hsl(var(--muted))"/>
                        
                        {/* Small summary cards */}
                        <rect x="20" y="50" width="80" height="50" rx="6" fill="hsl(var(--background))"/>
                        <rect x="25" y="60" width="40" height="8" rx="2" fill="hsl(var(--muted))"/>
                        <rect x="25" y="75" width="50" height="12" rx="3" fill="hsl(var(--primary) / 0.8)"/>

                        <rect x="110" y="50" width="80" height="50" rx="6" fill="hsl(var(--background))"/>
                        <rect x="115" y="60" width="40" height="8" rx="2" fill="hsl(var(--muted))"/>
                        <rect x="115" y="75" width="50" height="12" rx="3" fill="hsl(var(--accent) / 0.8)"/>

                        <rect x="200" y="50" width="80" height="50" rx="6" fill="hsl(var(--background))"/>
                        <rect x="205" y="60" width="40" height="8" rx="2" fill="hsl(var(--muted))"/>
                        <rect x="205" y="75" width="50" height="12" rx="3" fill="hsl(var(--muted))"/>

                        {/* Bar chart */}
                        <g transform="translate(20, 120)">
                            <rect x="0" y="80" width="260" height="1" fill="hsl(var(--border))" />
                            <rect x="10" y="40" width="25" height="40" rx="3" fill="hsl(var(--accent) / 0.4)" />
                            <rect x="45" y="20" width="25" height="60" rx="3" fill="hsl(var(--accent) / 0.6)" />
                            <rect x="80" y="50" width="25" height="30" rx="3" fill="hsl(var(--accent) / 0.5)" />
                            <rect x="115" y="10" width="25" height="70" rx="3" fill="hsl(var(--accent))" />
                        </g>

                        {/* Pie chart */}
                        <g transform="translate(220, 160)">
                            <circle cx="0" cy="0" r="30" fill="hsl(var(--background))"/>
                            <path d="M 0 0 L 30 0 A 30 30 0 0 1 15 25.98 Z" fill="hsl(var(--primary))"/>
                            <path d="M 0 0 L 15 25.98 A 30 30 0 0 1 -25.98 15 Z" fill="hsl(var(--primary) / 0.7)"/>
                             <path d="M 0 0 L -25.98 15 A 30 30 0 0 1 -25.98 -15 Z" fill="hsl(var(--primary) / 0.4)"/>
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
