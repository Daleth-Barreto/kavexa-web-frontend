
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';
import { AbstractDashboard } from '@/components/kavexa/abstract-dashboard';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
  const { toast } = useToast();
  const GOOGLE_FORM_URL = "https://forms.gle/sYJRQ3rWXpjxjcCZ7";


  const handleComingSoon = () => {
    toast({
        title: "Función no disponible",
        description: "El sistema de cuentas y guardado en la nube estará disponible próximamente.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center shrink-0">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <KavexaLogoIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline">Kavexa</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={handleComingSoon} disabled>
            Iniciar Sesión
          </Button>
          <Button onClick={handleComingSoon} disabled>
            Registrarse
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="space-y-4 max-w-3xl w-full">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Tu Asistente de Negocios Inteligente
            </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
            Inteligencia para tu negocio.
          </h1>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
             Simple, personal y offline.
          </h2>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
            Desde finanzas hasta inventario, Kavexa se adapta a ti. Elige tus módulos y empieza a gestionar tu pyme de forma más inteligente. Todos tus datos se quedan en tu dispositivo, garantizando velocidad y privacidad.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row mt-8">
            <Button size="lg" asChild>
                <Link href="/welcome">
                    Empezar Gratis <ArrowRight className="ml-2"/>
                </Link>
            </Button>
             <Button variant="outline" size="lg" asChild>
                <Link href={GOOGLE_FORM_URL} target="_blank">
                  <MessageSquareQuote className="mr-2 h-4 w-4" />
                  Danos tu opinión
                </Link>
              </Button>
        </div>
        <div className="w-full max-w-4xl mt-12">
            <AbstractDashboard className="rounded-xl border shadow-lg" />
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-16">
        <p className="text-xs text-muted-foreground">&copy; 2025 Kavexa. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos y Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
