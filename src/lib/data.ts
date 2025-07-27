import type { Transaction, InventoryItem, Alert, CashFlowData } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-05-01', description: 'Venta de Producto A', amount: 1500, type: 'income', category: 'Ventas' },
  { id: '2', date: '2024-05-01', description: 'Compra de material de oficina', amount: 75, type: 'expense', category: 'Gastos de Oficina' },
  { id: '3', date: '2024-05-02', description: 'Pago de servicio de internet', amount: 50, type: 'expense', category: 'Servicios' },
  { id: '4', date: '2024-05-03', description: 'Venta de Producto B', amount: 800, type: 'income', category: 'Ventas' },
  { id: '5', date: '2024-05-04', description: 'Alquiler de local', amount: 1200, type: 'expense', category: 'Alquiler' },
  { id: '6', date: '2024-05-05', description: 'Consultoría', amount: 2500, type: 'income', category: 'Servicios Profesionales' },
  { id: '7', date: '2024-05-06', description: 'Publicidad en redes sociales', amount: 200, type: 'expense', category: 'Marketing' },
  { id: '8', date: '2024-05-07', description: 'Venta de Producto C', amount: 1250, type: 'income', category: 'Ventas' },
];

export const mockInventory: InventoryItem[] = [
  { id: 'p1', name: 'Producto A', stock: 5, lowStockThreshold: 10, price: 50 },
  { id: 'p2', name: 'Producto B', stock: 25, lowStockThreshold: 10, price: 30 },
  { id: 'p3', name: 'Producto C', stock: 12, lowStockThreshold: 15, price: 70 },
  { id: 'p4', name: 'Producto D', stock: 80, lowStockThreshold: 20, price: 15 },
  { id: 'p5', name: 'Producto E', stock: 2, lowStockThreshold: 5, price: 150 },
];

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'low_stock', message: 'Nivel de stock bajo para Producto A', date: '2024-05-04', status: 'new', relatedId: 'p1' },
  { id: 'a2', type: 'low_stock', message: 'Nivel de stock bajo para Producto E', date: '2024-05-05', status: 'new', relatedId: 'p5' },
  { id: 'a3', type: 'unusual_expense', message: 'Gasto inusual detectado: Compra de software', date: '2024-05-03', status: 'new' },
  { id: 'a4', type: 'duplicate_entry', message: 'Posible entrada duplicada para "Pago de Alquiler"', date: '2024-05-02', status: 'ignored' },
  { id: 'a5', type: 'low_stock', message: 'Producto C casi sin stock', date: '2024-05-06', status: 'resolved', relatedId: 'p3' },
];

export const mockCashFlow: CashFlowData[] = [
  { date: '2024-06-01', balance: 5000 },
  { date: '2024-06-15', balance: 4500 },
  { date: '2024-06-30', balance: 6000 },
  { date: '2024-07-15', balance: 5800 },
  { date: '2024-07-30', balance: 7200 },
  { date: '2024-08-15', balance: 6900 },
  { date: '2024-08-30', balance: 8500 },
];
