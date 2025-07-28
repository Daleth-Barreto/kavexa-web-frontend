
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
                    <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'hsl(var(--primary) / 0.1)' }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(var(--accent) / 0.1)' }} />
                    </linearGradient>
                    <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                       <feOffset dx="2" dy="4" result="offsetblur"/>
                       <feComponentTransfer>
                         <feFuncA type="linear" slope="0.2"/>
                       </feComponentTransfer>
                       <feMerge> 
                         <feMergeNode/>
                         <feMergeNode in="SourceGraphic"/> 
                       </feMerge>
                    </filter>
                  </defs>
                  
                  <rect width="600" height="400" fill="url(#hero-gradient)" />
                  
                  <g filter="url(#hero-shadow)">
                    {/* Main dashboard card */}
                    <rect x="50" y="50" width="500" height="300" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                    
                    {/* Header */}
                    <rect x="70" y="70" width="120" height="20" rx="4" fill="hsl(var(--muted))" />
                    <rect x="450" y="75" width="80" height="10" rx="5" fill="hsl(var(--muted))" />

                    {/* Left Panel with Line Chart */}
                    <rect x="70" y="110" width="230" height="220" rx="8" fill="hsl(var(--background))" />
                    <path d="M 85 280 C 120 220, 150 180, 185 200 S 240 250, 280 230" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="85" cy="280" r="4" fill="hsl(var(--primary))" />
                    <circle cx="185" cy="200" r="4" fill="hsl(var(--primary))" />
                    <circle cx="280" cy="230" r="4" fill="hsl(var(--primary))" />

                    {/* Right Panel with Bar Chart */}
                    <rect x="320" y="110" width="210" height="220" rx="8" fill="hsl(var(--background))" />
                    <rect x="340" y="250" width="30" height="60" rx="4" fill="hsl(var(--accent) / 0.8)" />
                    <rect x="380" y="220" width="30" height="90" rx="4" fill="hsl(var(--accent))" />
                    <rect x="420" y="270" width="30" height="40" rx="4" fill="hsl(var(--accent) / 0.7)" />
                    <rect x="460" y="240" width="30" height="70" rx="4" fill="hsl(var(--accent) / 0.9)" />
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
