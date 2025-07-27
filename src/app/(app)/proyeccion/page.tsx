'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCashFlow } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};


export default function ProyeccionPage() {
  const { cashFlow } = useAppContext();
  const showNegativeAlert = cashFlow.some(d => d.balance < 0);

  return (
    <PageWrapper>
       <PageHeader
        title="Proyección de Flujo de Caja"
        description="Anticipa el futuro financiero de tu negocio para los próximos 30, 60 y 90 días."
      />
      <Card>
        <CardHeader>
          <CardTitle>Proyección a 90 días</CardTitle>
        </CardHeader>
        <CardContent>
          { cashFlow.length > 0 ? (
             <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={cashFlow}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="var(--color-chart-1)" strokeWidth={2} activeDot={{ r: 8 }} name="Balance Proyectado"/>
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="text-center text-muted-foreground py-8 h-[400px] flex items-center justify-center">
              No hay suficientes datos para generar una proyección.
            </div>
          )}
        </CardContent>
      </Card>
      
      {showNegativeAlert && (
        <Alert variant="destructive" className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>¡Atención!</AlertTitle>
          <AlertDescription>
            Se proyecta un flujo de caja negativo en los próximos 90 días. Considera reducir gastos o aumentar ingresos.
          </AlertDescription>
        </Alert>
      )}

    </PageWrapper>
  );
}
