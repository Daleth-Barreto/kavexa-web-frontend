'use client';
import { useMemo } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/contexts/app-context";
import { calculateLinearRegression } from '@/lib/math-utils';
import { TrendingDown } from 'lucide-react';
import type { InventoryItem, Transaction } from '@/lib/types';

// Función para asociar transacciones a productos del inventario
const getSalesDataPerProduct = (transactions: Transaction[], inventory: InventoryItem[]) => {
  const sales: Record<string, { date: Date; quantity: number }[]> = {};

  // Solo consideramos transacciones de ingreso que sean ventas de producto
  const incomeTransactions = transactions.filter(t => t.type === 'income' && t.productId);

  incomeTransactions.forEach(t => {
    const productId = t.productId!;
    if (!sales[productId]) {
      sales[productId] = [];
    }
    // Asumimos que la cantidad es la que viene en la transacción
    sales[productId].push({ date: new Date(t.date), quantity: t.quantity || 1 });
  });

  return sales;
};

export default function DemandaPage() {
  const { inventory, transactions } = useAppContext();

  const demandAnalysis = useMemo(() => {
    if (inventory.length === 0 || transactions.length === 0) return [];
    
    const salesData = getSalesDataPerProduct(transactions, inventory);
    
    return inventory.map(item => {
      const itemSales = salesData[item.id];
      if (!itemSales || itemSales.length < 2) {
        return { ...item, trend: 0, salesCount: itemSales?.length || 0 }; // No hay suficientes datos para tendencia
      }

      // Convertimos las fechas a valores numéricos (días desde la primera venta)
      const firstSaleDate = itemSales.reduce((earliest, current) => current.date < earliest ? current.date : earliest, new Date()).getTime();
      const timeSeries = itemSales.map(sale => ({
        x: (sale.date.getTime() - firstSaleDate) / (1000 * 60 * 60 * 24), // días
        y: sale.quantity
      }));
      
      const regression = calculateLinearRegression(timeSeries);

      return {
        ...item,
        trend: regression.slope,
        salesCount: itemSales.length,
      };
    }).filter(item => item.salesCount > 1); // Solo mostrar productos con al menos 2 ventas
  
  }, [inventory, transactions]);
  
  const lowDemandProducts = demandAnalysis.filter(p => p.trend < 0).sort((a,b) => a.trend - b.trend);

  return (
    <PageWrapper>
      <PageHeader
        title="Análisis de Demanda"
        description="Analiza la rotación de tus productos e identifica aquellos con poco movimiento usando regresión lineal."
      />
       <Card>
        <CardHeader>
          <CardTitle>Productos con Tendencia de Demanda a la Baja</CardTitle>
          <CardDescription>
            Estos productos muestran una tendencia de ventas decreciente según el análisis de tus transacciones. El análisis requiere al menos dos ventas registradas para cada producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lowDemandProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead className='text-center'>Tendencia (Ventas/Día)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowDemandProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell className='text-center'>
                       <span className={`flex items-center justify-center gap-2 font-semibold text-red-500`}>
                         <TrendingDown size={16} />
                         {item.trend.toFixed(4)}
                       </span>
                    </TableCell> 
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No se han identificado productos con demanda a la baja o no hay suficientes datos de ventas para el análisis.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
