import type { Transaction, InventoryItem, Alert, Subscription, Client, Provider, ModuleKey } from './types';

export const mockTransactions: Transaction[] = [];
export const mockInventory: InventoryItem[] = [];
export const mockAlerts: Alert[] = [];
export const mockSubscriptions: Subscription[] = [];
export const mockClients: Client[] = [];
export const mockProviders: Provider[] = [];


export const ALL_MODULES: { id: ModuleKey, title: string, description: string, href: string }[] = [
    { id: 'inicio', title: 'Inicio', description: 'Dashboard principal con resúmenes.', href: '/inicio' },
    { id: 'movimientos', title: 'Movimientos', description: 'Registra ingresos y egresos.', href: '/movimientos' },
    { id: 'pos', title: 'Punto de Venta', description: 'Interfaz rápida para ventas.', href: '/pos' },
    { id: 'inventario', title: 'Inventario', description: 'Controla tu stock de productos.', href: '/inventario' },
    { id: 'clientes', title: 'Clientes', description: 'Administra tu base de clientes.', href: '/clientes' },
    { id: 'proveedores', title: 'Proveedores', description: 'Administra tus proveedores.', href: '/proveedores' },
    { id: 'suscripciones', title: 'Suscripciones', description: 'Pagos y gastos recurrentes.', href: '/suscripciones' },
    { id: 'demanda', title: 'Análisis de Demanda', description: 'Analiza la rotación de productos.', href: '/demanda' },
    { id: 'proyeccion', title: 'Proyección Financiera', description: 'Estima tu flujo de caja futuro.', href: '/proyeccion' },
    { id: 'alertas', title: 'Alertas y Notificaciones', description: 'Avisos importantes del sistema.', href: '/alertas' },
    { id: 'reportes', title: 'Reportes', description: 'Genera informes detallados.', href: '/reportes' },
];

export const getDefaultModuleConfig = (): Record<ModuleKey, boolean> => {
    const config: any = {};
    ALL_MODULES.forEach(module => {
        config[module.id] = true; // Enable all by default
    });
    return config;
};
