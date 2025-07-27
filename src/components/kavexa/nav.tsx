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
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/inicio', label: 'Inicio', icon: Home, auth: false },
  { href: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, auth: false },
  { href: '/proyeccion', label: 'Proyección', icon: TrendingUp, auth: false },
  { href: '/alertas', label: 'Alertas', icon: Bell, auth: false },
  { href: '/inventario', label: 'Inventario', icon: Archive, auth: false },
  { href: '/demanda', label: 'Demanda', icon: LineChart, auth: false },
  { href: '/reportes', label: 'Reportes', icon: FileDown, auth: true },
];

export function MainNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <SidebarMenu>
      {menuItems.map((item) => {
        if (item.auth && !isAuthenticated) return null;
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
