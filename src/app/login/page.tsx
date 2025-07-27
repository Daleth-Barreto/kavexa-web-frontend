'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Introduce un email válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Aquí iría la llamada a la API
    console.log('Login data:', data);
    // Simular login exitoso
    login();
    router.push('/inicio');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Kavexa</span>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Iniciar Sesión
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="underline">
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
