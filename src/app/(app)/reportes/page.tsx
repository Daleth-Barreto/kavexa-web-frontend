
'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useAppContext, useCurrency } from "@/contexts/app-context";
import { generatePdf } from "@/lib/pdf-generator";
import { useI18n } from "@/contexts/i18n-context";

const reportTypes = {
  FINANCIAL: 'financial',
  INVENTORY: 'inventory',
  ALERTS: 'alerts',
  SALES_BY_CLIENT: 'sales_by_client',
  CLIENTS_BY_STATUS: 'clients_by_status',
  PROVIDERS: 'providers'
};

export default function ReportesPage() {
  const { transactions, inventory, alerts, clients, providers } = useAppContext();
  const { formatCurrency } = useCurrency();
  const { t } = useI18n();

  const handleGenerateReport = (reportType: string) => {
    switch (reportType) {
      case reportTypes.FINANCIAL:
        generatePdf({
          title: "Reporte Financiero Mensual",
          filename: "reporte_financiero_kavexa.pdf",
          headers: [["Fecha", "Descripción", "Categoría", "Tipo", "Monto"]],
          body: transactions.map(t => [
            new Date(t.date).toLocaleDateString('es-ES'),
            t.description,
            t.category,
            t.type === 'income' ? 'Ingreso' : 'Egreso',
            formatCurrency(t.amount)
          ]),
        });
        break;
      
      case reportTypes.INVENTORY:
        generatePdf({
          title: "Reporte de Inventario",
          filename: "reporte_inventario_kavexa.pdf",
          headers: [["Producto", "Stock Actual", "Precio de Venta"]],
          body: inventory.map(i => [
            i.name,
            i.stock.toString(),
            formatCurrency(i.price)
          ]),
        });
        break;
        
      case reportTypes.ALERTS:
        generatePdf({
          title: "Reporte de Alertas Activas",
          filename: "reporte_alertas_kavexa.pdf",
          headers: [["Fecha", "Mensaje", "Tipo", "Estado"]],
          body: alerts.filter(a => a.status === 'new').map(a => [
            new Date(a.date).toLocaleDateString('es-ES'),
            a.message,
            a.type,
            a.status
          ]),
        });
        break;

      case reportTypes.SALES_BY_CLIENT:
        const salesByClient = clients.map(client => {
            const clientSales = transactions.filter(t => t.clientId === client.id && t.type === 'income');
            const totalSold = clientSales.reduce((acc, t) => acc + t.amount, 0);
            return [client.name, clientSales.length.toString(), formatCurrency(totalSold)];
        });
        generatePdf({
          title: "Reporte de Ventas por Cliente",
          filename: "reporte_ventas_cliente_kavexa.pdf",
          headers: [["Cliente", "Número de Compras", "Total Vendido"]],
          body: salesByClient,
        });
        break;

      case reportTypes.CLIENTS_BY_STATUS:
        generatePdf({
          title: "Reporte de Clientes por Estado",
          filename: "reporte_clientes_estado_kavexa.pdf",
          headers: [["Nombre", "Email", "Teléfono", "Estado"]],
          body: clients.map(c => [
              c.name,
              c.email,
              c.phone,
              c.status === 'active' ? 'Activo' : 'Inactivo'
          ]),
        });
        break;

      case reportTypes.PROVIDERS:
        generatePdf({
          title: "Lista de Proveedores",
          filename: "lista_proveedores_kavexa.pdf",
          headers: [["Nombre", "Contacto", "Teléfono"]],
          body: providers.map(p => [
              p.name,
              p.contact,
              p.phone
          ]),
        });
        break;

      default:
        break;
    }
  };

  const reports = [
    { type: reportTypes.FINANCIAL, title: "Reporte Financiero Mensual", description: "Un resumen de todos los ingresos y gastos del último mes." },
    { type: reportTypes.INVENTORY, title: "Reporte de Inventario Actual", description: "Listado completo de todos los productos y su stock actual." },
    { type: reportTypes.ALERTS, title: "Reporte de Alertas Activas", description: "Todas las alertas que requieren atención." },
    { type: reportTypes.SALES_BY_CLIENT, title: "Reporte de Ventas por Cliente", description: "Detalla las ventas totales generadas por cada cliente en un período." },
    { type: reportTypes.CLIENTS_BY_STATUS, title: "Reporte de Clientes por Estado", description: "Clasifica a los clientes según su estado (activo o inactivo)." },
    { type: reportTypes.PROVIDERS, title: "Lista de Proveedores", description: "Exporta la información de contacto de todos tus proveedores." },
  ];

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
                    <Button className="w-full" onClick={() => handleGenerateReport(report.type)}>
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
