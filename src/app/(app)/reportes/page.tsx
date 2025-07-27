'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const reports = [
    { title: "Reporte Financiero Mensual", description: "Un resumen de todos los ingresos y gastos del último mes." },
    { title: "Reporte de Inventario Actual", description: "Listado completo de todos los productos y su stock actual." },
    { title: "Reporte de Alertas Activas", description: "Todas las alertas que requieren atención." },
];

export default function ReportesPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
       <PageWrapper>
        <PageHeader
          title="Reportes y Exportaciones"
          description="Genera y descarga reportes detallados de tu actividad."
        />
        <Card className="text-center py-16">
          <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4 w-fit">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Función Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">La generación de reportes solo está disponible para usuarios registrados.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">
                Iniciar Sesión o Registrarse
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Reportes y Exportaciones"
        description="Genera y descarga reportes detallados de tu actividad."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
            <Card key={index}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-md">
                            <FileText className="h-6 w-6 text-muted-foreground"/>
                        </div>
                        <CardTitle>{report.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>{report.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <Download className="mr-2 h-4 w-4"/>
                        Descargar PDF
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
