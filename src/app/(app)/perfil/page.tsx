'use client';
import { useState, useRef } from 'react';
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

export default function PerfilPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const { theme, setTheme } = useTheme();
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
  
  const transactionFileInputRef = useRef<HTMLInputElement>(null);
  const inventoryFileInputRef = useRef<HTMLInputElement>(null);

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

    toast({ title: "Datos Exportados", description: "Tus archivos CSV se están descargando." });
  }

  const handleDeleteData = () => {
      clearAllData();
      setAlertOpen(false);
      setDeleteConfirmationInput('');
      toast({ title: "Datos Eliminados", description: "Toda tu información ha sido borrada.", variant: "destructive" });
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>, type: 'transactions' | 'inventory' | 'clients' | 'providers') => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ title: 'Error', description: 'No se seleccionó ningún archivo.', variant: 'destructive' });
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
              toast({ title: "Éxito", description: `${importedTransactions.length} transacciones importadas.` });
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
              toast({ title: "Éxito", description: `${importedInventory.length} productos importados.` });
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
              toast({ title: "Éxito", description: `${importedClients.length} clientes importados.` });
              break;
            case 'providers':
                const importedProviders = results.data.map((row: any): Provider => ({
                    id: `provider-imported-${Date.now()}-${Math.random()}`,
                    name: row.name || 'N/A',
                    contact: row.contact || 'N/A',
                    phone: row.phone || 'N/A',
                }));
                setProviders(prev => [...prev, ...importedProviders]);
                toast({ title: "Éxito", description: `${importedProviders.length} proveedores importados.` });
              break;
          }
        } catch (error) {
          toast({ title: 'Error de Importación', description: 'El archivo CSV no tiene el formato correcto.', variant: 'destructive'});
        }
      },
      error: (error: any) => {
        toast({ title: 'Error al leer el archivo', description: error.message, variant: 'destructive'});
      }
    });
    if(event.target) event.target.value = '';
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Perfil y Configuración"
        description="Gestiona los detalles de tu negocio, tu cuenta y tus preferencias."
      />
      <div className="grid gap-6 max-w-4xl lg:grid-cols-2">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Apariencia</CardTitle>
                    <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="dark-mode">Modo Oscuro</Label>
                        <Switch
                            id="dark-mode"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency">Moneda (código ISO)</Label>
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
                    <CardTitle>Gestión de Datos</CardTitle>
                    <CardDescription>Importa, exporta o elimina todos tus datos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className='text-sm text-muted-foreground'>Importa transacciones, inventario, clientes o proveedores desde archivos CSV.</p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Button variant="outline" className="w-full justify-center" onClick={() => transactionFileInputRef.current?.click()}>Importar Transacciones</Button>
                     <Button variant="outline" className="w-full justify-center" onClick={() => inventoryFileInputRef.current?.click()}>Importar Inventario</Button>
                   </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="w-full justify-center" onClick={handleExportCSV}>Exportar todo a CSV</Button>
                      <Button variant="destructive" className="w-full justify-center" onClick={() => setAlertOpen(true)}>Eliminar todos los datos</Button>
                    </div>
                    <input type="file" ref={transactionFileInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileImport(e, 'transactions')} />
                    <input type="file" ref={inventoryFileInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileImport(e, 'inventory')} />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Acceso Directo</CardTitle>
                    <CardDescription>Instala Kavexa en tu dispositivo para un acceso más rápido, como si fuera una aplicación nativa.</CardDescription>
                </CardHeader>
                <CardContent>
                   <InstallPwaButton />
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Módulos</CardTitle>
                    <CardDescription>Activa o desactiva las secciones de Kavexa según las necesidades de tu negocio.</CardDescription>
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
                                {module.title}
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
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Para confirmar, escribe "ELIMINAR" en el campo de abajo.
            </AlertDialogDescription>
          </AlertDialogHeader>
            <Input 
              type="text"
              placeholder='Escribe "ELIMINAR"'
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="mt-4"
            />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmationInput('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteData} 
              variant="destructive"
              disabled={deleteConfirmationInput !== 'ELIMINAR'}
            >
               Confirmar y Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
