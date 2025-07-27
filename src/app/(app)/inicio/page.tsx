'use client';

import { PageWrapper } from '@/components/kavexa/page-wrapper';
import { PageHeader } from '@/components/kavexa/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTransactions, mockAlerts, mockInventory } from '@/lib/data';
import { useMemo } from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function InicioPage() {

  const summary = useMemo(() => {
    const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, balance };
  }, []);

  const chartData = [
    { name: 'Ene', Ingresos: 4000, Gastos: 2400 },
    { name: 'Feb', Ingresos: 3000, Gastos: 1398 },
    { name: 'Mar', Ingresos: 2000, Gastos: 9800 },
    { name: 'Abr', Ingresos: 2780, Gastos: 3908 },
    { name: 'May', Ingresos: 1890, Gastos: 4800 },
    { name: 'Jun', Ingresos: 2390, Gastos: 3800 },
  ];

  const recentActivity = useMemo(() => {
    const alerts = mockAlerts.filter(a => a.status === 'new').slice(0, 3);
    const lowStockItems = mockInventory.filter(i => i.stock < i.lowStockThreshold).slice(0, 2);
    
    const activity = [
      ...alerts.map(a => ({...a, activityType: 'alert'})),
      ...lowStockItems.map(i => ({id: i.id, message: `Stock bajo para ${i.name}`, date: new Date().toISOString().split('T')[0], activityType: 'inventory'})),
    ];
    return activity.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, []);

  return (
    <PageWrapper>
      <PageHeader
        title="Inicio"
        description="Un resumen de la salud financiera y operativa de tu negocio."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalIncome)}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">+18.1% desde el mes pasado</p>
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
            <CardTitle>Ingresos vs. Gastos</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ingresos" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gastos" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
