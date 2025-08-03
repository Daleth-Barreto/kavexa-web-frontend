
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ArrowLeftRight,
  TrendingUp,
  Bell,
  Archive,
  LineChart,
  FileDown,
  UserCog,
  Repeat,
  ShoppingCart,
  Users,
  Truck,
  Languages,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ALL_MODULES } from '@/lib/data';
import { useAppContext } from '@/contexts/app-context';
import { useI18n } from '@/contexts/i18n-context';
import { Button } from '../ui/button';

const icons: Record<string, React.ElementType> = {
    inicio: Home,
    movimientos: ArrowLeftRight,
    pos: ShoppingCart,
    inventario: Archive,
    clientes: Users,
    proveedores: Truck,
    suscripciones: Repeat,
    demanda: LineChart,
    proyeccion: TrendingUp,
    alertas: Bell,
    reportes: FileDown,
};

export function MainNav() {
  const pathname = usePathname();
  const { config } = useAppContext();
  const { t } = useI18n();

  const enabledModules = ALL_MODULES.filter(module => config.enabledModules[module.id]);

  return (
    <SidebarMenu>
      {enabledModules.map((item) => {
        const Icon = icons[item.id] || Home;
        const title = t(`nav.${item.id}`);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={title}
            >
              <Link href={item.href}>
                <Icon />
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  );
}

export function SettingsNav() {
    const pathname = usePathname();
    const { t } = useI18n();
    const item = { href: '/perfil', label: t('nav.perfil'), icon: UserCog };
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export function LanguageSwitcher() {
    const { locale, toggleLocale } = useI18n();
  
    return (
      <div className="px-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleLocale}
        >
          <Languages className="mr-2 h-4 w-4" />
          <span>{locale === 'es' ? 'English' : 'Español'}</span>
        </Button>
      </div>
    );
  }
