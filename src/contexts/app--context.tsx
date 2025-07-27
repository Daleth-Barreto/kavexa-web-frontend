'use client';

import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, InventoryItem, Alert, AppConfig } from '@/lib/types';
import { mockTransactions, mockInventory, mockAlerts } from '@/lib/data';
import { calculateZScore, Z_SCORE_THRESHOLD } from '@/lib/math-utils';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: (value: Transaction[] | ((val: Transaction[]) => Transaction[])) => void;
  inventory: InventoryItem[];
  setInventory: (value: InventoryItem[] | ((val: InventoryItem[]) => InventoryItem[])) => void;
  alerts: Alert[];
  setAlerts: (value: Alert[] | ((val: Alert[]) => Alert[])) => void;
  config: AppConfig;
  setConfig: (value: AppConfig | ((val: AppConfig) => AppConfig)) => void;
  
  isLoaded: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  clearAllData: () => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions, isTransactionsLoaded] = useLocalStorage<Transaction[]>('kavexa_transactions', mockTransactions);
  const [inventory, setInventory, isInventoryLoaded] = useLocalStorage<InventoryItem[]>('kavexa_inventory', mockInventory);
  const [alerts, setAlerts, isAlertsLoaded] = useLocalStorage<Alert[]>('kavexa_alerts', mockAlerts);
  const [config, setConfig, isConfigLoaded] = useLocalStorage<AppConfig>('kavexa_config', { currency: 'USD' });
  const { toast } = useToast();

  const isLoaded = isTransactionsLoaded && isInventoryLoaded && isAlertsLoaded && isConfigLoaded;

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

    setTransactions(currentTransactions => [newTransaction, ...currentTransactions]);

    // Z-Score Alert Logic for expenses
    if (newTransaction.type === 'egress') {
      const expenseAmounts = [newTransaction, ...transactions]
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

  const clearAllData = useCallback(() => {
    setTransactions([]);
    setInventory([]);
    setAlerts([]);
  }, [setTransactions, setInventory, setAlerts]);

  const setCurrency = useCallback((currency: string) => {
    setConfig(prev => ({ ...prev, currency }));
  }, [setConfig]);

  const value = useMemo(() => ({
    transactions,
    setTransactions,
    inventory,
    setInventory,
    alerts,
    setAlerts,
    config,
    setConfig,
    isLoaded,
    addTransaction,
    editTransaction,
    deleteTransaction,
    clearAllData,
    currency: config.currency,
    setCurrency,
  }), [
    transactions, setTransactions,
    inventory, setInventory,
    alerts, setAlerts,
    config, setConfig,
    isLoaded, addTransaction, editTransaction, deleteTransaction, clearAllData, setCurrency
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

export function useCurrency() {
  const { currency } = useAppContext();

  const formatCurrency = useCallback((amount: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency, ...options }).format(amount);
  }, [currency]);

  return { currency, formatCurrency };
}
