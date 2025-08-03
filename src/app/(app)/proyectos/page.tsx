
'use client';

import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { PageHeader } from "@/components/kavexa/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/contexts/i18n-context";
import { useAppContext } from "@/contexts/app-context";

export default function ProyectosPage() {
  const { t } = useI18n();
  const { projects } = useAppContext();

  return (
    <PageWrapper>
      <PageHeader
        title={"Proyectos"}
        description={"Gestiona tus proyectos, tareas y plazos."}
      >
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Proyecto
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-16">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"/>
            <h3 className="text-xl font-semibold">Módulo en Construcción</h3>
            <p className="mt-2">
              La gestión de proyectos estará disponible próximamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
