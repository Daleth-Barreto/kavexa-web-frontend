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
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { href: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { href: '/inventario', label: 'Inventario', icon: Archive },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/suscripciones', label: 'Suscripciones', icon: Repeat },
  { href: '/demanda', label: 'Demanda', icon: LineChart },
  { href: '/proyeccion', label: 'Proyección', icon: TrendingUp },
  { href: '/alertas', label: 'Alertas', icon: Bell },
  { href: '/reportes', label: 'Reportes', icon: FileDown },
];

export function MainNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        return (
          <SidebarMenuItem key={item.href}>
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
