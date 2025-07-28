
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
import { useAppContext } from '@/contexts/app-context';

const alertSchema = z.object({
  message: z.string().min(1, 'El mensaje es requerido.').max(100, 'El mensaje no puede tener más de 100 caracteres.'),
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
        message: ''
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);


  function handleFormSubmit(data: AlertFormValues) {
    addAlert({ message: data.message });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Añadir Nueva Alerta</SheetTitle>
          <SheetDescription>
            Crea un recordatorio o una nota rápida que aparecerá en tu lista de alertas.
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
            <SheetFooter className="pt-4">
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </SheetClose>
              <Button type="submit">Guardar Alerta</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
