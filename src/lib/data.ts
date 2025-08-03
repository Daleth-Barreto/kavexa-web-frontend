
import type { Transaction, InventoryItem, Alert, Subscription, Client, Provider, ModuleKey } from './types';
import { subDays, format } from 'date-fns';

const today = new Date();

// Helper para crear fechas relativas al día de hoy
const getDate = (daysAgo: number) => format(subDays(today, daysAgo), 'yyyy-MM-dd');

export const mockInventory: InventoryItem[] = [
    { id: 'item-1', name: 'Café en Grano 250g', stock: 5000, lowStockThreshold: 100, price: 12.50 },
    { id: 'item-2', name: 'Leche de Almendras 1L', stock: 250, lowStockThreshold: 50, price: 3.50 },
    { id: 'item-3', name: 'Taza de Cerámica', stock: 150, lowStockThreshold: 20, price: 15.00 },
    { id: 'item-4', name: 'Croissant de Mantequilla', stock: 330, lowStockThreshold: 50, price: 2.75 },
    { id: 'item-5', name: 'Bolsa de Tela Reutilizable', stock: 500, lowStockThreshold: 50, price: 8.00 },
];

const coffeeSales: Transaction[] = [];
for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 45) + 1; // Ventas en los últimos 45 días
    const quantity = Math.floor(Math.random() * 80) + 20; // Vender entre 20 y 100 unidades
    const coffeePrice = mockInventory.find(p => p.id === 'item-1')!.price;
    coffeeSales.push({
        id: `txn-coffee-${i}`,
        date: getDate(daysAgo),
        description: `Venta Corporativa: Café en Grano 250g (x${quantity})`,
        amount: coffeePrice * quantity,
        type: 'income',
        category: 'Ventas Corporativas',
        productId: 'item-1',
        quantity: quantity,
        clientId: `client-${(i % 3) + 1}`
    });
}

