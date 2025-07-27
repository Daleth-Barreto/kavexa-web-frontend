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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/app-context';
import type { Transaction } from '@/lib/types';


const transactionSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida.'),
  amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
  type: z.enum(['income', 'expense'], { required_error: 'El tipo es requerido.' }),
  category: z.string().min(1, 'La categoría es requerida.'),
  date: z.string().optional(), // Adding date to be able to edit it
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

type AddTransactionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: Transaction | null;
};

export function AddTransactionSheet({ open, onOpenChange, defaultValues }: AddTransactionSheetProps) {
  const { toast } = useToast();
  const { addTransaction, editTransaction } = useAppContext();
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset({
          ...defaultValues,
          date: defaultValues.date.split('T')[0] // Format for input[type=date]
        });
      } else {
        form.reset({
          description: '',
          amount: 0,
          type: 'expense',
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, defaultValues, form]);


  function onSubmit(data: TransactionFormValues) {
    if (defaultValues) {
      // Edit
      editTransaction({
        ...defaultValues,
        ...data
      });
      toast({
        title: 'Transacción actualizada',
        description: `Se ha actualizado "${data.description}".`,
      });
    } else {
      // Create
      addTransaction(data);
      toast({
        title: 'Transacción añadida',
        description: `Se ha añadido "${data.description}" a tus movimientos.`,
      });
    }

    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{defaultValues ? "Editar Movimiento" : "Añadir Nuevo Movimiento"}</SheetTitle>
          <SheetDescription>
            Introduce los detalles de tu transacción. Haz clic en guardar cuando hayas terminado.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
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
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
