'use client';

import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useTheme } from 'next-themes';

interface AppTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
}

export function AppTour({ run, setRun }: AppTourProps) {
  const { theme } = useTheme();

  const steps: Step[] = [
    {
      target: 'body',
      content: '¡Bienvenido a Kavexa! Te mostraremos rápidamente las funciones principales.',
      placement: 'center',
    },
    {
      target: '#tour-step-1',
      content: 'Usa este menú para navegar por las diferentes secciones de la aplicación.',
      placement: 'right',
    },
    {
      target: '#tour-step-2',
      content: 'Aquí tienes un resumen rápido de tus finanzas: ingresos, egresos y el balance total.',
      placement: 'bottom',
    },
    {
      target: '#tour-step-3',
      content: 'Este gráfico te muestra una comparación visual de tus ingresos y egresos a lo largo del tiempo.',
      placement: 'bottom',
    },
    {
      target: '#tour-step-4',
      content: 'Desde aquí puedes añadir nuevos productos a tu inventario o registrar transacciones financieras.',
      placement: 'bottom',
    },
    {
        target: '#tour-step-5',
        content: 'Mantente al día con las alertas importantes y las actividades recientes de tu negocio.',
        placement: 'bottom',
    },
     {
      target: 'body',
      content: '¡Listo! Ya conoces lo básico. Explora las demás secciones para descubrir más herramientas.',
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          arrowColor: theme === 'dark' ? '#1f2937' : '#fff',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: 'hsl(var(--primary))',
          textColor: theme === 'dark' ? '#fff' : '#000',
          zIndex: 1000,
        },
        buttonClose: {
            color: theme === 'dark' ? '#fff' : '#000',
        }
      }}
    />
  );
}
