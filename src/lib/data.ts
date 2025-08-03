
import type { Transaction, InventoryItem, Alert, Subscription, Client, Provider, ModuleKey } from './types';

export const mockInventory: InventoryItem[] = [
    { id: 'item-1', name: 'Café en Grano 250g', stock: 50, lowStockThreshold: 10, price: 12.50 },
    { id: 'item-2', name: 'Leche de Almendras 1L', stock: 30, lowStockThreshold: 5, price: 3.50 },
    { id: 'item-3', name: 'Taza de Cerámica', stock: 20, lowStockThreshold: 5, price: 15.00 },
    { id: 'item-4', name: 'Croissant de Mantequilla', stock: 40, lowStockThreshold: 10, price: 2.75 },
];

export const mockTransactions: Transaction[] = [
    // --- Ventas de Café en Grano (Más fuerte los Lunes) ---
    { id: 'txn-1', date: '2024-07-29', description: 'Venta: Café en Grano 250g (x2)', amount: 25.00, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 2 },
    { id: 'txn-2', date: '2024-07-29', description: 'Venta: Café en Grano 250g (x3)', amount: 37.50, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 3 },
    { id: 'txn-3', date: '2024-07-30', description: 'Venta: Café en Grano 250g (x1)', amount: 12.50, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 1 },
    { id: 'txn-4', date: '2024-08-05', description: 'Venta: Café en Grano 250g (x4)', amount: 50.00, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 4 },
    
    // --- Ventas de Leche de Almendras (Más fuerte los Viernes) ---
    { id: 'txn-5', date: '2024-08-02', description: 'Venta: Leche de Almendras 1L (x5)', amount: 17.50, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 5 },
    { id: 'txn-6', date: '2024-08-01', description: 'Venta: Leche de Almendras 1L (x2)', amount: 7.00, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 2 },
    { id: 'txn-7', date: '2024-08-09', description: 'Venta: Leche de Almendras 1L (x6)', amount: 21.00, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 6 },
    
    // --- Ventas de Tazas (Más fuerte los Domingos) ---
    { id: 'txn-8', date: '2024-07-28', description: 'Venta: Taza de Cerámica (x2)', amount: 30.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 2 },
    { id: 'txn-9', date: '2024-08-04', description: 'Venta: Taza de Cerámica (x3)', amount: 45.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 3 },
    { id: 'txn-10', date: '2024-08-03', description: 'Venta: Taza de Cerámica (x1)', amount: 15.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 1 },

    // --- Egresos ---
    { id: 'txn-11', date: '2024-07-25', description: 'Compra de granos de café', amount: 150.00, type: 'egress', category: 'Suministros' },
    { id: 'txn-12', date: '2024-08-01', description: 'Pago de servicio de internet', amount: 50.00, type: 'egress', category: 'Servicios' },
];

export const mockAlerts: Alert[] = [];

export const mockSubscriptions: Subscription[] = [
    { id: 'sub-1', name: 'Servicio de Software', amount: 45, category: 'Software', paymentDay: 15, lastPaidMonth: 6, lastPaidYear: 2024 },
    { id: 'sub-2', name: 'Alquiler de local', amount: 800, category: 'Renta', paymentDay: 1, lastPaidMonth: 6, lastPaidYear: 2024 },
];

export const mockClients: Client[] = [
    { id: 'client-1', name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234', status: 'active', lastPurchaseDate: '2024-08-04' },
    { id: 'client-2', name: 'Ana Gómez', email: 'ana.gomez@email.com', phone: '555-5678', status: 'active', lastPurchaseDate: '2024-08-05' },
];

export const mockProviders: Provider[] = [
    { id: 'prov-1', name: 'Cafetalera del Sur', contact: 'Carlos Rodriguez', phone: '111-222-3333'},
    { id: 'prov-2', name: 'Lácteos del Valle', contact: 'Sofía Ramirez', phone: '444-555-6666'},
];


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
