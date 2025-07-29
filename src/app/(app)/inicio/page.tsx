
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/kavexa/page-wrapper';
import { PageHeader } from '@/components/kavexa/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, ShieldAlert, Repeat, Sparkles, Megaphone, PlusCircle, MessageSquareQuote, ArrowRight, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext, useCurrency } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { AddTransactionSheet } from '@/components/kavexa/add-transaction-sheet';
import { ProductFormSheet } from '@/components/kavexa/product-form-sheet';
import type { InventoryItem } from '@/lib/types';
import { AppTour } from '@/components/kavexa/app-tour';

const alertIcons = {
  unusual_expense: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
  low_stock: <ShieldAlert className="h-4 w-4 text-orange-500" />,
  subscription_due: <Repeat className="h-4 w-4 text-blue-500" />,
  selling_opportunity: <Sparkles className="h-4 w-4 text-purple-500" />,
  custom: <Megaphone className="h-4 w-4 text-gray-500" />
}

export default function InicioPage() {
  const { transactions, alerts, inventory, setInventory } = useAppContext();
  const [isTransactionSheetOpen, setTransactionSheetOpen] = useState(false);
  const [isProductSheetOpen, setProductSheetOpen] = useState(false);
  const { formatCurrency } = useCurrency();
  
  const GOOGLE_FORM_URL = "https://forms.gle/sYJRQ3rWXpjxjcCZ7";

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

  const recentAlerts = useMemo(() => {
    const now = new Date();
    return alerts
      .filter(a => a.status === 'new' && new Date(a.date) <= now)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [alerts]);

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
    <AppTour>
      <PageWrapper>
        <PageHeader
          title="Inicio"
          description="Un resumen de la salud financiera y operativa de tu negocio."
        >
          <div className="flex items-center gap-2">
            <AppTour.Trigger />
            <div className="flex flex-col sm:flex-row gap-2" data-tour-step="4">
               <Button variant="outline" asChild>
                <Link href={GOOGLE_FORM_URL} target="_blank">
                  <MessageSquareQuote className="mr-2 h-4 w-4" />
                  Danos tu opinión
                </Link>
              </Button>
              <Button onClick={() => setTransactionSheetOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registrar Movimiento
              </Button>
            </div>
          </div>
        </PageHeader>
        <div data-tour-step="2" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <Card data-tour-step="3" className="lg:col-span-4">
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
                    <Tooltip
                      contentStyle={{
                          background: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                          color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))" }}/>
                    <Bar dataKey="Ingresos" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Egresos" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground h-[350px] flex items-center justify-center">
                  No hay transacciones para mostrar un gráfico.
                </div>
              )}
            </CardContent>
          </Card>
          <Card data-tour-step="5" className="lg:col-span-3 flex flex-col">
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>Las notificaciones más recientes generadas por el sistema.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {recentAlerts.length > 0 ? (
                  <Table>
                    <TableBody>
                      {recentAlerts.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium flex items-center gap-2 p-2">
                             {alertIcons[item.type as keyof typeof alertIcons] || <ShieldAlert className="h-4 w-4" />}
                            {item.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              ) : (
                  <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                      <Bell className="h-10 w-10 mb-4 text-muted-foreground/50"/>
                      <p className="font-medium">Todo en orden</p>
                      <p className="text-sm">No tienes alertas nuevas en este momento.</p>
                  </div>
              )}
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/alertas">
                        Ver todas las alertas <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardFooter>
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
    </AppTour>
  );
}
