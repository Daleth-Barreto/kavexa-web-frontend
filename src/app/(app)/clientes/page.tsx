
'use client';

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, PlusCircle, Trash, MoreVertical, Heart } from "lucide-react";
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

const romanticMessages = ["Mi mujer ❤️", "Mi nubecita ☁️", "Mi cacahuatito 🥜"];

export default function ClientesPage() {
  const { clients, setClients } = useAppContext();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Client | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialMessage, setSpecialMessage] = useState(romanticMessages[0]);
  
  const isSpecialSearch = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return ['maria fernanda velasco campos', 'mafer', 'mafer<3'].includes(lowerCaseSearch);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm === '23091061') {
      router.push('/23091061');
    }
  }, [searchTerm, router]);

  useEffect(() => {
    if (isSpecialSearch) {
      setSpecialMessage(romanticMessages[Math.floor(Math.random() * romanticMessages.length)]);
    }
  }, [isSpecialSearch]);

  const filteredClients = useMemo(() => {
    if (isSpecialSearch) return [];
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clients, searchTerm, isSpecialSearch]);

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
                    placeholder="Buscar por nombre, email o código secreto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:max-w-sm"
                />
            </div>
          {filteredClients.length > 0 || isSpecialSearch ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha Especial</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSpecialSearch && (
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableCell className="font-medium flex items-center gap-2">
                        <Heart className="text-red-500" />
                        María Fernanda Velasco Campos
                    </TableCell>
                    <TableCell>{specialMessage}</TableCell>
                    <TableCell>12/06/2004</TableCell>
                    <TableCell>
                        <Badge variant="default" className="bg-pink-500 hover:bg-pink-600">Para Siempre</Badge>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
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
            <AlertDialogAction onClick={confirmDelete} variant="destructive">Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </PageWrapper>
  );
}
