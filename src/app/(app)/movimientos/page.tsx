'use client';

import { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageWrapper } from '@/components/kavexa/page-wrapper';
import { PageHeader } from '@/components/kavexa/page-header';
import { AddTransactionSheet } from '@/components/kavexa/add-transaction-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Transaction } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '@/contexts/app-context';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount);
};

const COLORS = ['#A085CF', '#7FB7BE', '#FFC658', '#FF8042', '#82ca9d'];

export default function MovimientosPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { transactions, setTransactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTransaction, ...transactions]);
  };
  
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [transactions, searchTerm]);

  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <PageWrapper>
      <PageHeader
        title="Movimientos Financieros"
        description="Revisa, busca y gestiona todas tus transacciones.">
        <Button onClick={() => setSheetOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Movimiento
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Todas las transacciones</CardTitle>
             <div className="mt-4">
              <Input 
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                  No hay transacciones. Añade una para empezar.
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length > 0 ? (
               <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8 h-[300px] flex items-center justify-center">
                No hay gastos para mostrar.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTransactionSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen}
        onTransactionAdd={handleAddTransaction}
      />
    </PageWrapper>
  );
}
