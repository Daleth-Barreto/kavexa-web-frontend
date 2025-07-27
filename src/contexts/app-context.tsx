'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, InventoryItem, Alert, CashFlowData } from '@/lib/types';
import { mockTransactions, mockInventory, mockAlerts, mockCashFlow } from '@/lib/data';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions, isTransactionsLoaded] = useLocalStorage<Transaction[]>('kavexa_transactions', mockTransactions);
  const [inventory, setInventory, isInventoryLoaded] = useLocalStorage<InventoryItem[]>('kavexa_inventory', mockInventory);
  const [alerts, setAlerts, isAlertsLoaded] = useLocalStorage<Alert[]>('kavexa_alerts', mockAlerts);
  const [cashFlow, setCashFlow, isCashFlowLoaded] = useLocalStorage<CashFlowData[]>('kavexa_cashflow', mockCashFlow);

  const isLoaded = isTransactionsLoaded && isInventoryLoaded && isAlertsLoaded && isCashFlowLoaded;

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
  }), [
    transactions, setTransactions,
    inventory, setInventory,
    alerts, setAlerts,
    cashFlow, setCashFlow,
    isLoaded
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
