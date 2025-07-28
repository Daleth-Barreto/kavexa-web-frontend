export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'egress';
  category: string;
  // Fields for sales linked to inventory
  productId?: string;
  quantity?: number;
  // Field for linking to a client
  clientId?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
};

export type Alert = {
  id:string;
  type: 'low_stock' | 'unusual_expense' | 'subscription_due';
  message: string;
  date: string;
  status: 'new' | 'ignored' | 'resolved';
  relatedId?: string;
};

export type AppConfig = {
    currency: string;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  category: string;
  paymentDay: number; // Day of the month (1-31)
  lastPaidMonth: number; // 0-11 for month
  lastPaidYear: number;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastPurchaseDate?: string;
};
