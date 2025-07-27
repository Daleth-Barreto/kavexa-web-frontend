'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockInventory } from "@/lib/data";

export default function DemandaPage() {
  const deadProducts = mockInventory.filter(item => item.stock > 50); // Mock logic
  
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
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
