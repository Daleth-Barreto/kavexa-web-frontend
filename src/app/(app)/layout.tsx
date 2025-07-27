
'use client';

import { MainNav, SettingsNav } from '@/components/kavexa/nav';
import { AuthStatus } from '@/components/kavexa/auth-status';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Loader2, Zap } from 'lucide-react';
import { AppProvider, useAppContext } from '@/contexts/app-context';


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-4 text-2xl font-headline font-semibold animate-pulse">
            <Zap className="h-8 w-8 text-primary" />
            <span>Kavexa</span>
        </div>
        <p className="mt-4 text-muted-foreground">Cargando tus datos...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground font-headline">Kavexa</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <SettingsNav />
          <AuthStatus />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AppProvider>
  );
}

