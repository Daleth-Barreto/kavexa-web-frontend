'use client';

import { useState } from "react";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash, MoreVertical } from "lucide-react";
import type { InventoryItem } from "@/lib/types";
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
import { ProductFormSheet } from "@/components/kavexa/product-form-sheet";


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};


export default function InventarioPage() {
  const { inventory, setInventory } = useAppContext();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const handleAddClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setAlertOpen(true);
  }

  const confirmDelete = () => {
    if(itemToDelete) {
      setInventory(prev => prev.filter(item => item.id !== itemToDelete.id));
    }
    setAlertOpen(false);
    setItemToDelete(null);
  }

  const handleFormSubmit = (data: Omit<InventoryItem, 'id'>) => {
    if (selectedItem) {
      // Edit
      setInventory(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...data } : item));
    } else {
      // Create
      const newItem: InventoryItem = {
        id: `item-${Date.now()}`,
        ...data
      }
      setInventory(prev => [newItem, ...prev]);
    }
    setSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Inventario"
        description="Administra tus productos, niveles de stock y precios."
      >
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          {inventory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead className="text-right w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.stock < item.lowStockThreshold ? (
                        <Badge variant="destructive">{item.stock}</Badge>
                      ) : (
                        <Badge variant="secondary">{item.stock}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
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
              No hay productos en el inventario. Añade uno para empezar.
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProductFormSheet 
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{itemToDelete?.name}" de tu inventario.
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
