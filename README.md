# Kavexa - Asistente Inteligente para Negocios

Kavexa es una aplicación web progresiva (PWA) diseñada para ser el centro de control definitivo para pequeñas y medianas empresas (PYMES). Construida con un enfoque "local-first", toda la información se almacena directamente en tu navegador, garantizando una experiencia de usuario increíblemente rápida y la capacidad de funcionar completamente sin conexión a internet.

La aplicación es modular, permitiendo a cada usuario personalizar la interfaz para adaptarla perfectamente a las necesidades específicas de su negocio, ya sea un gimnasio, una cafetería, una tienda minorista o un proveedor de servicios.

![Kavexa Dashboard](https://placehold.co/800x400.png)
*La imagen de arriba es un marcador de posición. Reemplazar con una captura de pantalla real del dashboard.*

## ✨ Características Principales

Kavexa está compuesto por una suite de módulos integrados que puedes activar o desactivar según lo necesites:

- **🏠 Inicio:** Un dashboard centralizado que ofrece un resumen visual de la salud financiera y operativa de tu negocio, incluyendo ingresos, egresos, balance y actividad reciente.
- **💸 Movimientos:** Un registro detallado de todas las transacciones financieras (ingresos y egresos), con potentes filtros por mes y año.
- **🛒 Punto de Venta (POS):** Una interfaz de ventas rápida y eficiente. Selecciona productos de tu inventario, añádelos a un carrito y registra la venta en segundos.
- **📦 Inventario:** Gestiona tus productos, controla los niveles de stock y precios. Recibe alertas automáticas cuando el stock esté bajo.
- **👥 Clientes:** Administra tu base de clientes o miembros. Ideal para negocios basados en membresías como gimnasios o estudios.
- **🚚 Proveedores:** Mantén un registro organizado de la información de contacto de tus proveedores.
- **🔁 Suscripciones:** Lleva un control de tus pagos recurrentes (alquiler, servicios, software) y recibe alertas antes de la fecha de vencimiento para que nunca se te pase un pago.
- **📈 Análisis de Demanda:** Identifica productos con baja rotación utilizando un análisis de regresión lineal sobre tus datos de ventas.
- **📊 Proyección Financiera:** Anticipa el flujo de caja futuro de tu negocio con una proyección a 90 días basada en una media móvil de tu actividad reciente.
- **🔔 Alertas Inteligentes:** Un sistema proactivo que te notifica sobre gastos inusuales, niveles bajos de stock y pagos de suscripciones pendientes.
- **📄 Reportes:** Una sección preparada para generar y descargar informes detallados de tu actividad.

## 🚀 Stack Tecnológico

Kavexa está construido con un conjunto de tecnologías modernas, enfocadas en el rendimiento y la experiencia del desarrollador:

- **Framework:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://reactjs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) - Una colección de componentes accesibles y personalizables.
- **Gráficos:** [Recharts](https://recharts.org/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Validación de Esquemas:** [Zod](https://zod.dev/)
- **Iconos:** [Lucide React](https://lucide.dev/)

## 🏛️ Arquitectura y Conceptos Clave

- **Enfoque Local-First:** La característica principal de Kavexa es que todos los datos (transacciones, inventario, etc.) se guardan en el `localStorage` del navegador del usuario. Esto ofrece varias ventajas:
  - **Velocidad Extrema:** No hay esperas de red para cargar o guardar datos.
  - **Funcionalidad Offline:** La aplicación es 100% funcional sin conexión a internet.
  - **Privacidad:** Los datos del usuario nunca salen de su dispositivo.

- **Gestión de Estado Centralizada:** El estado global de la aplicación es manejado a través del Context API de React. El archivo `src/contexts/app-context.tsx` es el "cerebro" de la aplicación, donde se define y se provee toda la lógica de negocio y los datos a los componentes.

- **Diseño Modular:** La aplicación permite a los usuarios elegir qué módulos desean usar a través de una pantalla de bienvenida y la página de configuración. El menú de navegación y las rutas disponibles se adaptan dinámicamente a la selección del usuario.

## 🏁 Cómo Empezar

Para ejecutar este proyecto en un entorno de desarrollo local, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd [NOMBRE_DEL_DIRECTORIO]
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación.

## 💡 Futuras Mejoras

Kavexa está construido para ser escalable. Algunas de las futuras mejoras planeadas incluyen:

- **Sincronización en la Nube:** Ofrecer un sistema de cuentas opcional para sincronizar los datos de forma segura entre dispositivos.
- **Funcionalidades de IA:** Integrar Genkit para ofrecer análisis más profundos, sugerencias proactivas y automatización de tareas.
- **Exportación a PDF:** Implementar la funcionalidad completa de generación de reportes en formato PDF.
- **Temas Personalizables:** Permitir al usuario definir sus propios esquemas de colores.
