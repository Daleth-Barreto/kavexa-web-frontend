
'use client';
import { useState, useRef, useEffect } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from "@/contexts/auth-context";
import { useAppContext } from '@/contexts/app-context';
import { useTheme } from 'next-themes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import type { Transaction, InventoryItem, Provider, Client, ModuleKey } from '@/lib/types';
import { ALL_MODULES } from '@/lib/data';
import { InstallPwaButton } from '@/components/kavexa/install-pwa-button';
import { useI18n } from '@/contexts/i18n-context';

export default function PerfilPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const { 
    currency, 
    setCurrency, 
    clearAllData, 
    transactions, 
    inventory,
    providers,
    clients,
    setTransactions, 
    setInventory,
    setProviders,
    setClients,
    config,
    updateModuleConfig
  } = useAppContext();

  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [notificationPermission, setNotificationPermission] = useState('default');
  
  const transactionFileInputRef = useRef<HTMLInputElement>(null);
  const inventoryFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleNotificationToggle = async (checked: boolean) => {
    if (!('Notification' in window)) {
      toast({ title: t('toasts.warning'), description: t('toasts.notificationsNotSupported'), variant: 'destructive' });
      return;
    }
    if (checked) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification(t('toasts.notificationsGranted'), { body: t('toasts.notificationsGrantedDescription') });
      } else {
        toast({ title: t('toasts.warning'), description: t('toasts.notificationsDenied') });
      }
    } else {
      toast({ title: t('toasts.info'), description: t('toasts.notificationsInfo') });
    }
  };


  const handleExportCSV = () => {
    const dataToExport: {filename: string, data: any[]}[] = [
      { filename: 'kavexa_transactions.csv', data: transactions },
      { filename: 'kavexa_inventory.csv', data: inventory },
      { filename: 'kavexa_clients.csv', data: clients },
      { filename: 'kavexa_providers.csv', data: providers },
    ];

    dataToExport.forEach(({filename, data}) => {
      if (data.length > 0) {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    toast({ title: t('toasts.exportSuccess'), description: t('toasts.exportDescription') });
  }

  const handleDeleteData = () => {
      clearAllData();
      setAlertOpen(false);
      setDeleteConfirmationInput('');
      toast({ title: t('toasts.dataDeleted'), description: t('toasts.dataDeletedDescription'), variant: "destructive" });
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>, type: 'transactions' | 'inventory' | 'clients' | 'providers') => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ title: t('toasts.error'), description: t('toasts.importNoFile'), variant: 'destructive' });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          switch(type) {
            case 'transactions':
               const importedTransactions = results.data.map((row: any): Transaction => ({
                id: `txn-imported-${Date.now()}-${Math.random()}`,
                date: row.date || new Date().toISOString().split('T')[0],
                description: row.description || 'N/A',
                amount: parseFloat(row.amount) || 0,
                type: row.type === 'income' ? 'income' : 'egress',
                category: row.category || 'Sin categoría',
                productId: row.productId,
                quantity: row.quantity ? parseInt(row.quantity) : undefined
              }));
              setTransactions(prev => [...prev, ...importedTransactions]);
              toast({ title: t('toasts.success'), description: t('toasts.transactionsImported', { count: importedTransactions.length }) });
              break;
            case 'inventory':
              const importedInventory = results.data.map((row: any): InventoryItem => ({
                id: `item-imported-${Date.now()}-${Math.random()}`,
                name: row.name || 'N/A',
                stock: parseInt(row.stock) || 0,
                lowStockThreshold: parseInt(row.lowStockThreshold) || 10,
                price: parseFloat(row.price) || 0,
              }));
              setInventory(prev => [...prev, ...importedInventory]);
              toast({ title: t('toasts.success'), description: t('toasts.inventoryImported', { count: importedInventory.length }) });
              break;
            case 'clients':
              const importedClients = results.data.map((row: any): Client => ({
                id: `client-imported-${Date.now()}-${Math.random()}`,
                name: row.name || 'N/A',
                email: row.email || 'N/A',
                phone: row.phone || 'N/A',
                status: row.status === 'active' ? 'active' : 'inactive',
              }));
              setClients(prev => [...prev, ...importedClients]);
              toast({ title: t('toasts.success'), description: t('toasts.clientsImported', { count: importedClients.length }) });
              break;
            case 'providers':
                const importedProviders = results.data.map((row: any): Provider => ({
                    id: `provider-imported-${Date.now()}-${Math.random()}`,
                    name: row.name || 'N/A',
                    contact: row.contact || 'N/A',
                    phone: row.phone || 'N/A',
                }));
                setProviders(prev => [...prev, ...importedProviders]);
                toast({ title: t('toasts.success'), description: t('toasts.providersImported', { count: importedProviders.length }) });
              break;
          }
        } catch (error) {
          toast({ title: t('toasts.importError'), description: t('toasts.importErrorDescription'), variant: 'destructive'});
        }
      },
      error: (error: any) => {
        toast({ title: t('toasts.importFileError'), description: error.message, variant: 'destructive'});
      }
    });
    if(event.target) event.target.value = '';
  }

  return (
    <PageWrapper>
      <PageHeader
        title={t('perfil.title')}
        description={t('perfil.description')}
      />
      <div className="grid gap-6 max-w-4xl lg:grid-cols-2">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('perfil.appearanceCard.title')}</CardTitle>
                    <CardDescription>{t('perfil.appearanceCard.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">{t('perfil.appearanceCard.darkMode')}</Label>
                        <Switch
                            id="dark-mode"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">{t('perfil.appearanceCard.notifications')}</Label>
                        <Switch
                            id="notifications"
                            checked={notificationPermission === 'granted'}
                            onCheckedChange={handleNotificationToggle}
                            disabled={notificationPermission === 'denied'}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency">{t('perfil.appearanceCard.currency')}</Label>
                        <Input 
                            id="currency" 
                            defaultValue={currency}
                            onBlur={(e) => setCurrency(e.target.value.toUpperCase())}
                            placeholder="USD"
                        />
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('perfil.dataCard.title')}</CardTitle>
                    <CardDescription>{t('perfil.dataCard.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className='text-sm text-muted-foreground'>{t('perfil.dataCard.importDescription')}</p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Button variant="outline" className="w-full justify-center" onClick={() => transactionFileInputRef.current?.click()}>{t('perfil.dataCard.importTransactions')}</Button>
                     <Button variant="outline" className="w-full justify-center" onClick={() => inventoryFileInputRef.current?.click()}>{t('perfil.dataCard.importInventory')}</Button>
                   </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="w-full justify-center" onClick={handleExportCSV}>{t('perfil.dataCard.exportAll')}</Button>
                      <Button variant="destructive" className="w-full justify-center" onClick={() => setAlertOpen(true)}>{t('perfil.dataCard.deleteAll')}</Button>
                    </div>
                    <input type="file" ref={transactionFileInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileImport(e, 'transactions')} />
                    <input type="file" ref={inventoryFileInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileImport(e, 'inventory')} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t('perfil.shortcutCard.title')}</CardTitle>
                    <CardDescription>{t('perfil.shortcutCard.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <InstallPwaButton />
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('perfil.modulesCard.title')}</CardTitle>
                    <CardDescription>{t('perfil.modulesCard.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {ALL_MODULES.map(module => (
                        <div key={module.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={module.id}
                                checked={config.enabledModules[module.id]}
                                onCheckedChange={(checked) => updateModuleConfig(module.id as ModuleKey, !!checked)}
                            />
                            <label htmlFor={module.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t(`nav.${module.id}`)}
                            </label>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>

       <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('perfil.deleteDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('perfil.deleteDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
            <Input 
              type="text"
              placeholder={t('perfil.deleteDialog.placeholder')}
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="mt-4"
            />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmationInput('')}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteData} 
              variant="destructive"
              disabled={deleteConfirmationInput.toUpperCase() !== 'DELETE' && deleteConfirmationInput.toUpperCase() !== 'ELIMINAR'}
            >
               {t('perfil.deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
