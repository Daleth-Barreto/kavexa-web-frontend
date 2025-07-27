'use client';
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { Badge } from "@/components/ui/badge";

export default function PerfilPage() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <PageWrapper>
      <PageHeader
        title="Perfil y Configuración"
        description="Gestiona los detalles de tu negocio, tu cuenta y tus preferencias."
      />
      <div className="grid gap-6 max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle>Detalles del Negocio</CardTitle>
                <CardDescription>Información general de tu empresa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="business-name">Nombre del Negocio</Label>
                    <Input id="business-name" defaultValue="Mi Empresa S.A." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="currency">Moneda Preferida</Label>
                    <Input id="currency" defaultValue="USD" />
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Autenticación</CardTitle>
                <CardDescription>Estado de tu sesión actual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                  <Badge variant={isAuthenticated ? "default" : "secondary"}>
                    {isAuthenticated ? "Autenticado" : "Sesión de invitado"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isAuthenticated 
                      ? "Tus datos se están sincronizando con la nube."
                      : "Estás trabajando sin conexión. Tus datos se guardan localmente."}
                  </p>
                </div>
                <Button onClick={isAuthenticated ? logout : login}>
                    {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
                </Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Gestión de Datos</CardTitle>
                <CardDescription>Exporta o importa tus datos locales.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
               <Button variant="outline">Importar JSON</Button>
               <Button variant="outline">Exportar JSON</Button>
            </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
