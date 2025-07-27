'use client';

import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, InventoryItem, Alert, CashFlowData } from '@/lib/types';
import { mockTransactions, mockInventory, mockAlerts, mockCashFlow } from '@/lib/data';
import { calculateZScore, Z_SCORE_THRESHOLD } from '@/lib/math-utils';
import { useToast } from '@/hooks/use-toast';

// IDs from old mock data to ensure they are cleaned up
const MOCK_ALERT_IDS_TO_CLEAN = [
  "alert-1",
  "alert-2",
  "alert-3",
  "alert-4",
  "alert-5",
];

interface AppContextType {
  transactions: Transaction[];
  setTransactions: (value: Transaction[] | ((val: Transaction[]) => Transaction[])) => void;
  inventory: InventoryItem[];
  setInventory: (value: InventoryItem[] | ((val: InventoryItem[]) => InventoryItem[])) => void;
  alerts: Alert[];
  setAlerts: (value: Alert[] | ((val: Alert[]) => Alert[])) => void;
  cashFlow: CashFlowData[];
  setCashFlow: (value: CashFlowData[] | ((val: CashFlowData[]) => CashFlowData[])) => void;
  isLoaded: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions, isTransactionsLoaded] = useLocalStorage<Transaction[]>('kavexa_transactions', mockTransactions);
  const [inventory, setInventory, isInventoryLoaded] = useLocalStorage<InventoryItem[]>('kavexa_inventory', mockInventory);
  const [alerts, setAlerts, isAlertsLoaded] = useLocalStorage<Alert[]>('kavexa_alerts', mockAlerts);
  const [cashFlow, setCashFlow, isCashFlowLoaded] = useLocalStorage<CashFlowData[]>('kavexa_cashflow', mockCashFlow);
  const { toast } = useToast();

  const isLoaded = isTransactionsLoaded && isInventoryLoaded && isAlertsLoaded && isCashFlowLoaded;

  useEffect(() => {
    // This effect runs once on load to clean up any persisted mock data from localStorage
    if (isAlertsLoaded) {
      const hasOldMockData = alerts.some(alert => MOCK_ALERT_IDS_TO_CLEAN.includes(alert.id));
      if (hasOldMockData) {
        setAlerts([]); // Clear the alerts if old mock data is found
      }
    }
    if (isTransactionsLoaded && transactions.length > 0 && transactions[0]?.id?.startsWith('txn-mock')) {
       setTransactions([]);
    }
    if (isInventoryLoaded && inventory.length > 0 && inventory[0]?.id?.startsWith('item-mock')) {
       setInventory([]);
    }
  }, [isLoaded, isAlertsLoaded, isTransactionsLoaded, isInventoryLoaded, setAlerts, setTransactions, setInventory, alerts, transactions, inventory]);


  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: data.date ? data.date : new Date().toISOString().split('T')[0],
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      productId: data.productId,
      quantity: data.quantity
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // Z-Score Alert Logic for expenses
    if (newTransaction.type === 'egress') {
      const expenseAmounts = updatedTransactions
        .filter(t => t.type === 'egress')
        .map(t => t.amount);
      
      if (expenseAmounts.length > 5) { // Only run if we have enough data
        const zScore = calculateZScore(newTransaction.amount, expenseAmounts);
        if (Math.abs(zScore) > Z_SCORE_THRESHOLD) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: 'unusual_expense',
            message: `Egreso inusual detectado: ${newTransaction.description} por $${newTransaction.amount.toFixed(2)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'new',
            relatedId: newTransaction.id,
          };
          setAlerts(prev => [newAlert, ...prev]);
           toast({
            title: 'Alerta generada',
            description: `Se detectó un egreso inusualmente alto.`,
            variant: 'destructive'
          });
        }
      }
    }
    
    // Inventory update logic for income from sales
    if (newTransaction.type === 'income' && newTransaction.productId && newTransaction.quantity) {
        const productId = newTransaction.productId;
        const quantitySold = newTransaction.quantity;
        
        setInventory(currentInventory => {
            return currentInventory.map(item => {
                if (item.id === productId) {
                    const newStock = item.stock - quantitySold;
                    
                    // Low stock alert logic
                    if (newStock <= item.lowStockThreshold && item.stock > item.lowStockThreshold) {
                         const newAlert: Alert = {
                            id: `alert-stock-${Date.now()}`,
                            type: 'low_stock',
                            message: `Nivel de stock bajo para ${item.name}`,
                            date: new Date().toISOString().split('T')[0],
                            status: 'new',
                            relatedId: item.id,
                        };
                        setAlerts(prev => [newAlert, ...prev]);
                        toast({
                            title: 'Alerta de Inventario',
                            description: `El producto "${item.name}" tiene pocas unidades.`,
                        });
                    }
                    return { ...item, stock: newStock };
                }
                return item;
            });
        });
    }

  }, [transactions, setTransactions, setAlerts, setInventory, toast]);

  const editTransaction = useCallback((updatedTransaction: Transaction) => {
    // Note: Editing transactions does not currently revert stock changes. 
    // This could be complex to implement and might require a more advanced transaction model.
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  }, [setTransactions]);

  const deleteTransaction = useCallback((transactionId: string) => {
     // Note: Deleting transactions does not currently revert stock changes.
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  }, [setTransactions]);


  const value = useMemo(() => ({
    transactions,
    setTransactions,
    inventory,
    setInventory,
    alerts,
    setAlerts,
    cashFlow,
    setCashFlow,
    isLoaded,
    addTransaction,
    editTransaction,
    deleteTransaction
  }), [
    transactions, setTransactions,
    inventory, setInventory,
    alerts, setAlerts,
    cashFlow, setCashFlow,
    isLoaded, addTransaction, editTransaction, deleteTransaction
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
