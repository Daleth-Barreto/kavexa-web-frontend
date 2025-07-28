
'use client';

import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Transaction, InventoryItem, Alert, AppConfig, Subscription, Client, Provider, ModuleKey } from '@/lib/types';
import { mockTransactions, mockInventory, mockAlerts, mockSubscriptions, mockClients, mockProviders, getDefaultModuleConfig } from '@/lib/data';
import { calculateZScore, Z_SCORE_THRESHOLD } from '@/lib/math-utils';
import { useToast } from '@/hooks/use-toast';
import { isSameMonth, isSameYear, addDays, addMonths, addWeeks } from 'date-fns';
import { useRouter } from 'next/navigation';

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface AppContextType {
  transactions: Transaction[];
  setTransactions: (value: Transaction[] | ((val: Transaction[]) => Transaction[])) => void;
  inventory: InventoryItem[];
  setInventory: (value: InventoryItem[] | ((val: InventoryItem[]) => InventoryItem[])) => void;
  alerts: Alert[];
  setAlerts: (value: Alert[] | ((val: Alert[]) => Alert[])) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'date' | 'status' | 'type'>) => void;
  subscriptions: Subscription[];
  setSubscriptions: (value: Subscription[] | ((val: Subscription[]) => Subscription[])) => void;
  clients: Client[];
  setClients: (value: Client[] | ((val: Client[]) => Client[])) => void;
  providers: Provider[];
  setProviders: (value: Provider[] | ((val: Provider[]) => Provider[])) => void;
  
  config: AppConfig;
  setConfig: (value: AppConfig | ((val: AppConfig) => AppConfig)) => void;
  updateModuleConfig: (module: ModuleKey, enabled: boolean) => void;
  
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
  const router = useRouter();
  const [transactions, setTransactions, isTransactionsLoaded] = useLocalStorage<Transaction[]>('kavexa_transactions', mockTransactions);
  const [inventory, setInventory, isInventoryLoaded] = useLocalStorage<InventoryItem[]>('kavexa_inventory', mockInventory);
  const [alerts, setAlerts, isAlertsLoaded] = useLocalStorage<Alert[]>('kavexa_alerts', mockAlerts);
  const [subscriptions, setSubscriptions, isSubscriptionsLoaded] = useLocalStorage<Subscription[]>('kavexa_subscriptions', mockSubscriptions);
  const [clients, setClients, isClientsLoaded] = useLocalStorage<Client[]>('kavexa_clients', mockClients);
  const [providers, setProviders, isProvidersLoaded] = useLocalStorage<Provider[]>('kavexa_providers', mockProviders);
  const [config, setConfig, isConfigLoaded] = useLocalStorage<AppConfig>('kavexa_config', { 
    currency: 'USD',
    onboardingComplete: false,
    enabledModules: getDefaultModuleConfig(),
  });
  const { toast } = useToast();

  const [isAppLoading, setIsAppLoading] = useState(true);

  const isDataLoaded = isTransactionsLoaded && isInventoryLoaded && isAlertsLoaded && isConfigLoaded && isSubscriptionsLoaded && isClientsLoaded && isProvidersLoaded;

  useEffect(() => {
    if (isDataLoaded) {
      const timer = setTimeout(() => {
        setIsAppLoading(false);
      }, 500); // Simulate loading time
      return () => clearTimeout(timer);
    }
  }, [isDataLoaded]);

  // Alert checks
  useEffect(() => {
    if (!isDataLoaded || !config.enabledModules?.alertas) return;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    let alertsHaveChanged = false;
    
    // --- Subscription alerts ---
    const dueSubscriptions: Alert[] = [];
    subscriptions.forEach(sub => {
      const isAlreadyPaid = sub.lastPaidMonth === currentMonth && sub.lastPaidYear === currentYear;
      const isAlertExisting = alerts.some(a => a.type === 'subscription_due' && a.relatedId === sub.id && a.status === 'new' && isSameMonth(new Date(a.date), today) && isSameYear(new Date(a.date), today));

      if (currentDate >= sub.paymentDay && !isAlreadyPaid && !isAlertExisting) {
        dueSubscriptions.push({
          id: `alert-sub-${sub.id}-${currentYear}-${currentMonth}`,
          type: 'subscription_due',
          message: `Suscripción pendiente: ${sub.name}`,
          date: new Date().toISOString().split('T')[0],
          status: 'new',
          relatedId: sub.id,
        });
      }
    });

    if (dueSubscriptions.length > 0) {
      setAlerts(prev => [...dueSubscriptions, ...prev]);
      alertsHaveChanged = true;
      toast({
          title: 'Suscripciones Pendientes',
          description: `Tienes ${dueSubscriptions.length} pago(s) de suscripción pendiente(s) este mes.`,
          variant: 'destructive',
      });
    }

    // --- Recurring custom alerts ---
    const updatedAlerts = alerts.map(alert => {
        if (alert.type === 'custom' && alert.recurrence && alert.recurrence !== 'none' && alert.status === 'resolved' && alert.nextRecurrenceDate) {
            const nextDate = new Date(alert.nextRecurrenceDate);
            nextDate.setHours(0,0,0,0);

            if (today >= nextDate) {
                alertsHaveChanged = true;
                return {
                    ...alert,
                    status: 'new' as const,
                    date: new Date().toISOString().split('T')[0]
                }
            }
        }
        return alert;
    });

    if(alertsHaveChanged) {
        setAlerts(updatedAlerts);
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, subscriptions, config.enabledModules?.alertas]);

  const checkForSellingOpportunity = useCallback((productId: string, currentTransactions: Transaction[]) => {
      const product = inventory.find(p => p.id === productId);
      if (!product || !config.enabledModules.alertas) return;

      const productSales = currentTransactions.filter(t => t.type === 'income' && t.productId === productId);
      
      const MIN_SALES_FOR_ANALYSIS = 5;
      if (productSales.length < MIN_SALES_FOR_ANALYSIS) return;

      const alertExists = alerts.some(a => a.type === 'selling_opportunity' && a.relatedId === productId);
      if (alertExists) return;

      const salesPerDay = new Array(7).fill(0); // Domingo = 0, Sábado = 6
      productSales.forEach(sale => {
          const dayOfWeek = new Date(sale.date).getDay();
          salesPerDay[dayOfWeek] += sale.quantity || 1;
      });

      const maxSales = Math.max(...salesPerDay);
      if(maxSales > 0){
        const strongestDayIndex = salesPerDay.indexOf(maxSales);
        const strongestDay = dayNames[strongestDayIndex];
        
        const newAlert: Alert = {
            id: `alert-opportunity-${productId}`,
            type: 'selling_opportunity',
            message: `El día fuerte para "${product.name}" es el ${strongestDay}. ¡Aprovéchalo!`,
            date: new Date().toISOString().split('T')[0],
            status: 'new',
            relatedId: productId,
        };

        setAlerts(prev => [newAlert, ...prev]);
        toast({
            title: 'Oportunidad de Venta',
            description: `Hemos identificado el día de mayor venta para ${product.name}.`,
        });
      }
  }, [inventory, alerts, setAlerts, toast, config.enabledModules.alertas]);

    const addAlert = useCallback((data: Omit<Alert, 'id' | 'date' | 'status' | 'type'>) => {
        const today = new Date();
        let nextRecurrenceDate: string | undefined = undefined;

        if (data.recurrence && data.recurrence !== 'none') {
            switch(data.recurrence) {
                case 'daily': nextRecurrenceDate = addDays(today, 1).toISOString(); break;
                case 'weekly': nextRecurrenceDate = addWeeks(today, 1).toISOString(); break;
                case 'monthly': nextRecurrenceDate = addMonths(today, 1).toISOString(); break;
            }
        }

        const newAlert: Alert = {
            id: `alert-custom-${Date.now()}`,
            type: 'custom',
            status: 'new',
            date: today.toISOString().split('T')[0],
            message: data.message,
            recurrence: data.recurrence,
            nextRecurrenceDate,
        };
        setAlerts(prev => [newAlert, ...prev]);
        toast({
            title: 'Recordatorio Creado',
            description: 'Se ha añadido una nueva alerta a tu lista.',
        });
    }, [setAlerts, toast]);


  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: data.date ? data.date : new Date().toISOString().split('T')[0],
      description: data.description,
      amount: data.amount,
      type: data.type,
      category: data.category,
      productId: data.productId,
      quantity: data.quantity,
      clientId: data.clientId,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    if (newTransaction.clientId) {
      setClients(prevClients => prevClients.map(client => 
        client.id === newTransaction.clientId 
          ? { ...client, lastPurchaseDate: newTransaction.date, status: 'active' }
          : client
      ));
    }

    if (newTransaction.type === 'egress') {
      const expenseAmounts = updatedTransactions
        .filter(t => t.type === 'egress')
        .map(t => t.amount);
      
      if (expenseAmounts.length > 5 && config.enabledModules.alertas) {
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
    
    if (newTransaction.type === 'income' && newTransaction.productId && newTransaction.quantity) {
        const productId = newTransaction.productId;
        const quantitySold = newTransaction.quantity;
        
        setInventory(currentInventory => {
            return currentInventory.map(item => {
                if (item.id === productId) {
                    const newStock = item.stock - quantitySold;
                    
                    if (newStock <= item.lowStockThreshold && item.stock > item.lowStockThreshold && config.enabledModules.alertas) {
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

        checkForSellingOpportunity(productId, updatedTransactions);
    }

  }, [transactions, setTransactions, setAlerts, setInventory, setClients, toast, config.enabledModules, checkForSellingOpportunity]);

  const editTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  }, [setTransactions]);

  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  }, [setTransactions]);

  const clearAllData = useCallback(() => {
    setTransactions([]);
    setInventory([]);
    setAlerts([]);
    setSubscriptions([]);
    setClients([]);
    setProviders([]);
    setConfig(prev => ({...prev, onboardingComplete: false, enabledModules: getDefaultModuleConfig() }));
    router.push('/welcome');
  }, [setTransactions, setInventory, setAlerts, setSubscriptions, setClients, setProviders, setConfig, router]);

  const setCurrency = useCallback((currency: string) => {
    setConfig(prev => ({ ...prev, currency }));
  }, [setConfig]);

  const updateModuleConfig = useCallback((module: ModuleKey, enabled: boolean) => {
      setConfig(prev => ({
          ...prev,
          enabledModules: {
              ...prev.enabledModules,
              [module]: enabled
          }
      }))
  }, [setConfig]);

  const value = useMemo(() => ({
    transactions,
    setTransactions,
    inventory,
    setInventory,
    alerts,
    setAlerts,
    addAlert,
    subscriptions,
    setSubscriptions,
    clients,
    setClients,
    providers,
    setProviders,
    config,
    setConfig,
    updateModuleConfig,
    isLoaded: !isAppLoading,
    addTransaction,
    editTransaction,
    deleteTransaction,
    clearAllData,
    currency: config.currency,
    setCurrency,
  }), [
    transactions, setTransactions,
    inventory, setInventory,
    alerts, setAlerts, addAlert,
    subscriptions, setSubscriptions,
    clients, setClients,
    providers, setProviders,
    config, setConfig, updateModuleConfig,
    isAppLoading, addTransaction, editTransaction, deleteTransaction, clearAllData, setCurrency
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
