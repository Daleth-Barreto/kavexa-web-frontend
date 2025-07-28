
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/app-context';
import type { Alert } from '@/lib/types';


const alertSchema = z.object({
  message: z.string().min(1, 'El mensaje es requerido.').max(100, 'El mensaje no puede tener más de 100 caracteres.'),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']).optional().default('none'),
});

type AlertFormValues = z.infer<typeof alertSchema>;

type AddAlertSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAlertSheet({ open, onOpenChange }: AddAlertSheetProps) {
  const { addAlert } = useAppContext();
  
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
        message: '',
        recurrence: 'none',
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);


  function handleFormSubmit(data: AlertFormValues) {
    addAlert({ message: data.message, recurrence: data.recurrence as Alert['recurrence'] });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Añadir Nuevo Recordatorio</SheetTitle>
          <SheetDescription>
            Crea un recordatorio o una nota rápida. Puedes hacer que se repita con la frecuencia que necesites.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje del recordatorio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Llamar al proveedor de café antes de las 5pm."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Repetir</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una frecuencia" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="none">Nunca</SelectItem>
                            <SelectItem value="daily">Diariamente</SelectItem>
                            <SelectItem value="weekly">Semanalmente</SelectItem>
                            <SelectItem value="monthly">Mensualmente</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
             />
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
              <Button type="submit">Guardar Recordatorio</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
