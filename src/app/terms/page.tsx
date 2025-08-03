
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';

export default function LegalPage() {
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
                    <CardTitle className="text-3xl">Términos de Servicio y Política de Privacidad</CardTitle>
                    <CardDescription>Última actualización: 28 de Julio de 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-muted-foreground prose dark:prose-invert max-w-none">
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">Términos de Servicio</h2>
                        <p>
                        Bienvenido a Kavexa. Estos términos y condiciones describen las reglas y regulaciones para el uso de la aplicación web Kavexa. Al acceder y utilizar esta aplicación, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes usando Kavexa si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
                        </p>
                        
                        <h3 className="text-xl font-semibold text-foreground mt-4">1. Licencia de Uso</h3>
                        <p>
                        A menos que se indique lo contrario, Kavexa y/o sus licenciantes son dueños de los derechos de propiedad intelectual de todo el material en Kavexa. Todos los derechos de propiedad intelectual están reservados. Se te concede una licencia limitada solo para tu uso personal o comercial interno, sujeto a las restricciones establecidas en estos términos.
                        </p>
                        <p>No debes:</p>
                        <ul>
                            <li>Volver a publicar material de Kavexa sin atribución.</li>
                            <li>Vender, alquilar o sublicenciar material de Kavexa.</li>
                            <li>Reproducir, duplicar o copiar material de Kavexa con fines de redistribución comercial.</li>
                            <li>Intentar realizar ingeniería inversa de cualquier software contenido en la aplicación.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-foreground mt-4">2. Descargo de Responsabilidad</h3>
                        <p>
                        La información y las herramientas proporcionadas por Kavexa son para fines informativos y de gestión. Toda la información en el sitio se proporciona de buena fe, sin embargo, no hacemos ninguna representación o garantía de ningún tipo, expresa o implícita, con respecto a la precisión, adecuación, validez, fiabilidad, disponibilidad o integridad de cualquier información o cálculo. El uso de la aplicación es bajo tu propio riesgo y eres el único responsable de las decisiones financieras y comerciales que tomes basándote en los datos presentados.
                        </p>
                    </section>

                    <div className="border-t border-border my-6"></div>

                    <section>
                        <h2 className="text-2xl font-semibold text-foreground">Política de Privacidad</h2>
                        <p>
                        Tu privacidad es fundamental para nosotros. Esta política describe cómo se manejan tus datos al usar Kavexa.
                        </p>
                        <h3 className="text-xl font-semibold text-foreground mt-4">1. Recopilación y Almacenamiento de Datos</h3>
                        <p>
                        Kavexa opera bajo un modelo **"local-first"**. Esto significa que todos los datos que ingresas (transacciones, inventario, clientes, etc.) se almacenan exclusivamente en el almacenamiento local (`localStorage`) de tu navegador, en tu propio dispositivo. 
                        </p>
                        <p>
                        <strong>No recopilamos, transmitimos, vemos ni almacenamos esta información en nuestros servidores.</strong> No tenemos acceso a tus datos financieros o de negocio.
                        </p>

                        <h3 className="text-xl font-semibold text-foreground mt-4">2. Uso de Datos</h3>
                        <p>
                        Dado que los datos se almacenan localmente, solo tú tienes acceso a ellos. Las funciones de la aplicación, como análisis y proyecciones, se realizan completamente en tu dispositivo (del lado del cliente). No utilizamos tus datos para ningún propósito, incluyendo análisis de terceros, publicidad o venta de información.
                        </p>
                        
                        <h3 className="text-xl font-semibold text-foreground mt-4">3. Seguridad</h3>
                        <p>
                        La seguridad de tus datos depende de la seguridad de tu propio dispositivo y navegador. Te recomendamos usar contraseñas seguras en tus dispositivos y mantener tu software actualizado. Kavexa no se hace responsable de accesos no autorizados a tu dispositivo.
                        </p>
                        <p>
                        La aplicación puede solicitar permiso para enviar notificaciones push. Esta función es opcional y se puede gestionar desde la configuración de la aplicación y de tu navegador.
                        </p>

                        <h3 className="text-xl font-semibold text-foreground mt-4">4. Futuras Funcionalidades de Cuentas</h3>
                        <p>
                        En el futuro, podríamos ofrecer un sistema de cuentas opcional para permitir la sincronización de datos en la nube entre dispositivos. Si implementamos esta función, esta política de privacidad se actualizará para reflejar cómo se recopilan, usan y protegen tus datos en nuestros servidores. Se te notificará de dichos cambios y tendrás la opción de decidir si quieres usar estas nuevas funcionalidades.
                        </p>
                    </section>
                </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
