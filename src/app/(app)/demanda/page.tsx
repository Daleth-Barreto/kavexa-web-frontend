'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/contexts/app-context";

export default function DemandaPage() {
  const { inventory } = useAppContext();
  const deadProducts = inventory.filter(item => item.stock > 50); // Mock logic
  
  return (
    <PageWrapper>
      <PageHeader
        title="Demanda y Productos Muertos"
        description="Analiza la rotación de tus productos e identifica aquellos con poco movimiento."
      />
       <Card>
        <CardHeader>
          <CardTitle>Productos de Baja Rotación</CardTitle>
        </CardHeader>
        <CardContent>
          {deadProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Último Movimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deadProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell>Hace 90 días</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No hay productos de baja rotación.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
