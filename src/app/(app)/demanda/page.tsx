
'use client';
import { useState, useMemo } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app-context";
import { calculateLinearRegression } from '@/lib/math-utils';
import { TrendingDown, CalendarDays, TrendingUp, ArrowUpDown, BarChart2 } from 'lucide-react';
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

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type DemandAnalysisItem = InventoryItem & {
  trend: number;
  salesCount: number;
  totalSold: number;
  strongestDay: string;
};

export default function DemandaPage() {
  const { inventory, transactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof DemandAnalysisItem | null, direction: 'ascending' | 'descending' }>({
    key: 'trend',
    direction: 'ascending'
  });

  const demandAnalysis = useMemo(() => {
    if (inventory.length === 0 || transactions.length === 0) return [];
    
    const salesData = getSalesDataPerProduct(transactions, inventory);
    
    return inventory.map((item): DemandAnalysisItem => {
      const itemSales = salesData[item.id] || [];
      const salesCount = itemSales.length;
      const totalSold = itemSales.reduce((sum, sale) => sum + sale.quantity, 0);

      if (salesCount < 2) {
        return { ...item, trend: 0, salesCount, totalSold, strongestDay: 'N/A' };
      }

      // --- Cálculo de tendencia (regresión lineal) ---
      const firstSaleDate = itemSales.reduce((earliest, current) => current.date < earliest ? current.date : earliest, new Date()).getTime();
      const timeSeries = itemSales.map(sale => ({
        x: (sale.date.getTime() - firstSaleDate) / (1000 * 60 * 60 * 24), // días
        y: sale.quantity
      }));
      const regression = calculateLinearRegression(timeSeries);

      // --- Cálculo del día más fuerte ---
      const salesPerDay = new Array(7).fill(0); // Domingo = 0, Sábado = 6
      itemSales.forEach(sale => {
        const dayOfWeek = sale.date.getDay();
        salesPerDay[dayOfWeek] += sale.quantity;
      });
      const maxSales = Math.max(...salesPerDay);
      const strongestDayIndex = salesPerDay.indexOf(maxSales);

      return {
        ...item,
        trend: regression.slope,
        salesCount,
        totalSold,
        strongestDay: dayNames[strongestDayIndex],
      };
    }).filter(item => item.salesCount > 1); // Solo mostrar productos con al menos 2 ventas
  
  }, [inventory, transactions]);
  
  const sortedAndFilteredProducts = useMemo(() => {
    let sortableItems = [...demandAnalysis];

    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [demandAnalysis, searchTerm, sortConfig]);
  
  const requestSort = (key: keyof DemandAnalysisItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof DemandAnalysisItem) => {
    if (sortConfig.key !== key) {
        return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' 
        ? <TrendingUp className="ml-2 h-4 w-4" /> 
        : <TrendingDown className="ml-2 h-4 w-4" />;
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Análisis de Demanda"
        description="Analiza la rotación de tus productos, identifica tendencias y los días de mayor venta."
      />
       <Card>
        <CardHeader>
          <CardTitle>Análisis de Productos</CardTitle>
          <CardDescription>
            Observa el rendimiento de tus productos. El análisis requiere al menos dos ventas registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <Input 
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:max-w-sm"
                />
            </div>

          {sortedAndFilteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('name')}>
                        Producto {getSortIcon('name')}
                     </Button>
                  </TableHead>
                  <TableHead className='text-center'>
                     <Button variant="ghost" onClick={() => requestSort('stock')}>
                        Stock Actual {getSortIcon('stock')}
                     </Button>
                  </TableHead>
                  <TableHead className='text-center'>
                     <Button variant="ghost" onClick={() => requestSort('trend')}>
                        Tendencia (Ventas/Día) {getSortIcon('trend')}
                     </Button>
                  </TableHead>
                   <TableHead className='text-center'>
                     <Button variant="ghost" onClick={() => requestSort('totalSold')}>
                        Ventas Totales {getSortIcon('totalSold')}
                     </Button>
                  </TableHead>
                  <TableHead className='text-center'>Día Fuerte</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredProducts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.stock}</TableCell>
                    <TableCell className='text-center'>
                       <span className={`flex items-center justify-center gap-2 font-semibold ${item.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                         {item.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                         {item.trend.toFixed(4)}
                       </span>
                    </TableCell> 
                    <TableCell className='text-center'>
                       <span className="flex items-center justify-center gap-2 text-muted-foreground">
                         <BarChart2 size={16} />
                         {item.totalSold} unidades
                       </span>
                    </TableCell>
                    <TableCell className='text-center'>
                      <span className="flex items-center justify-center gap-2 text-muted-foreground">
                        <CalendarDays size={16} />
                        {item.strongestDay}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No se han identificado productos para el análisis o no hay suficientes datos de ventas.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

