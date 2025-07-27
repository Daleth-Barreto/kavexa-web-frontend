export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  // Fields for sales linked to inventory
  productId?: string;
  quantity?: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
};

export type Alert = {
  id: string;
  type: 'low_stock' | 'unusual_expense' | 'duplicate_entry';
  message: string;
  date: string;
  status: 'new' | 'ignored' | 'resolved';
  relatedId?: string;
};

export type CashFlowData = {
  date: string;
  balance: number;
};
