
'use client';
import { useState } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, ShieldAlert, Repeat, DollarSign, Sparkles, Megaphone, PlusCircle, History, Clock } from "lucide-react";
import { useAppContext, useCurrency } from "@/contexts/app-context";
import type { Alert } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AddAlertSheet } from '@/components/kavexa/add-alert-sheet';
import { addDays, addWeeks, addMonths } from 'date-fns';

const statusVariant: Record<Alert['status'], 'destructive' | 'secondary' | 'default'> = {
  new: 'destructive',
  ignored: 'secondary',
  resolved: 'default',
};

const statusText: Record<Alert['status'], string> = {
  new: 'Nueva',
  ignored: 'Ignorada',
  resolved: 'Resuelta',
};

const alertIcons = {
  unusual_expense: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
  low_stock: <ShieldAlert className="h-4 w-4 text-orange-500" />,
  subscription_due: <Repeat className="h-4 w-4 text-blue-500" />,
  selling_opportunity: <Sparkles className="h-4 w-4 text-purple-500" />,
  custom: <Megaphone className="h-4 w-4 text-gray-500" />
}

const recurrenceText: Record<NonNullable<Alert['recurrence']>, string> = {
    none: 'No se repite',
    daily: 'Diariamente',
    weekly: 'Semanalmente',
    monthly: 'Mensualmente'
}

export default function AlertasPage() {
  const { alerts, setAlerts, addTransaction, subscriptions, setSubscriptions } = useAppContext();
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleStatusChange = (id: string, status: 'ignored' | 'resolved') => {
    setAlerts(currentAlerts => currentAlerts.map(alert => {
      if (alert.id !== id) return alert;

      if (status === 'resolved' && alert.recurrence && alert.recurrence !== 'none') {
        const startDate = new Date(alert.date);
        let nextRecurrenceDate: string | undefined;

        switch(alert.recurrence) {
            case 'daily': nextRecurrenceDate = addDays(startDate, 1).toISOString(); break;
            case 'weekly': nextRecurrenceDate = addWeeks(startDate, 1).toISOString(); break;
            case 'monthly': nextRecurrenceDate = addMonths(startDate, 1).toISOString(); break;
        }
        return { ...alert, status, nextRecurrenceDate };
      }
      
      return { ...alert, status, nextRecurrenceDate: undefined };

    }));
  };

  const handlePaySubscription = (alert: Alert) => {
    const subscription = subscriptions.find(s => s.id === alert.relatedId);
    if (!subscription) {
      toast({ title: 'Error', description: 'Suscripción no encontrada', variant: 'destructive'});
      return;
    }

    addTransaction({
      type: 'egress',
      description: `Pago de suscripción: ${subscription.name}`,
      amount: subscription.amount,
      category: subscription.category,
      date: new Date().toISOString().split('T')[0],
    });

    const today = new Date();
    setSubscriptions(prev => prev.map(s => s.id === subscription.id ? {
      ...s,
      lastPaidMonth: today.getMonth(),
      lastPaidYear: today.getFullYear(),
    } : s));

    handleStatusChange(alert.id, 'resolved');
    toast({ title: 'Suscripción Pagada', description: `Se registró el pago de ${subscription.name}`});
  }
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('es-ES');
    // Check if the time is midnight, if so, don't show it
    if(date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
        return datePart;
    }
    const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} - ${timePart}`;
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Alertas y Recordatorios"
        description="Gestiona las alertas generadas por el sistema y añade tus propios recordatorios."
      >
        <Button onClick={() => setSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Recordatorio
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mensaje</TableHead>
                  <TableHead className="hidden md:table-cell">Recurrencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.sort((a,b) => (b.status === 'new' ? 1 : -1) - (a.status === 'new' ? 1: -1) || new Date(b.date).getTime() - new Date(a.date).getTime()).map((alert) => (
                  <TableRow key={alert.id} className={alert.status === 'new' ? 'bg-primary/5' : ''}>
                    <TableCell className="font-medium">
                        <div className='flex items-center gap-2'>
                             {alertIcons[alert.type as keyof typeof alertIcons] || <ShieldAlert className="h-4 w-4" />}
                            <span>{alert.message}</span>
                        </div>
                        <div className='text-xs text-muted-foreground pl-6 flex items-center gap-1.5 mt-1'>
                            <Clock className="h-3 w-3" />
                            {formatDate(alert.date)}
                        </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {alert.recurrence && alert.recurrence !== 'none' && (
                            <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                                <History className='h-4 w-4'/>
                                {recurrenceText[alert.recurrence]}
                            </div>
                        )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[alert.status]}>{statusText[alert.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'new' && (
                        <div className="flex gap-2 justify-end">
                          {alert.type === 'subscription_due' ? (
                            <Button variant="outline" size="sm" onClick={() => handlePaySubscription(alert)}>
                              <DollarSign className="mr-2 h-4 w-4"/> Pagar
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleStatusChange(alert.id, 'resolved')}>
                              <Check className="mr-2 h-4 w-4"/> Resolver
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(alert.id, 'ignored')}>
                            <Trash2 className="mr-2 h-4 w-4" /> Ignorar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No hay alertas para mostrar. El sistema te notificará aquí si detecta alguna anomalía.
            </div>
          )}
        </CardContent>
      </Card>

      <AddAlertSheet 
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
      />
    </PageWrapper>
  );
}
