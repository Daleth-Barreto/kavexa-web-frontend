
'use client';
import { useState } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, ShieldAlert, Repeat, DollarSign, Sparkles, Megaphone, PlusCircle, History, Clock, MoreVertical, Edit } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import type { Alert } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AddAlertSheet } from '@/components/kavexa/add-alert-sheet';
import { addDays, addWeeks, addMonths } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useI18n } from '@/contexts/i18n-context';

const statusVariant: Record<Alert['status'], 'destructive' | 'secondary' | 'default'> = {
  new: 'destructive',
  ignored: 'secondary',
  resolved: 'default',
};

const alertIcons = {
  unusual_expense: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
  low_stock: <ShieldAlert className="h-4 w-4 text-orange-500" />,
  subscription_due: <Repeat className="h-4 w-4 text-blue-500" />,
  selling_opportunity: <Sparkles className="h-4 w-4 text-purple-500" />,
  custom: <Megaphone className="h-4 w-4 text-gray-500" />
}

export default function AlertasPage() {
  const { alerts, setAlerts, addTransaction, subscriptions, setSubscriptions, deleteAlert } = useAppContext();
  const { t } = useI18n();
  const { toast } = useToast();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);

  const sortedAlerts = alerts.sort((a,b) => (b.status === 'new' ? 1 : -1) - (a.status === 'new' ? 1: -1) || new Date(b.date).getTime() - new Date(a.date).getTime());

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
      toast({ title: t('toasts.error'), description: t('toasts.subscriptionNotFound'), variant: 'destructive'});
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
    toast({ title: t('toasts.subscriptionPaid'), description: t('toasts.subscriptionPaidDescription', { name: subscription.name })});
  }
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString('es-ES');
    if(date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
        return datePart;
    }
    const timePart = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} - ${timePart}`;
  }

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if (checked) {
      sortedAlerts.forEach(alert => {
        newSelectedRows[alert.id] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const numSelected = Object.values(selectedRows).filter(Boolean).length;
  const isAllSelected = numSelected > 0 && numSelected === sortedAlerts.length;

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setSheetOpen(true);
  }

  const handleDeleteAlert = (alert: Alert) => {
    setAlertToDelete(alert);
    setDeleteAlertOpen(true);
  }

  const confirmDeleteAlert = () => {
    if (alertToDelete) {
      deleteAlert(alertToDelete.id);
      toast({ title: t('toasts.alertDeleted')});
    }
    setAlertToDelete(null);
    setDeleteAlertOpen(false);
  }
  
  const handleDeleteSelected = () => {
    const idsToDelete = Object.keys(selectedRows).filter(id => selectedRows[id]);
    idsToDelete.forEach(id => deleteAlert(id));
    setSelectedRows({});
    toast({ title: t('toasts.alertsDeleted', { count: idsToDelete.length })});
  }

  return (
    <PageWrapper>
      <PageHeader
        title={t('alertas.title')}
        description={t('alertas.description')}
      >
        <div className="flex items-center gap-2">
            {numSelected > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('alertas.deleteSelected', { count: numSelected })}
                </Button>
            )}
            <Button onClick={() => { setSelectedAlert(null); setSheetOpen(true); }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t('alertas.addReminder')}
            </Button>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {sortedAlerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                     <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label={t('common.selectAll')}
                    />
                  </TableHead>
                  <TableHead>{t('alertas.table.message')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('alertas.table.recurrence')}</TableHead>
                  <TableHead>{t('alertas.table.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAlerts.map((alert) => (
                  <TableRow key={alert.id} data-state={selectedRows[alert.id] ? 'selected' : ''}>
                    <TableCell>
                        <Checkbox
                            checked={selectedRows[alert.id] || false}
                            onCheckedChange={() => handleSelectRow(alert.id)}
                            aria-label={`Select alert ${alert.id}`}
                        />
                    </TableCell>
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
                                {t(`alertas.recurrence${alert.recurrence.charAt(0).toUpperCase() + alert.recurrence.slice(1)}`)}
                            </div>
                        )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[alert.status]}>{t(`alertas.status${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}`)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'new' && (
                        <div className="flex gap-2 justify-end">
                          {alert.type === 'subscription_due' ? (
                            <Button variant="outline" size="sm" onClick={() => handlePaySubscription(alert)}>
                              <DollarSign className="mr-2 h-4 w-4"/> {t('alertas.pay')}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleStatusChange(alert.id, 'resolved')}>
                              <Check className="mr-2 h-4 w-4"/> {t('alertas.resolve')}
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(alert.id, 'ignored')}>
                            <Trash2 className="mr-2 h-4 w-4" /> {t('alertas.ignore')}
                          </Button>
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {alert.type === 'custom' && (
                             <DropdownMenuItem onClick={() => handleEditAlert(alert)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                           )}
                           <DropdownMenuItem onClick={() => handleDeleteAlert(alert)} className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                             {t('common.delete')}
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              {t('alertas.noAlerts')}
            </div>
          )}
        </CardContent>
      </Card>

      <AddAlertSheet 
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
        defaultValues={selectedAlert}
      />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('alertas.deleteAlertTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('alertas.deleteAlertDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertToDelete(null)}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAlert} variant="destructive">{t('common.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
