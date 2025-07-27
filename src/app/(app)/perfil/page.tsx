'use client';
import { useState } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import { useAuth } from "@/contexts/auth-context";
import { useAppContext, useCurrency } from '@/contexts/app-context';
import { useTheme } from 'next-themes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import Papa from 'papaparse';

export default function PerfilPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, clearAllData, transactions, inventory } = useAppContext();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');


  const handleExportCSV = () => {
    const transactionCsv = Papa.unparse(transactions);
    const inventoryCsv = Papa.unparse(inventory);

    const download = (filename: string, content: string) => {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    
    download('kavexa_transactions.csv', transactionCsv);
    download('kavexa_inventory.csv', inventoryCsv);

    toast({ title: "Datos Exportados", description: "Tus transacciones e inventario han sido exportados a CSV." });
  }

  const handleDeleteData = () => {
      clearAllData();
      setAlertOpen(false);
      setDeleteConfirmationInput('');
      toast({ title: "Datos Eliminados", description: "Toda tu información ha sido borrada.", variant: "destructive" });
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Perfil y Configuración"
        description="Gestiona los detalles de tu negocio, tu cuenta y tus preferencias."
      />
      <div className="grid gap-6 max-w-2xl">
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
                <CardDescription>Exporta o elimina todos tus datos de la aplicación.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
               <Button variant="outline" onClick={handleExportCSV}>Exportar a CSV</Button>
               <Button variant="destructive" onClick={() => setAlertOpen(true)}>Eliminar todos los datos</Button>
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle>Autenticación</CardTitle>
                <CardDescription>
                  {isAuthenticated 
                    ? "Actualmente has iniciado sesión."
                    : "Estás en una sesión de invitado. Inicia sesión para guardar tus datos en la nube."
                  }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={isAuthenticated ? logout : login}>
                    {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
                </Button>
            </CardContent>
        </Card>
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
