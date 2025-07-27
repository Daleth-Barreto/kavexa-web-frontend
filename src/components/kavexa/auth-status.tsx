'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function AuthStatus() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLoginClick = () => {
     toast({
        title: "Función no disponible",
        description: "El sistema de cuentas y guardado en la nube estará disponible próximamente.",
    });
    router.push('/login');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-2">
        {isAuthenticated ? (
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
            </Button>
        ) : (
            <Button variant="ghost" className="w-full justify-start" onClick={handleLoginClick}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Iniciar Sesión</span>
            </Button>
        )}
    </div>
  );
}
