'use client';

import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, ShieldAlert } from "lucide-react";
import { useAppContext } from "@/contexts/app-context";
import type { Alert } from "@/lib/types";

const statusVariant: Record<Alert['status'], 'destructive' | 'secondary' | 'default'> = {
  new: 'destructive',
  ignored: 'secondary',
  resolved: 'default',
};

const statusText: Record<Alert['status'], string> = {
  new: 'Nueva',
  ignored: 'Ignorada',
  resolved: 'Resuelta',
};


export default function AlertasPage() {
  const { alerts, setAlerts } = useAppContext();

  const handleStatusChange = (id: string, status: 'ignored' | 'resolved') => {
    setAlerts(currentAlerts => currentAlerts.map(alert => 
      alert.id === id ? { ...alert, status } : alert
    ));
  };
  
  return (
    <PageWrapper>
      <PageHeader
        title="Alertas y Análisis"
        description="Gestiona las alertas generadas por el sistema para mantener tu negocio en buen camino."
      />
      <Card>
        <CardContent className="pt-6">
          {alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-yellow-500" />
                      {alert.message}
                    </TableCell>
                    <TableCell>{new Date(alert.date).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[alert.status]}>{statusText[alert.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'new' && (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(alert.id, 'resolved')}>
                            <Check className="mr-2 h-4 w-4"/> Resolver
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStatusChange(alert.id, 'ignored')}>
                            <Trash2 className="mr-2 h-4 w-4" /> Ignorar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No hay alertas para mostrar. El sistema te notificará aquí si detecta alguna anomalía.
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
