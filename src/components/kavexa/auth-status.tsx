'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export function AuthStatus() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();

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
            <Button variant="ghost" className="w-full justify-start" onClick={login}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Iniciar Sesión</span>
            </Button>
        )}
    </div>
  );
}
