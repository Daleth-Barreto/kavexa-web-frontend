# Kavexa - Documentación para Desarrolladores

Bienvenido al repositorio de Kavexa. Este documento sirve como una guía técnica para los desarrolladores que trabajan en el proyecto. Está diseñado para ser claro y conciso, especialmente para programadores de nivel junior.

## 1. Visión General del Proyecto

Kavexa es una Aplicación Web Progresiva (PWA) modular construida con un enfoque **"local-first"**. Su objetivo es proporcionar a las pequeñas y medianas empresas (PYMES) un conjunto de herramientas para gestionar sus operaciones diarias, desde las finanzas hasta el inventario, clientes y proveedores. La aplicación es 100% funcional sin conexión a internet.

## 2. Stack Tecnológico

La aplicación está construida con un stack moderno y enfocado en la productividad y el rendimiento.

- **Framework:** [Next.js](https://nextjs.org/) (usando el App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Librería de UI:** [React](https://reactjs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) - Una colección de componentes reusables, accesibles y personalizables.
- **Gráficos:** [Recharts](https://recharts.org/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Validación de Esquemas:** [Zod](https://zod.dev/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **PWA:** [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa) para la funcionalidad offline.

## 3. Arquitectura y Conceptos Clave

Entender estos conceptos es fundamental para trabajar en Kavexa.

### 3.1. Enfoque "Local-First" y Offline (PWA)

Esta es la característica más importante de la arquitectura. **Todos los datos del usuario se almacenan en el `localStorage` del navegador.**

- **¿Cómo funciona?** A través del hook `useLocalStorage` (`src/hooks/use-local-storage.ts`). Este hook actúa como el `useState` de React, pero sincroniza automáticamente el estado con el `localStorage`.
- **Funcionalidad Offline:** Kavexa es una PWA. Utiliza un *Service Worker* (configurado a través de `next-pwa`) para cachear todos los recursos de la aplicación (páginas, scripts, estilos). Esto permite que la aplicación se cargue y funcione perfectamente sin conexión a internet después de la primera visita.
- **Ventajas:**
  - **Velocidad Extrema:** No hay esperas de red. La lectura y escritura de datos es instantánea.
  - **Funcionalidad Offline Completa:** La aplicación funciona perfectamente sin conexión.
  - **Privacidad:** Los datos del negocio no salen del dispositivo del usuario.

### 3.2. Gestión de Estado Global: `AppContext`

El archivo `src/contexts/app-context.tsx` es el **cerebro de la aplicación**.

- **¿Qué es?** Es un Contexto de React que provee a toda la aplicación de los datos y las funciones necesarias para operar.
- **¿Qué contiene?**
  - **Estados:** Los arrays de `transactions`, `inventory`, `clients`, `providers`, etc., que se obtienen del `useLocalStorage`.
  - **Configuración:** El estado `config`, que almacena la moneda, las preferencias de módulos y si el onboarding se completó.
  - **Funciones de Lógica de Negocio:** Contiene funciones cruciales como `addTransaction`, `editTransaction`, `clearAllData`, etc. Estas funciones no solo actualizan el estado, sino que también contienen la lógica de negocio (ej. actualizar el stock al hacer una venta, generar una alerta por un gasto inusual).

**Para usarlo en un componente:** Simplemente importa el hook `useAppContext` y úsalo para acceder a cualquier dato o función que necesites.

```tsx
// Ejemplo de uso
import { useAppContext } from '@/contexts/app-context';

function MyComponent() {
  const { transactions, addTransaction } = useAppContext();
  // ...
}
```

### 3.3. Diseño Modular

Kavexa no es una aplicación monolítica. El usuario puede elegir qué módulos usar.

- **Selección de Módulos:** La página `/welcome` permite al usuario seleccionar los módulos que necesita. Esta configuración se guarda en `config.enabledModules`.
- **Menú Dinámico:** El componente de navegación `src/components/kavexa/nav.tsx` lee esta configuración y renderiza dinámicamente solo los enlaces a los módulos activados.
- **Rutas Protegidas:** El layout principal `src/app/(app)/layout.tsx` verifica si el `onboardingComplete` es `true`. Si no, redirige al usuario a la página `/welcome`.

## 4. Estructura de Archivos

La estructura del proyecto sigue las convenciones de Next.js App Router.

```
src
├── app/
│   ├── (app)/                # Rutas que usan el layout principal de la app
│   │   ├── layout.tsx        # Layout con la barra lateral y cabecera
│   │   ├── inicio/
│   │   ├── movimientos/
│   │   └── ... (todas las páginas de los módulos)
│   ├── welcome/              # Página de bienvenida y selección de módulos
│   ├── login/
│   ├── globals.css           # Estilos globales y variables de CSS para el tema
│   └── layout.tsx            # Layout raíz de la aplicación
├── components/
│   ├── kavexa/               # Componentes de UI específicos de la aplicación
│   └── ui/                   # Componentes genéricos de Shadcn/UI
├── contexts/
│   ├── app-context.tsx       # El "cerebro" de la app
│   └── auth-context.tsx      # Maneja el estado de autenticación (futuro)
├── hooks/
│   └── use-local-storage.ts  # Hook para interactuar con localStorage
├── lib/
│   ├── data.ts               # Datos iniciales/mock y configuración de módulos
│   ├── types.ts              # Definiciones de tipos de TypeScript (muy importante)
│   └── utils.ts              # Funciones de utilidad (ej. cn para clases de Tailwind)
└── ...
```

## 5. Guía de Módulos

A continuación se detalla el propósito de cada módulo y los componentes clave asociados.

- **`inicio`**: Dashboard principal. Muestra resúmenes financieros (`summary`) y gráficos (`chartData`) calculados en `useMemo` para optimizar el rendimiento. También muestra `Actividad Reciente`, que es una combinación de las últimas alertas y notificaciones de inventario.

- **`movimientos`**: Gestiona todas las transacciones. Usa `useMemo` para filtrar las transacciones por mes, año y término de búsqueda. El gráfico de pastel `egressByCategory` muestra la distribución de gastos.
  - **Componente Clave:** `AddTransactionSheet`, un formulario complejo con lógica condicional para manejar diferentes tipos de ingresos y egresos.

- **`pos` (Punto de Venta)**: Una interfaz rápida para ventas. Mantiene un estado local (`cart`) para el carrito de compras. Al finalizar la venta (`handleCheckout`), llama a la función `addTransaction` del `AppContext` para registrar cada item como una transacción de ingreso y actualizar el inventario.

- **`inventario`**: CRUD (Crear, Leer, Actualizar, Borrar) para los productos. Muestra una insignia (`Badge`) de color rojo si el `stock` es menor que el `lowStockThreshold`.
  - **Componente Clave:** `ProductFormSheet`, el formulario para añadir y editar productos.

- **`clientes`**: CRUD para la base de clientes. Pensado también para gestionar membresías (ej. gimnasios). El estado "Activo/Inactivo" y la "Última Compra" ayudan a controlar el estado de los miembros.

- **`proveedores`**: CRUD simple para la información de contacto de los proveedores. Su estructura es muy similar a la del módulo de Clientes.

- **`suscripciones`**: Permite registrar gastos fijos mensuales (egresos).
  - **Lógica Clave:** En `app-context.tsx`, un `useEffect` se encarga de revisar periódicamente si una suscripción está por vencer y genera una alerta (`subscription_due`) si es necesario.

- **`demanda`**: Identifica productos con tendencia de ventas a la baja.
  - **Lógica Clave:** Usa la función `calculateLinearRegression` (`src/lib/math-utils.ts`) sobre el historial de ventas de cada producto para calcular la pendiente de la tendencia.

- **`proyeccion`**: Estima el flujo de caja futuro.
  - **Lógica Clave:** Calcula una media móvil de los ingresos/egresos netos de los últimos 30 días y la proyecta a futuro para estimar el balance.

- **`alertas`**: Muestra las notificaciones generadas por el sistema. Permite al usuario interactuar con ellas (marcar como resuelta, ignorar o pagar una suscripción).

- **`perfil`**: Permite al usuario configurar la aplicación (moneda, tema oscuro/claro, módulos activados). También contiene la lógica para importar/exportar datos en formato CSV y para borrar todos los datos locales.

## 6. Cómo Empezar (Desarrollo Local)

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

---
¡Feliz codificación!
