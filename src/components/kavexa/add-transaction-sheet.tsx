'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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


// Base schema for common fields
const baseSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: 'El tipo es requerido.' }),
  date: z.string().optional(),
});

// Schema for income (Venta)
const incomeSchema = baseSchema.extend({
  type: z.literal('income'),
  productId: z.string({ required_error: 'Debes seleccionar un producto.' }),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor que 0.'),
});

// Schema for expense (Gasto)
const expenseSchema = baseSchema.extend({
    type: z.literal('expense'),
    description: z.string().min(1, 'La descripción es requerida.'),
    category: z.string().min(1, 'La categoría es requerida.'),
    amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
});

// Discriminated union schema
const transactionSchema = z.discriminatedUnion('type', [incomeSchema, expenseSchema]);


type TransactionFormValues = z.infer<typeof transactionSchema>;

type AddTransactionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: Transaction | null;
};

export function AddTransactionSheet({ open, onOpenChange, defaultValues }: AddTransactionSheetProps) {
  const { toast } = useToast();
  const { inventory, addTransaction, editTransaction } = useAppContext();
  const [ isEditing, setIsEditing ] = useState(false);
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    // We'll set default values inside useEffect
  });

  const transactionType = useWatch({
    control: form.control,
    name: "type",
    defaultValue: defaultValues?.type || 'expense',
  });

  const selectedProductId = useWatch({
    control: form.control,
    name: "productId",
  });
   const quantity = useWatch({
    control: form.control,
    name: "quantity",
  });

  useEffect(() => {
    if (open) {
       setIsEditing(!!defaultValues);
      if (defaultValues) {
        // Since we can't edit a sale's product or quantity easily without complex stock logic,
        // editing is limited to expenses. In a real app, this would need more thought.
        if (defaultValues.type === 'expense') {
            form.reset({
                ...defaultValues,
                date: defaultValues.date.split('T')[0]
            });
        } else {
             // For simplicity, we disable editing for income transactions
            form.reset({
                type: 'income',
                productId: defaultValues.productId,
                quantity: defaultValues.quantity
            });
        }
      } else {
        // Default for creation
        form.reset({
          type: 'expense',
          description: '',
          amount: 0,
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, defaultValues, form]);

  useEffect(() => {
    if (transactionType === 'income' && selectedProductId && quantity > 0) {
      const product = inventory.find(p => p.id === selectedProductId);
      if (product) {
        const totalAmount = product.price * quantity;
        // We don't set this on the form to avoid zod errors
        // It will be calculated on submit
      }
    }
  }, [selectedProductId, quantity, transactionType, inventory, form]);


  function onSubmit(data: TransactionFormValues) {
    if (defaultValues && data.type === 'expense') {
      // Edit Expense
      editTransaction({
        ...defaultValues,
        ...data
      });
      toast({
        title: 'Transacción actualizada',
        description: `Se ha actualizado "${data.description}".`,
      });
    } else {
      // Create Transaction
      let transactionData: Omit<Transaction, 'id'>;

      if (data.type === 'income') {
        const product = inventory.find(p => p.id === data.productId);
        if (!product) {
          toast({ title: 'Error', description: 'Producto no encontrado.', variant: 'destructive' });
          return;
        }
        if (data.quantity > product.stock) {
           toast({ title: 'Stock insuficiente', description: `No puedes vender ${data.quantity} unidades de ${product.name}. Solo hay ${product.stock} disponibles.`, variant: 'destructive' });
           form.setError('quantity', { message: `Máximo: ${product.stock}`});
           return;
        }

        transactionData = {
            type: 'income',
            description: `Venta de ${product.name} (x${data.quantity})`,
            amount: product.price * data.quantity,
            category: 'Ventas',
            date: data.date || new Date().toISOString().split('T')[0],
            productId: data.productId,
            quantity: data.quantity,
        };
         toast({
            title: 'Venta registrada',
            description: `Se ha vendido ${data.quantity} x ${product.name}.`,
        });

      } else {
         transactionData = {
            ...data,
            date: data.date || new Date().toISOString().split('T')[0],
        };
         toast({
            title: 'Gasto registrado',
            description: `Se ha añadido "${data.description}" a tus movimientos.`,
        });
      }

      addTransaction(transactionData);
    }

    form.reset();
    onOpenChange(false);
  }

  const isSale = transactionType === 'income';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Editar Movimiento" : "Añadir Nuevo Movimiento"}</SheetTitle>
          <SheetDescription>
            Introduce los detalles de tu transacción. Haz clic en guardar cuando hayas terminado.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Gasto</SelectItem>
                      <SelectItem value="income">Venta (Ingreso)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isSale ? (
                <>
                <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Producto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un producto a vender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {inventory.length > 0 ? inventory.map(item => (
                                <SelectItem key={item.id} value={item.id} disabled={item.stock <= 0}>
                                  {item.name} (Stock: {item.stock})
                                </SelectItem>
                            )) : <div className='p-4 text-sm text-muted-foreground'>No hay productos en el inventario.</div>}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cantidad a vender</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} disabled={isEditing} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Gasto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Pago de alquiler" {...field} />
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Suministros" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
              <Button type="submit" disabled={isEditing && isSale}>Guardar</Button>
            </SheetFooter>
             {isEditing && isSale && <p className="text-xs text-muted-foreground text-center pt-2">La edición de ventas no está permitida para mantener la consistencia del inventario.</p>}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
