'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/contexts/app-context";

export default function DemandaPage() {
  const { inventory } = useAppContext();
  
  // Lógica de ejemplo para identificar productos "muertos" o de baja rotación.
  // Por ahora, consideramos "muerto" a un producto con más de 50 unidades en stock.
  // Esto se puede refinar con datos de ventas para usar media móvil o regresión.
  const deadProducts = inventory.filter(item => item.stock > 50);

  return (
    <PageWrapper>
      <PageHeader
        title="Análisis de Demanda"
        description="Analiza la rotación de tus productos e identifica aquellos con poco movimiento."
      />
       <Card>
        <CardHeader>
          <CardTitle>Productos de Baja Rotación (Ejemplo)</CardTitle>
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
                    {/* Este dato es un marcador de posición hasta tener historial de ventas */}
                    <TableCell>Fecha no disponible</TableCell> 
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No se han identificado productos de baja rotación.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
