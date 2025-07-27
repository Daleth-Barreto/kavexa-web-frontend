'use client';

import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, InventoryItem, Alert, CashFlowData } from '@/lib/types';
import { mockTransactions, mockInventory, mockAlerts, mockCashFlow } from '@/lib/data';
import { calculateZScore, Z_SCORE_THRESHOLD } from '@/lib/math-utils';

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
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions, isTransactionsLoaded] = useLocalStorage<Transaction[]>('kavexa_transactions', mockTransactions);
  const [inventory, setInventory, isInventoryLoaded] = useLocalStorage<InventoryItem[]>('kavexa_inventory', mockInventory);
  const [alerts, setAlerts, isAlertsLoaded] = useLocalStorage<Alert[]>('kavexa_alerts', mockAlerts);
  const [cashFlow, setCashFlow, isCashFlowLoaded] = useLocalStorage<CashFlowData[]>('kavexa_cashflow', mockCashFlow);

  const isLoaded = isTransactionsLoaded && isInventoryLoaded && isAlertsLoaded && isCashFlowLoaded;

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Z-Score Alert Logic
    if (newTransaction.type === 'expense') {
      const expenseAmounts = transactions
        .filter(t => t.type === 'expense')
        .map(t => t.amount);
      
      if (expenseAmounts.length > 5) { // Only run if we have enough data
        const zScore = calculateZScore(newTransaction.amount, expenseAmounts);
        if (zScore > Z_SCORE_THRESHOLD) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: 'unusual_expense',
            message: `Gasto inusual detectado: ${newTransaction.description} por $${newTransaction.amount.toFixed(2)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'new',
            relatedId: newTransaction.id,
          };
          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    }
  }, [transactions, setTransactions, setAlerts]);


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
  }), [
    transactions, setTransactions,
    inventory, setInventory,
    alerts, setAlerts,
    cashFlow, setCashFlow,
    isLoaded, addTransaction
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
