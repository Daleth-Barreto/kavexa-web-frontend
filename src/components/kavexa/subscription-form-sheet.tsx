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
import type { Subscription } from '@/lib/types';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  paymentDay: z.coerce.number().int().min(1, 'El día debe ser entre 1 y 31').max(31, 'El día debe ser entre 1 y 31'),
});

type SubscriptionFormValues = Omit<Subscription, 'id' | 'lastPaidMonth' | 'lastPaidYear'>;

type SubscriptionFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SubscriptionFormValues) => void;
  defaultValues?: Subscription | null;
};

export function SubscriptionFormSheet({ open, onOpenChange, onSubmit, defaultValues }: SubscriptionFormSheetProps) {
  const { toast } = useToast();
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        name: '',
        amount: 0,
        category: 'Servicios',
        paymentDay: 1,
      });
    }
  }, [defaultValues, form, open]);


  function handleFormSubmit(data: SubscriptionFormValues) {
    onSubmit(data);
    toast({
      title: defaultValues ? 'Suscripción actualizada' : 'Suscripción creada',
      description: `Se ha guardado "${data.name}".`,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{defaultValues ? 'Editar Suscripción' : 'Añadir Nueva Suscripción'}</SheetTitle>
          <SheetDescription>
            Introduce los detalles del pago recurrente.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Gasto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Alquiler de local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Mensual</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría del Gasto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Renta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="paymentDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Día del Mes para el Pago</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
