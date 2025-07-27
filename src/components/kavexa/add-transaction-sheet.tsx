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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/app-context';
import type { Transaction } from '@/lib/types';

// Base schema for common fields
const baseSchema = z.object({
  type: z.enum(['income', 'egress'], { required_error: 'El tipo es requerido.' }),
  date: z.string().optional(),
});

// Discriminated union key
const INCOME_TYPE = "incomeType";

// Schema for income from product sale
const incomeSaleSchema = baseSchema.extend({
  type: z.literal('income'),
  [INCOME_TYPE]: z.literal('sale'),
  productId: z.string({ required_error: 'Debes seleccionar un producto.' }),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor que 0.'),
});

// Schema for general income
const incomeGeneralSchema = baseSchema.extend({
  type: z.literal('income'),
  [INCOME_TYPE]: z.literal('general'),
  description: z.string().min(1, 'La descripción es requerida.'),
  amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
  category: z.string().min(1, 'La categoría es requerida.'),
});

// Schema for egress
const egressSchema = baseSchema.extend({
    type: z.literal('egress'),
    description: z.string().min(1, 'La descripción es requerida.'),
    category: z.string().min(1, 'La categoría es requerida.'),
    amount: z.coerce.number().positive('El monto debe ser un número positivo.'),
});

// Discriminated union schema
const transactionSchema = z.discriminatedUnion('type', [
  z.discriminatedUnion(INCOME_TYPE, [incomeSaleSchema, incomeGeneralSchema]),
  egressSchema
]);


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
  });

  const transactionType = useWatch({ control: form.control, name: "type", defaultValue: defaultValues?.type || 'egress' });
  const incomeType = useWatch({ control: form.control, name: "incomeType", defaultValue: 'sale' });

  useEffect(() => {
    if (open) {
      setIsEditing(!!defaultValues);
      if (defaultValues) {
        if (defaultValues.type === 'egress') {
          form.reset({
            ...defaultValues,
            date: defaultValues.date.split('T')[0]
          });
        } else if (defaultValues.type === 'income') {
          if (defaultValues.productId) { // It's a sale
             form.reset({
                type: 'income',
                incomeType: 'sale',
                productId: defaultValues.productId,
                quantity: defaultValues.quantity,
                date: defaultValues.date.split('T')[0],
            });
          } else { // It's general income
            form.reset({
                type: 'income',
                incomeType: 'general',
                description: defaultValues.description,
                amount: defaultValues.amount,
                category: defaultValues.category,
                date: defaultValues.date.split('T')[0],
            });
          }
        }
      } else {
        // Default for creation
        form.reset({
          type: 'egress',
          description: '',
          amount: 0,
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, defaultValues, form]);


  function onSubmit(data: TransactionFormValues) {
    let transactionData: Omit<Transaction, 'id'>;

    if (data.type === 'egress') {
      transactionData = {
          ...data,
          date: data.date || new Date().toISOString().split('T')[0],
      };
      toast({
          title: defaultValues ? 'Egreso actualizado' : 'Egreso registrado',
          description: `Se ha guardado "${data.description}".`,
      });
    } else { // Income
      if (data.incomeType === 'sale') {
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
      } else { // General income
          transactionData = {
              type: 'income',
              description: data.description,
              amount: data.amount,
              category: data.category,
              date: data.date || new Date().toISOString().split('T')[0],
          };
          toast({
              title: defaultValues ? 'Ingreso actualizado' : 'Ingreso registrado',
              description: `Se ha guardado "${data.description}".`,
          });
      }
    }

    if (defaultValues) {
        editTransaction({ ...defaultValues, ...transactionData });
    } else {
        addTransaction(transactionData);
    }
    
    form.reset();
    onOpenChange(false);
  }

  const isEgress = transactionType === 'egress';
  const isSale = transactionType === 'income' && incomeType === 'sale';
  const isGeneralIncome = transactionType === 'income' && incomeType === 'general';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
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
                  <FormLabel>Tipo de Movimiento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="egress">Egreso</SelectItem>
                      <SelectItem value="income">Ingreso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {transactionType === 'income' && (
              <FormField
                control={form.control}
                name="incomeType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Ingreso</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isEditing}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sale" />
                          </FormControl>
                          <FormLabel className="font-normal">Venta de Producto</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="general" />
                          </FormControl>
                          <FormLabel className="font-normal">Ingreso General</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isSale && (
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
                              )) : <div className='p-4 text-sm text-muted-foreground'>No hay productos.</div>}
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
            )}

            {(isEgress || isGeneralIncome) && (
              <>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input placeholder={`Ej: ${isEgress ? 'Pago de alquiler' : 'Servicios de consultoría'}`} {...field} />
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
                        <Input placeholder={`Ej: ${isEgress ? 'Suministros' : 'Consultoría'}`} {...field} />
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