export const mockTransactions: Transaction[] = [
    // --- Ventas de Café en Grano (Más fuerte los Lunes - simulado) ---
    { id: 'txn-1', date: getDate(0), description: 'Venta: Café en Grano 250g (x2)', amount: 25.00, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 2, clientId: 'client-1' },
    { id: 'txn-2', date: getDate(1), description: 'Venta: Taza de Cerámica (x1)', amount: 15.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 1 },
    { id: 'txn-3', date: getDate(2), description: 'Venta: Croissant de Mantequilla (x5)', amount: 13.75, type: 'income', category: 'Ventas', productId: 'item-4', quantity: 5, clientId: 'client-2' },
    { id: 'txn-4', date: getDate(5), description: 'Venta: Leche de Almendras 1L (x3)', amount: 10.50, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 3 },
    { id: 'txn-5', date: getDate(6), description: 'Venta: Bolsa de Tela Reutilizable (x2)', amount: 16.00, type: 'income', category: 'Ventas', productId: 'item-5', quantity: 2 },
    { id: 'txn-6', date: getDate(7), description: 'Venta: Café en Grano 250g (x3)', amount: 37.50, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 3, clientId: 'client-3' },
    { id: 'txn-7', date: getDate(8), description: 'Venta: Taza de Cerámica (x2)', amount: 30.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 2 },
    { id: 'txn-8', date: getDate(12), description: 'Venta: Leche de Almendras 1L (x4)', amount: 14.00, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 4 },
    { id: 'txn-9', date: getDate(14), description: 'Venta: Café en Grano 250g (x4)', amount: 50.00, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 4, clientId: 'client-1' },
    { id: 'txn-10', date: getDate(15), description: 'Venta: Croissant de Mantequilla (x3)', amount: 8.25, type: 'income', category: 'Ventas', productId: 'item-4', quantity: 3 },
    { id: 'txn-11', date: getDate(20), description: 'Venta: Leche de Almendras 1L (x5)', amount: 17.50, type: 'income', category: 'Ventas', productId: 'item-2', quantity: 5, clientId: 'client-2' },
    { id: 'txn-12', date: getDate(21), description: 'Venta: Café en Grano 250g (x2)', amount: 25.00, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 2 },
    { id: 'txn-13', date: getDate(22), description: 'Venta: Taza de Cerámica (x3)', amount: 45.00, type: 'income', category: 'Ventas', productId: 'item-3', quantity: 3, clientId: 'client-3' },
    { id: 'txn-14', date: getDate(25), description: 'Servicios de consultoría', amount: 500.00, type: 'income', category: 'Servicios' },
    { id: 'txn-15', date: getDate(28), description: 'Venta: Café en Grano 250g (x1)', amount: 12.50, type: 'income', category: 'Ventas', productId: 'item-1', quantity: 1 },
    { id: 'txn-16', date: getDate(29), description: 'Venta: Bolsa de Tela Reutilizable (x3)', amount: 24.00, type: 'income', category: 'Ventas', productId: 'item-5', quantity: 3 },

    // --- Egresos ---
    { id: 'txn-17', date: getDate(2), description: 'Pago de servicio de internet', amount: 50.00, type: 'egress', category: 'Servicios' },
    { id: 'txn-18', date: getDate(5), description: 'Compra de leche y azúcar', amount: 35.00, type: 'egress', category: 'Suministros' },
    { id: 'txn-19', date: getDate(10), description: 'Publicidad en redes sociales', amount: 75.00, type: 'egress', category: 'Marketing' },
    { id: 'txn-20', date: getDate(15), description: 'Compra de granos de café', amount: 150.00, type: 'egress', category: 'Suministros', },
    { id: 'txn-21', date: getDate(20), description: 'Material de oficina', amount: 25.00, type: 'egress', category: 'Oficina' },
    { id: 'txn-22', date: getDate(25), description: 'Reparación de cafetera', amount: 120.00, type: 'egress', category: 'Mantenimiento' },
    { id: 'txn-23', date: getDate(30), description: 'Pago de nómina', amount: 1200.00, type: 'egress', category: 'Nómina' },
    // AÑADIR LAS VENTAS MASIVAS DE CAFÉ
    ...coffeeSales,
];

export const mockAlerts: Alert[] = [];

export const mockSubscriptions: Subscription[] = [
    { id: 'sub-1', name: 'Servicio de Software', amount: 45, category: 'Software', paymentDay: 15, lastPaidMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1, lastPaidYear: today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear() },
    { id: 'sub-2', name: 'Alquiler de local', amount: 800, category: 'Renta', paymentDay: 1, lastPaidMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1, lastPaidYear: today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear()},
    { id: 'sub-3', name: 'Plan de Teléfono', amount: 30, category: 'Servicios', paymentDay: 20, lastPaidMonth: today.getMonth() === 0 ? 11 : today.getMonth() - 1, lastPaidYear: today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear() },
];

export const mockClients: Client[] = [
    { id: 'client-1', name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234', status: 'active', lastPurchaseDate: getDate(0) },
    { id: 'client-2', name: 'Ana Gómez', email: 'ana.gomez@email.com', phone: '555-5678', status: 'active', lastPurchaseDate: getDate(3) },
    { id: 'client-3', name: 'Carlos Sánchez', email: 'carlos.sanchez@email.com', phone: '555-8765', status: 'active', lastPurchaseDate: getDate(7) },
    { id: 'client-4', name: 'Laura Fernández', email: 'laura.f@email.com', phone: '555-4321', status: 'inactive', lastPurchaseDate: '2023-11-10' },
];

export const mockProviders: Provider[] = [
    { id: 'prov-1', name: 'Cafetalera del Sur', contact: 'Carlos Rodriguez', phone: '111-222-3333'},
    { id: 'prov-2', name: 'Lácteos del Valle', contact: 'Sofía Ramirez', phone: '444-555-6666'},
    { id: 'prov-3', name: 'Empaques Ecológicos', contact: 'Mariana Torres', phone: '777-888-9999'},
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

    
