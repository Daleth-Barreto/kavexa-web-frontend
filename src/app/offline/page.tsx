
'use client';

import { KavexaLogoIcon } from "@/components/kavexa/kavexa-logo-icon";
import { PageWrapper } from "@/components/kavexa/page-wrapper";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center h-full min-h-[80vh] text-center gap-8">
        <div className="flex items-center gap-4 text-3xl font-headline font-semibold">
            <WifiOff className="h-10 w-10 text-destructive" />
            <span>Sin Conexión</span>
        </div>
        <div className="text-center text-muted-foreground">
            <p>Parece que no tienes conexión a internet.</p>
            <p>Algunas páginas que no has visitado antes podrían no estar disponibles.</p>
        </div>
        <div className="mt-8 flex items-center gap-4 text-2xl font-headline font-semibold animate-pulse text-muted-foreground/50">
            <KavexaLogoIcon className="h-8 w-8 text-primary" />
            <span>Kavexa</span>
        </div>
      </div>
    </PageWrapper>
  );
}

    