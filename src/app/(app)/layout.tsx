
'use client';
import { useEffect } from 'react';
import { MainNav, SettingsNav, LanguageSwitcher } from '@/components/kavexa/nav';
import { AuthStatus } from '@/components/kavexa/auth-status';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { AppProvider, useAppContext } from '@/contexts/app-context';
import { useRouter } from 'next/navigation';
import { KavexaLogoIcon } from '@/components/kavexa/kavexa-logo-icon';
import { useI18n } from '@/contexts/i18n-context';


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoaded, config } = useAppContext();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !config.onboardingComplete) {
      router.replace('/welcome');
    }
  }, [isLoaded, config.onboardingComplete, router]);

  if (!isLoaded || (isLoaded && !config.onboardingComplete)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-4 text-2xl font-headline font-semibold animate-pulse">
            <KavexaLogoIcon className="h-8 w-8 text-primary" />
            <span>Kavexa</span>
        </div>
        <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <KavexaLogoIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground font-headline">Kavexa</span>
          </div>
        </SidebarHeader>
        <SidebarContent data-tour-step="1">
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <LanguageSwitcher />
          <SidebarSeparator />
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
