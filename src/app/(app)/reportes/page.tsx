
'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reports = [
    { title: "Reporte Financiero Mensual", description: "Un resumen de todos los ingresos y gastos del último mes." },
    { title: "Reporte de Inventario Actual", description: "Listado completo de todos los productos y su stock actual." },
    { title: "Reporte de Alertas Activas", description: "Todas las alertas que requieren atención." },
    { title: "Reporte de Ventas por Cliente", description: "Detalla las ventas totales generadas por cada cliente en un período." },
    { title: "Reporte de Clientes por Estado", description: "Clasifica a los clientes según su estado (activo o inactivo)." },
    { title: "Lista de Proveedores", description: "Exporta la información de contacto de todos tus proveedores." },
];

export default function ReportesPage() {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
        title: "Función no disponible",
        description: "La generación de reportes en PDF estará disponible próximamente.",
    });
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Reportes y Exportaciones"
        description="Genera y descarga reportes detallados de tu actividad."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
            <Card key={index} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-md">
                            <FileText className="h-6 w-6 text-muted-foreground"/>
                        </div>
                        <CardTitle>{report.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{report.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled onClick={handleComingSoon}>
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
