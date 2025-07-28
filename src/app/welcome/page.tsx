
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ArrowRight } from 'lucide-react';
import { ALL_MODULES } from '@/lib/data';
import { AppProvider, useAppContext } from '@/contexts/app-context';
import type { ModuleKey } from '@/lib/types';

function WelcomePageContent() {
  const router = useRouter();
  const { config, setConfig } = useAppContext();
  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>(config.enabledModules);

  const handleModuleToggle = (moduleId: ModuleKey) => {
    setSelectedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleContinue = () => {
    setConfig(prevConfig => ({
      ...prevConfig,
      enabledModules: selectedModules,
      onboardingComplete: true
    }));
    router.push('/inicio');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">Kavexa</span>
          </div>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>¡Bienvenido a Kavexa!</CardTitle>
            <CardDescription>Para empezar, selecciona los módulos que quieres usar. Puedes cambiar esto más tarde.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_MODULES.map((module) => (
              <div
                key={module.id}
                className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-colors ${selectedModules[module.id as ModuleKey] ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'}`}
                onClick={() => handleModuleToggle(module.id as ModuleKey)}
              >
                <Checkbox
                  id={module.id}
                  checked={selectedModules[module.id as ModuleKey]}
                  className="h-5 w-5"
                />
                <div>
                  <label htmlFor={module.id} className="font-semibold text-foreground cursor-pointer">{module.title}</label>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleContinue}>
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <AppProvider>
      <WelcomePageContent />
    </AppProvider>
  )
}
