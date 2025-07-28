
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/app-context';
import type { Alert } from '@/lib/types';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '../ui/input';

const alertSchema = z.object({
  message: z.string().min(1, 'El mensaje es requerido.').max(100, 'El mensaje no puede tener más de 100 caracteres.'),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']).optional().default('none'),
  date: z.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora no válido.').optional(),
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
        date: new Date(),
        time: format(new Date(), 'HH:mm'),
    }
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        message: '',
        recurrence: 'none',
        date: new Date(),
        time: format(new Date(), 'HH:mm'),
      });
    }
  }, [open, form]);


  function handleFormSubmit(data: AlertFormValues) {
    const combinedDate = new Date(data.date);
    if (data.time) {
        const [hours, minutes] = data.time.split(':').map(Number);
        combinedDate.setHours(hours, minutes, 0, 0);
    }
    
    const alertData: Omit<Alert, 'id' | 'status' | 'type'> = {
        message: data.message,
        recurrence: data.recurrence as Alert['recurrence'],
        date: combinedDate.toISOString(),
    };

    addAlert(alertData);
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
            <div className="flex gap-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col flex-1">
                        <FormLabel>Fecha</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                ) : (
                                    <span>Elige una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem className="flex flex-col flex-1">
                        <FormLabel>Hora</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
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
