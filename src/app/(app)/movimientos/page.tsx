'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, MoreVertical, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageWrapper } from '@/components/kavexa/page-wrapper';
import { PageHeader } from '@/components/kavexa/page-header';
import { AddTransactionSheet } from '@/components/kavexa/add-transaction-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Transaction } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext, useCurrency } from '@/contexts/app-context';
import { useTheme } from 'next-themes';
import { getYear, getMonth } from 'date-fns';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const CustomTooltip = ({ active, payload }: any) => {
  const { formatCurrency } = useCurrency();
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    const data = payload[0];
    const percentage = data.payload?.percent ? `(${(data.payload.percent * 100).toFixed(0)}%)` : '';
    
    return (
      <div 
        className="rounded-lg border bg-background p-2.5 text-sm shadow-md"
        style={{
          background: theme === 'dark' ? 'hsl(240 10% 3.9%)' : '#fff',
          borderColor: 'hsl(var(--border))',
        }}
       >
        <p className="font-medium" style={{ color: data.payload.fill }}>
            {`${data.name}: ${formatCurrency(data.value)} ${percentage}`}
        </p>
      </div>
    );
  }

  return null;
};

export default function MovimientosPage() {
  const { transactions, deleteTransaction } = useAppContext();
  const { formatCurrency } = useCurrency();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth()).toString());

  const { years, months } = useMemo(() => {
    const years = [...new Set(transactions.map(t => getYear(new Date(t.date))))].sort((a,b) => b-a);
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return { years: years.map(String), months };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = getYear(date).toString() === selectedYear;
      const matchesMonth = getMonth(date).toString() === selectedMonth;
      return matchesSearch && matchesYear && matchesMonth;
    });
  }, [transactions, searchTerm, selectedYear, selectedMonth]);

  const egressByCategory = useMemo(() => {
    const egresses = filteredTransactions.filter(t => t.type === 'egress');
    const grouped = egresses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const handleAddClick = () => {
    setSelectedTransaction(null);
    setSheetOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };
  
  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setAlertOpen(true);
  }

  const confirmDelete = () => {
    if(transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
    }
    setAlertOpen(false);
    setTransactionToDelete(null);
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Movimientos Financieros"
        description="Revisa, busca y gestiona todas tus transacciones.">
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Movimiento
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Todas las transacciones</CardTitle>
             <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto flex-grow"
              />
               <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => <SelectItem key={month} value={index.toString()}>{month}</SelectItem>)}
                </SelectContent>
              </Select>
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
                    <TableHead className="w-[50px]"></TableHead>
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
                       <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(transaction)} className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                  No hay transacciones para los filtros seleccionados.
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
           <CardHeader>
            <CardTitle>Egresos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {egressByCategory.length > 0 ? (
               <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={egressByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={false}
                  >
                    {egressByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px", color: "hsl(var(--muted-foreground))" }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8 h-[300px] flex items-center justify-center">
                No hay egresos para mostrar.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddTransactionSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen}
        defaultValues={selectedTransaction}
      />

       <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción "{transactionToDelete?.description}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
