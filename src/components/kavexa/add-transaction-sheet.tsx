'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const transactionSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida.'),
  amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
  type: z.enum(['income', 'expense'], { required_error: 'El tipo es requerido.' }),
  category: z.string().min(1, 'La categoría es requerida.'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

type AddTransactionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdd: (data: TransactionFormValues) => void;
};

export function AddTransactionSheet({ open, onOpenChange, onTransactionAdd }: AddTransactionSheetProps) {
  const { toast } = useToast();
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      category: '',
    },
  });


  function onSubmit(data: TransactionFormValues) {
    onTransactionAdd(data);
    toast({
      title: 'Transacción añadida',
      description: `Se ha añadido "${data.description}" a tus movimientos.`,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Añadir Nuevo Movimiento</SheetTitle>
          <SheetDescription>
            Introduce los detalles de tu transacción. Haz clic en guardar cuando hayas terminado.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Venta de café" {...field} />
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
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Ingreso</SelectItem>
                      <SelectItem value="expense">Gasto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ventas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
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
