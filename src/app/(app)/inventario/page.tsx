'use client';

import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash } from "lucide-react";
import type { InventoryItem } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};


export default function InventarioPage() {
  const { inventory } = useAppContext();

  return (
    <PageWrapper>
      <PageHeader
        title="Inventario"
        description="Administra tus productos, niveles de stock y precios."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {inventory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.stock < item.lowStockThreshold ? (
                        <Badge variant="destructive">{item.stock}</Badge>
                      ) : (
                        <Badge variant="secondary">{item.stock}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No hay productos en el inventario. Añade uno para empezar.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
