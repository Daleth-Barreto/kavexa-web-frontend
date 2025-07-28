import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
             <Button variant="outline" size="sm" asChild>
                 <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Volver
                </Link>
            </Button>
            <div className="ml-auto flex items-center gap-2">
                <KavexaLogoIcon className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">Kavexa</span>
            </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl">
                <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Política de Privacidad</CardTitle>
                    <CardDescription>Última actualización: 27 de Julio de 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert max-w-none">
                     <p>
                        Tu privacidad es importante para nosotros. La política de Kavexa es respetar tu privacidad con respecto a cualquier información que podamos recopilar mientras operamos nuestro sitio web.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">Datos que Recopilamos</h3>
                    <p>
                        Actualmente, Kavexa opera en un modo de "invitado". Todos los datos que ingresas, como transacciones financieras e información de inventario, se almacenan exclusivamente en el almacenamiento local de tu navegador. No recopilamos, transmitimos ni almacenamos esta información en nuestros servidores.
                    </p>
                     <h3 className="text-xl font-semibold text-foreground">Uso de Datos</h3>
                    <p>
                        Dado que los datos se almacenan localmente en tu dispositivo, solo tú tienes acceso a ellos. No los utilizamos para ningún propósito, incluyendo análisis, publicidad o venta a terceros. La funcionalidad de la aplicación, como proyecciones y análisis, se realiza completamente en tu dispositivo.
                    </p>
                     <h3 className="text-xl font-semibold text-foreground">Seguridad</h3>
                    <p>
                        La seguridad de tus datos depende de la seguridad de tu propio dispositivo y navegador. Te recomendamos que utilices las funciones de seguridad de tu dispositivo para proteger tus datos.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">Futuras Funcionalidades de Cuentas</h3>
                    <p>
                        En el futuro, podremos ofrecer un sistema de cuentas para permitir la sincronización de datos en la nube. Si implementamos esta función, esta política de privacidad se actualizará para reflejar cómo se recopilan, usan y protegen tus datos. Se te notificará de dichos cambios.
                    </p>
                </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
