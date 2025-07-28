'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, MinusCircle, XCircle, ShoppingCart, DollarSign, PackagePlus } from 'lucide-react';
import { useAppContext, useCurrency } from "@/contexts/app-context";
import { toast } from '@/hooks/use-toast';
import type { InventoryItem, Client } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartItem extends InventoryItem {
    quantity: number;
}

export default function POSPage() {
    const { inventory, clients, addTransaction } = useAppContext();
    const { formatCurrency } = useCurrency();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string>('none');
    const [activeTab, setActiveTab] = useState('products');

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.stock > 0);
    }, [inventory, searchTerm]);
    
    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

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
        toast({ title: "Añadido al carrito", description: `${item.name} se ha añadido a la venta.`});
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
        setActiveTab('products');
    };

    return (
        <PageWrapper className="flex flex-col h-[calc(100vh-theme(spacing.14))] md:h-auto">
            <PageHeader
                title="Punto de Venta"
                description="Realiza ventas rápidas seleccionando productos de tu inventario."
            />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products">Productos</TabsTrigger>
                    <TabsTrigger value="cart">
                        Carrito 
                        {cartItemCount > 0 && 
                            <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 rounded-full text-xs flex items-center justify-center">{cartItemCount}</span>
                        }
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="flex-grow mt-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <Input
                                placeholder="Buscar producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </CardHeader>
                        <CardContent className="flex-grow p-4">
                            <ScrollArea className="h-[450px]">
                                <div className="space-y-4">
                                    {filteredInventory.length > 0 ? filteredInventory.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg border">
                                            <Image
                                              src={item.imageUrl || `https://placehold.co/80x80.png`}
                                              alt={item.name}
                                              width={60}
                                              height={60}
                                              className="rounded-md object-cover aspect-square"
                                              data-ai-hint="product photo"
                                            />
                                            <div className="flex-grow">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                                                <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                                            </div>
                                            <Button size="icon" variant="outline" onClick={() => addToCart(item)}>
                                                <PackagePlus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            <p>No hay productos disponibles.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cart" className="flex-grow mt-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Resumen de la Venta</CardTitle>
                        </CardHeader>
                         <CardContent className="flex-grow p-4">
                             <ScrollArea className="h-[450px]">
                                {cart.length > 0 ? (
                                    <div className="space-y-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg border">
                                                <Image 
                                                    src={item.imageUrl || `https://placehold.co/80x80.png`}
                                                    alt={item.name}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-md object-cover aspect-square"
                                                    data-ai-hint="product photo"
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-primary">{formatCurrency(item.price * item.quantity)}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}><MinusCircle className="h-5 w-5" /></Button>
                                                        <span className="w-4 text-center">{item.quantity}</span>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}><PlusCircle className="h-5 w-5" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                        <ShoppingCart className="h-12 w-12 mb-4 text-muted-foreground/50"/>
                                        <p>El carrito está vacío.</p>
                                        <p className="text-sm">Añade productos para empezar una venta.</p>
                                        <Button variant="link" onClick={() => setActiveTab('products')}>Ver productos</Button>
                                    </div>
                                )}
                             </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <div className="mt-auto pt-4 border-t bg-background sticky bottom-0">
                <div className="space-y-4">
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
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>
                        <DollarSign className="mr-2 h-5 w-5" /> Finalizar Venta
                    </Button>
                </div>
            </div>
        </PageWrapper>
    );
}
