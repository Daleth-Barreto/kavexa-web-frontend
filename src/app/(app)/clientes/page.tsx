'use client';

import { useState, useMemo } from "react";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, PlusCircle, Trash, MoreVertical } from "lucide-react";
import type { Client } from "@/lib/types";
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
import { ClientFormSheet } from "@/components/kavexa/client-form-sheet";

export default function ClientesPage() {
  const { clients, setClients } = useAppContext();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Client | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleAddClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: Client) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };
  
  const handleDeleteClick = (item: Client) => {
    setItemToDelete(item);
    setAlertOpen(true);
  }

  const confirmDelete = () => {
    if(itemToDelete) {
      setClients(prev => prev.filter(item => item.id !== itemToDelete.id));
    }
    setAlertOpen(false);
    setItemToDelete(null);
  }

  const handleFormSubmit = (data: Omit<Client, 'id' | 'lastPurchaseDate'>) => {
    if (selectedItem) {
      // Edit
      setClients(prev => prev.map(item => item.id === selectedItem.id ? { ...item, ...data } : item));
    } else {
      // Create
      const newItem: Client = {
        id: `client-${Date.now()}`,
        ...data
      }
      setClients(prev => [newItem, ...prev]);
    }
    setSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Clientes y Miembros"
        description="Administra tu base de clientes o el estado de las membresías de tu negocio."
      >
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
            <div className="mb-4">
                <Input 
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:max-w-sm"
                />
            </div>
          {filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Último Pago/Compra</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span>{item.email}</span>
                            <span className="text-xs text-muted-foreground">{item.phone}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        {item.lastPurchaseDate ? new Date(item.lastPurchaseDate).toLocaleDateString('es-ES') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
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
              No hay clientes. Añade uno para empezar.
            </div>
          )}
        </CardContent>
      </Card>
      
      <ClientFormSheet 
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente "{itemToDelete?.name}".
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
