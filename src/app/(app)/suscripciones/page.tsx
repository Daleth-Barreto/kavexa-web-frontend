'use client';

import { useState } from "react";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash, MoreVertical } from "lucide-react";
import type { Subscription } from "@/lib/types";
import { useAppContext, useCurrency } from "@/contexts/app-context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SubscriptionFormSheet } from "@/components/kavexa/subscription-form-sheet";

export default function SuscripcionesPage() {
  const { subscriptions, setSubscriptions } = useAppContext();
  const { formatCurrency } = useCurrency();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Subscription | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Subscription | null>(null);

  const handleAddClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: Subscription) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const handleDeleteClick = (item: Subscription) => {
    setItemToDelete(item);
    setAlertOpen(true);
  }

  const confirmDelete = () => {
    if(itemToDelete) {
      setSubscriptions(prev => prev.filter(item => item.id !== itemToDelete.id));
    }
    setAlertOpen(false);
    setItemToDelete(null);
  }

  const handleFormSubmit = (data: Omit<Subscription, 'id' | 'lastPaidMonth' | 'lastPaidYear'>) => {
    if (selectedItem) {
      // Edit
      setSubscriptions(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...data } : item));
    } else {
      // Create
      const newItem: Subscription = {
        id: `sub-${Date.now()}`,
        lastPaidMonth: -1, // Not paid yet
        lastPaidYear: -1,
        ...data
      }
      setSubscriptions(prev => [newItem, ...prev]);
    }
    setSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Suscripciones"
        description="Gestiona tus pagos recurrentes para recibir alertas de vencimiento."
      >
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Suscripción
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {subscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Día de Pago</TableHead>
                  <TableHead className="text-right w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{`Día ${item.paymentDay} de cada mes`}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
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
              No hay suscripciones. Añade una para empezar a recibir alertas.
            </div>
          )}
        </CardContent>
      </Card>
      
      <SubscriptionFormSheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
        onSubmit={handleFormSubmit}
        defaultValues={selectedItem}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la suscripción "{itemToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </PageWrapper>
  );
}
