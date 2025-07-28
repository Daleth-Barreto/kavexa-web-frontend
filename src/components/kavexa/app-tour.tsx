
'use client';

import { TourProvider, useTour, type StepType } from '@reactour/tour';
import { Popover as TourPopover } from '@reactour/popover';
import { Button } from '../ui/button';
import { HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

const steps: StepType[] = [
  {
    selector: 'body',
    content: '¡Bienvenido a Kavexa! Te mostraremos rápidamente las funciones principales.',
  },
  {
    selector: '[data-tour-step="1"]',
    content: 'Usa este menú para navegar por las diferentes secciones de la aplicación.',
  },
  {
    selector: '[data-tour-step="2"]',
    content: 'Aquí tienes un resumen rápido de tus finanzas: ingresos, egresos y el balance total.',
  },
  {
    selector: '[data-tour-step="3"]',
    content: 'Este gráfico te muestra una comparación visual de tus ingresos y egresos a lo largo del tiempo.',
  },
  {
    selector: '[data-tour-step="4"]',
    content: 'Desde aquí puedes añadir nuevos productos a tu inventario o registrar transacciones financieras.',
  },
  {
    selector: '[data-tour-step="5"]',
    content: 'Mantente al día con las alertas importantes y las actividades recientes de tu negocio.',
  },
  {
    selector: 'body',
    content: '¡Listo! Ya conoces lo básico. Explora las demás secciones para descubrir más herramientas.',
  },
];

function TourTrigger() {
  const { setIsOpen } = useTour();
  return (
    <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
      <HelpCircle className="h-5 w-5" />
      <span className="sr-only">Iniciar Tour</span>
    </Button>
  );
}

function AppTour({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <TourProvider 
        steps={steps}
        components={{
          Popover: ({ children, ...props }) => {
            const { currentStep, setIsOpen } = useTour();
            const isLastStep = currentStep === steps.length - 1;

            return (
              <TourPopover {...props}>
                <div className='flex flex-col gap-4'>
                    {children}
                    <div className="flex justify-end">
                    <Button onClick={() => isLastStep ? setIsOpen(false) : props.nextStep()}>
                        {isLastStep ? 'Finalizar' : 'Siguiente'}
                    </Button>
                    </div>
                </div>
              </TourPopover>
            );
          },
        }}
        styles={{
            popover: (base) => ({
              ...base,
              '--reactour-accent': 'hsl(var(--primary))',
              borderRadius: 'var(--radius)',
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              padding: '1rem'
            }),
            maskArea: (base) => ({ ...base, rx: 'var(--radius)' }),
            maskWrapper: (base) => ({ ...base, color: '#00000080' }),
            badge: (base) => ({ ...base, backgroundColor: 'hsl(var(--primary))' }),
            dot: (base, { current }) => ({
              ...base,
              backgroundColor: current ? 'hsl(var(--primary))' : 'hsl(var(--border))',
            }),
            close: (base) => ({
              ...base,
              color: theme === 'dark' ? '#fff' : '#000',
              '&:hover': {
                color: 'hsl(var(--primary))',
              }
            }),
          }}
        >
      {children}
    </TourProvider>
  );
}

AppTour.Trigger = TourTrigger;

export { AppTour };
