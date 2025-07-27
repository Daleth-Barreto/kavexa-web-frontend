'use client';
import { useMemo } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useAppContext, useCurrency } from "@/contexts/app-context";
import type { Transaction } from '@/lib/types';
import { subDays, format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

const calculateMovingAverageProjection = (transactions: Transaction[], daysToProject: number, period: number) => {
  if (transactions.length === 0) return [];
  
  const today = new Date();
  const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  
  const dailyNet = new Map<string, number>();
  transactions.forEach(t => {
    const date = format(new Date(t.date), 'yyyy-MM-dd');
    const amount = t.type === 'income' ? t.amount : -t.amount;
    dailyNet.set(date, (dailyNet.get(date) || 0) + amount);
  });
  
  const recentNetValues: number[] = [];
  for(let i=0; i<period; i++){
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    recentNetValues.push(dailyNet.get(date) || 0);
  }

  const movingAverage = recentNetValues.reduce((a, b) => a + b, 0) / period;

  const projection = [];
  let currentBalance = balance;

  for (let i = 0; i < daysToProject; i++) {
    currentBalance += movingAverage;
    const date = addDays(today, i);
    projection.push({
      date: format(date, 'MMM d', { locale: es }),
      balance: currentBalance,
    });
  }

  return projection;
};


export default function ProyeccionPage() {
  const { transactions } = useAppContext();
  const { formatCurrency } = useCurrency();

  const projectionData = useMemo(() => {
    // Usamos una media móvil de 30 días para la proyección
    return calculateMovingAverageProjection(transactions, 90, 30);
  }, [transactions]);

  const showNegativeAlert = projectionData.some(d => d.balance < 0);

  return (
    <PageWrapper>
       <PageHeader
        title="Proyección de Flujo de Caja"
        description="Anticipa el futuro financiero de tu negocio usando una media móvil de los últimos 30 días."
      />
      <Card>
        <CardHeader>
          <CardTitle>Proyección a 90 días</CardTitle>
        </CardHeader>
        <CardContent>
          { transactions.length > 5 ? (
             <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={projectionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value, { notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1 })} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-1)" strokeWidth={2} activeDot={{ r: 8 }} name="Balance Proyectado"/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-center text-muted-foreground py-8 h-[400px] flex items-center justify-center">
              Se necesitan al menos 6 transacciones para generar una proyección fiable.
            </div>
          )}
        </CardContent>
      </Card>
      
      {showNegativeAlert && (
        <Alert variant="destructive" className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>¡Atención!</AlertTitle>
          <AlertDescription>
            Se proyecta un flujo de caja negativo en los próximos 90 días. Considera reducir egresos o aumentar ingresos.
          </AlertDescription>
        </Alert>
      )}

    </PageWrapper>
  );
}
