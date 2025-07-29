# Kavexa - Documentación para Desarrolladores

Bienvenido al repositorio de Kavexa. Este documento sirve como una guía técnica para los desarrolladores que trabajan en el proyecto. Está diseñado para ser claro y conciso.

## 1. Visión General del Proyecto

Kavexa es una Aplicación Web Progresiva (PWA) modular construida con un enfoque **"local-first"**. Su objetivo es proporcionar a las pequeñas y medianas empresas (PYMES) un conjunto de herramientas para gestionar sus operaciones diarias, desde las finanzas hasta el inventario, clientes y proveedores. La aplicación es 100% funcional sin conexión a internet y prioriza la velocidad y la privacidad del usuario.

## 2. Stack Tecnológico

La aplicación está construida con un stack moderno y enfocado en la productividad y el rendimiento.

- **Framework:** [Next.js](https://nextjs.org/) (usando el App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Librería de UI:** [React](https://reactjs.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/)
- **Validación de Esquemas:** [Zod](https://zod.dev/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **PWA:** [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa) para la funcionalidad offline.

## 3. Arquitectura y Conceptos Clave

### 3.1. Enfoque "Local-First" y Offline (PWA)

Esta es la característica más importante de la arquitectura. **Todos los datos del usuario se almacenan en el `localStorage` del navegador.**

- **¿Cómo funciona?** A través del hook `useLocalStorage` (`src/hooks/use-local-storage.ts`). Este hook actúa como el `useState` de React, pero sincroniza automáticamente el estado con el `localStorage`.
- **Funcionalidad Offline:** Kavexa es una PWA. Utiliza un *Service Worker* para cachear todos los recursos de la aplicación, permitiendo que funcione perfectamente sin conexión.
- **Ventajas:**
  - **Velocidad Extrema:** La lectura y escritura de datos es instantánea.
  - **Funcionalidad Offline Completa:** La aplicación funciona sin conexión.
  - **Privacidad:** Los datos del negocio no salen del dispositivo del usuario.

### 3.2. Gestión de Estado Global: `AppContext`

El archivo `src/contexts/app-context.tsx` es el **cerebro de la aplicación**. Contiene todos los estados (transacciones, inventario, etc.) y las funciones de lógica de negocio (`addTransaction`, `addAlert`, etc.). Centraliza la lógica para mantener la consistencia en toda la aplicación (ej. actualizar el stock y revisar si hay que generar una alerta después de una venta).

### 3.3. Diseño Modular

El usuario puede elegir qué módulos usar desde la pantalla de bienvenida (`/welcome`). El menú de navegación se adapta a esta selección. Las rutas están protegidas para que solo los módulos activos sean accesibles.

## 4. Guía de Módulos y Funcionalidades Clave

- **`inicio`**: Dashboard principal con resúmenes financieros y las alertas más recientes.
- **`movimientos`**: CRUD completo para transacciones financieras.
- **`pos` (Punto de Venta)**: Interfaz rápida para ventas que actualiza el inventario en tiempo real.
- **`inventario`**: CRUD para productos, con alertas de stock bajo.
- **`clientes` y `proveedores`**: CRUD para gestionar contactos.
- **`suscripciones`**: Gestión de gastos recurrentes con alertas de vencimiento.
- **`demanda`**: Análisis de tendencia de ventas (regresión lineal) y de "días fuertes" de venta por producto.
- **`proyeccion`**: Estimación del flujo de caja futuro basado en una media móvil.
- **`alertas`**: Centro de notificaciones donde el usuario puede ver, gestionar y eliminar alertas.
  - **Alertas del Sistema**: Gastos inusuales, stock bajo, vencimiento de suscripciones, y oportunidades de venta.
  - **Alertas Manuales (Recordatorios)**: Los usuarios pueden crear sus propios recordatorios, programarlos para una fecha y hora específicas, y configurarlos para que se repitan (diaria, semanal, mensualmente).
- **`perfil`**: Configuración de la aplicación (moneda, tema, módulos), gestión de datos (importar/exportar CSV, eliminar todo) y control de notificaciones push.

## 5. Notificaciones Push

Kavexa puede enviar notificaciones nativas del sistema operativo para alertar al usuario sobre eventos importantes (nuevas alertas de stock, recordatorios, etc.) incluso si la aplicación no está en primer plano. El usuario debe conceder permiso explícitamente desde la página de "Perfil".

## 6. Visión a Futuro y Monetización

El proyecto está diseñado para escalar. El siguiente paso natural es la introducción de un **modelo Freemium**.

- **Capa Gratuita**: La versión actual, 100% funcional y "local-first", que sirve como una potente herramienta gratuita.
- **Capa Pro (de pago)**: Requerirá la implementación de un sistema de autenticación y un backend. Las funcionalidades de pago podrían incluir:
  - **Sincronización en la nube** entre dispositivos.
  - **Colaboración en equipo** con roles y permisos.
  - **Módulos de IA avanzados** (pronóstico de demanda, chat con datos, etc.).
  - **Reportes en PDF** y exportaciones avanzadas.
  - **Integraciones** con otras plataformas.

## 7. Cómo Empezar (Desarrollo Local)

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Daleth-Barreto/kavexa-web-frontend.git
    cd kavexa-web-frontend
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
