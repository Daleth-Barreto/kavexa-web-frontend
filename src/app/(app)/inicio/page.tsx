'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/kavexa/page-wrapper';
import { PageHeader } from '@/components/kavexa/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Package, AlertTriangle, PlusCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext, useCurrency } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { AddTransactionSheet } from '@/components/kavexa/add-transaction-sheet';
import { ProductFormSheet } from '@/components/kavexa/product-form-sheet';
import type { InventoryItem } from '@/lib/types';


export default function InicioPage() {
  const { transactions, alerts, inventory, setInventory } = useAppContext();
  const [isTransactionSheetOpen, setTransactionSheetOpen] = useState(false);
  const [isProductSheetOpen, setProductSheetOpen] = useState(false);
  const { formatCurrency } = useCurrency();

  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalEgress = transactions.filter(t => t.type === 'egress').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalEgress;
    return { totalIncome, totalEgress, balance };
  }, [transactions]);

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const monthlyData: { [key: string]: { Ingresos: number, Egresos: number } } = {};
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.getMonth();
      const monthKey = `${monthNames[month]}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { Ingresos: 0, Egresos: 0 };
      }

      if (t.type === 'income') {
        monthlyData[monthKey].Ingresos += t.amount;
      } else {
        monthlyData[monthKey].Egresos += t.amount;
      }
    });

    return Object.entries(monthlyData).map(([name, values]) => ({
      name,
      ...values,
    }));
  }, [transactions]);

  const recentActivity = useMemo(() => {
    const newAlerts = alerts.filter(a => a.status === 'new').slice(0, 3);
    const lowStockItems = inventory.filter(i => i.stock < i.lowStockThreshold).slice(0, 2);
    
    const activity = [
      ...newAlerts.map(a => ({id: a.id, message: a.message, date: a.date, activityType: 'alert' as const})),
      ...lowStockItems.map(i => ({id: i.id, message: `Stock bajo para ${i.name}`, date: new Date().toISOString().split('T')[0], activityType: 'inventory' as const})),
    ];
    return activity.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [alerts, inventory]);

  const handleProductFormSubmit = (data: Omit<InventoryItem, 'id'>) => {
    // Solo creación desde el dashboard
    const newItem: InventoryItem = {
      id: `item-${Date.now()}`,
      ...data
    }
    setInventory(prev => [newItem, ...prev]);
    setProductSheetOpen(false);
  };


  return (
    <PageWrapper>
      <PageHeader
        title="Inicio"
        description="Un resumen de la salud financiera y operativa de tu negocio."
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setProductSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
           <Button onClick={() => setTransactionSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Registrar Movimiento
          </Button>
        </div>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">Calculado de todos los movimientos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalEgress)}</div>
            <p className="text-xs text-muted-foreground">Calculado de todos los movimientos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.balance)}</div>
            <p className="text-xs text-muted-foreground">Balance total calculado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Ingresos vs. Egresos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => formatCurrency(value, {
                    notation: 'compact',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                  })} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Egresos" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground h-[350px] flex items-center justify-center">
                No hay transacciones para mostrar un gráfico.
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
             {recentActivity.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {item.activityType === 'alert' ? 
                            <AlertTriangle className="h-4 w-4 text-yellow-500" /> : 
                            <Package className="h-4 w-4 text-blue-500" />
                          }
                          {item.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.activityType === 'alert' ? 'destructive' : 'secondary'}>
                            {item.activityType === 'alert' ? 'Alerta' : 'Inventario'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    No hay actividad reciente.
                </div>
             )}
          </CardContent>
        </Card>
      </div>

       <AddTransactionSheet 
        open={isTransactionSheetOpen} 
        onOpenChange={setTransactionSheetOpen}
        defaultValues={null} // Forcing creation mode from dashboard
      />

       <ProductFormSheet 
        open={isProductSheetOpen}
        onOpenChange={setProductSheetOpen}
        onSubmit={handleProductFormSubmit}
        defaultValues={null}
      />
    </PageWrapper>
  );
}
