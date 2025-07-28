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
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ALL_MODULES } from '@/lib/data';
import { useAppContext } from '@/contexts/app-context';

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

  const enabledModules = ALL_MODULES.filter(module => config.enabledModules[module.id]);

  return (
    <SidebarMenu>
      {enabledModules.map((item) => {
        const Icon = icons[item.id] || Home;
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.title}</span>
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
    const item = { href: '/perfil', label: 'Perfil y Configuración', icon: UserCog };
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
