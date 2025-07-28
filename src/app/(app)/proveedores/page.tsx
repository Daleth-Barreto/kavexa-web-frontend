'use client';

import { useState } from "react";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash, MoreVertical } from "lucide-react";
import type { Provider } from "@/lib/types";
import { useAppContext } from "@/contexts/app-context";
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
import { ProviderFormSheet } from "@/components/kavexa/provider-form-sheet";

export default function ProveedoresPage() {
  const { providers, setProviders } = useAppContext();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Provider | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Provider | null>(null);

  const handleAddClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: Provider) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const handleDeleteClick = (item: Provider) => {
    setItemToDelete(item);
    setAlertOpen(true);
  }

  const confirmDelete = () => {
    if(itemToDelete) {
      setProviders(prev => prev.filter(item => item.id !== itemToDelete.id));
    }
    setAlertOpen(false);
    setItemToDelete(null);
  }

  const handleFormSubmit = (data: Omit<Provider, 'id'>) => {
    if (selectedItem) {
      // Edit
      setProviders(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...data } : item));
    } else {
      // Create
      const newItem: Provider = {
        id: `provider-${Date.now()}`,
        ...data
      }
      setProviders(prev => [newItem, ...prev]);
    }
    setSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Proveedores"
        description="Administra la información de contacto de tus proveedores."
      >
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Proveedor
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {providers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Proveedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-right w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.contact}</TableCell>
                    <TableCell>{item.phone}</TableCell>
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
              No hay proveedores registrados. Añade uno para empezar.
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProviderFormSheet 
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente al proveedor "{itemToDelete?.name}".
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
