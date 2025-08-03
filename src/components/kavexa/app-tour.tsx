
'use client';

import { TourProvider, useTour, type StepType } from '@reactour/tour';
import { Popover as TourPopover } from '@reactour/popover';
import { Button } from '../ui/button';
import { HelpCircle } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

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
  const { t } = useI18n();

  const steps: StepType[] = [
    {
      selector: 'body',
      content: t('tour.step1'),
    },
    {
      selector: '[data-tour-step="1"]',
      content: t('tour.step2'),
    },
    {
      selector: '[data-tour-step="2"]',
      content: t('tour.step3'),
    },
    {
      selector: '[data-tour-step="3"]',
      content: t('tour.step4'),
    },
    {
      selector: '[data-tour-step="4"]',
      content: t('tour.step5'),
    },
    {
      selector: '[data-tour-step="5"]',
      content: t('tour.step6'),
    },
    {
      selector: 'body',
      content: t('tour.step7'),
    },
  ];

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
                        {isLastStep ? t('tour.finish') : t('tour.next')}
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
              color: 'hsl(var(--foreground))',
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
