import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';

export default function TermsPage() {
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
                    <CardTitle className="text-3xl">Términos de Servicio</CardTitle>
                    <CardDescription>Última actualización: 27 de Julio de 2024</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground prose dark:prose-invert max-w-none">
                    <p>
                    Bienvenido a Kavexa. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Kavexa, ubicado en [URL de tu aplicación].
                    </p>
                    <p>
                    Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Kavexa si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">Licencia</h3>
                    <p>
                    A menos que se indique lo contrario, Kavexa y/o sus licenciantes son dueños de los derechos de propiedad intelectual de todo el material en Kavexa. Todos los derechos de propiedad intelectual están reservados. Puedes acceder a esto desde Kavexa para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
                    </p>
                     <h3 className="text-xl font-semibold text-foreground">No debes:</h3>
                    <ul>
                        <li>Volver a publicar material de Kavexa</li>
                        <li>Vender, alquilar o sublicenciar material de Kavexa</li>
                        <li>Reproducir, duplicar o copiar material de Kavexa</li>
                        <li>Redistribuir contenido de Kavexa</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-foreground">Descargo de Responsabilidad</h3>
                    <p>
                    La información proporcionada por Kavexa es solo para fines informativos generales. Toda la información en el sitio se proporciona de buena fe, sin embargo, no hacemos ninguna representación o garantía de ningún tipo, expresa o implícita, con respecto a la precisión, adecuación, validez, fiabilidad, disponibilidad o integridad de cualquier información en el sitio.
                    </p>
                </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
