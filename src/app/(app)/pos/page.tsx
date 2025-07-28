'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle, XCircle, ShoppingCart, DollarSign } from 'lucide-react';
import { useAppContext, useCurrency } from "@/contexts/app-context";
import { toast } from '@/hooks/use-toast';
import type { InventoryItem, Client } from '@/lib/types';

interface CartItem extends InventoryItem {
    quantity: number;
}

export default function POSPage() {
    const { inventory, clients, addTransaction } = useAppContext();
    const { formatCurrency } = useCurrency();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string>('none');

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.stock > 0);
    }, [inventory, searchTerm]);

    const addToCart = (item: InventoryItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                if (existingItem.quantity < item.stock) {
                    return prevCart.map(cartItem =>
                        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                    );
                } else {
                    toast({ title: "Stock máximo alcanzado", description: `No hay más stock disponible para ${item.name}.`, variant: "destructive" });
                    return prevCart;
                }
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const updateCartQuantity = (itemId: string, newQuantity: number) => {
        setCart(prevCart => {
            const itemToUpdate = prevCart.find(item => item.id === itemId);
            if (!itemToUpdate) return prevCart;

            if (newQuantity > itemToUpdate.stock) {
                 toast({ title: "Stock máximo alcanzado", description: `Solo hay ${itemToUpdate.stock} unidades de ${itemToUpdate.name}.`, variant: "destructive" });
                 return prevCart;
            }

            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }

            return prevCart.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast({ title: 'Carrito vacío', description: 'Añade productos para realizar una venta.', variant: 'destructive'});
            return;
        }

        cart.forEach(item => {
            addTransaction({
                type: 'income',
                description: `Venta: ${item.name} (x${item.quantity})`,
                amount: item.price * item.quantity,
                category: 'Ventas',
                productId: item.id,
                quantity: item.quantity,
                clientId: selectedClientId === 'none' ? undefined : selectedClientId,
            });
        });

        toast({
            title: "Venta registrada",
            description: `Se ha completado la venta por un total de ${formatCurrency(cartTotal)}.`,
        });

        setCart([]);
        setSelectedClientId('none');
    };

    return (
        <PageWrapper>
            <PageHeader
                title="Punto de Venta"
                description="Realiza ventas rápidas seleccionando productos de tu inventario."
            />
            <div className="grid md:grid-cols-2 gap-8">
                {/* Product Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Productos Disponibles</CardTitle>
                        <div className="mt-4">
                            <Input
                                placeholder="Buscar producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[450px]">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredInventory.length > 0 ? filteredInventory.map(item => (
                                    <Card key={item.id} className="flex flex-col cursor-pointer hover:border-primary" onClick={() => addToCart(item)}>
                                        <CardHeader className="p-4 flex-grow">
                                            <CardTitle className="text-base">{item.name}</CardTitle>
                                        </CardHeader>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
                                            <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                                            <span className="text-muted-foreground">Stock: {item.stock}</span>
                                        </CardFooter>
                                    </Card>
                                )) : (
                                    <p className="text-muted-foreground col-span-full text-center">No hay productos que coincidan con la búsqueda.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Cart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ShoppingCart className="h-6 w-6" /> Carrito de Compra
                        </CardTitle>
                        <CardDescription>
                            Revisa los productos antes de finalizar la venta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ScrollArea className="h-[350px]">
                          {cart.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Producto</TableHead>
                                  <TableHead className="text-center">Cant.</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                  <TableHead className="w-[20px]"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {cart.map(item => (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                                        <span>{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.id)}><XCircle className="h-4 w-4"/></Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center text-muted-foreground h-[350px] flex items-center justify-center">
                                El carrito está vacío.
                            </div>
                          )}
                       </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                         <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Asociar cliente (opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Cliente Genérico</SelectItem>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="w-full flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>
                            <DollarSign className="mr-2 h-5 w-5" /> Finalizar Venta
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </PageWrapper>
    );
}
