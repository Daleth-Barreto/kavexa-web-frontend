'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Provider } from '@/lib/types';

const providerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  contact: z.string().min(1, 'El nombre del contacto es requerido.'),
  phone: z.string().min(1, 'El teléfono es requerido.'),
});

type ProviderFormValues = Omit<Provider, 'id'>;

type ProviderFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProviderFormValues) => void;
  defaultValues?: Provider | null;
};

export function ProviderFormSheet({ open, onOpenChange, onSubmit, defaultValues }: ProviderFormSheetProps) {
  const { toast } = useToast();
  
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        name: '',
        contact: '',
        phone: '',
      });
    }
  }, [defaultValues, form, open]);


  function handleFormSubmit(data: ProviderFormValues) {
    onSubmit(data);
    toast({
      title: defaultValues ? 'Proveedor actualizado' : 'Proveedor creado',
      description: `Se ha guardado a "${data.name}".`,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{defaultValues ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}</SheetTitle>
          <SheetDescription>
            Introduce los detalles del proveedor.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Suministros ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 55 8765 4321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
              <Button type="submit">Guardar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
