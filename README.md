# EnRuta App - Gestión de Cooperativas de Transporte

¡Bienvenido a EnRuta App! Esta es una aplicación web moderna diseñada para la gestión integral de cooperativas de transporte de pasajeros. Permite administrar buses, rutas, horarios, clientes, ventas y configuraciones de la empresa de manera centralizada y eficiente.

La aplicación está construida con las últimas tecnologías web, ofreciendo una experiencia de usuario rápida, responsive y escalable.

---

## 🚀 Estructura de Carpetas

El proyecto sigue una arquitectura modular y escalable, inspirada en Clean Architecture y Domain-Driven Design. Los directorios principales son:

- **`/public`**: Contiene todos los archivos estáticos como imágenes, logos, iconos y fuentes.
- **`/src`**: El corazón de la aplicación.
  - **`/app`**: Contiene el enrutamiento, layouts y páginas de la aplicación, siguiendo el estándar de Next.js App Router.
    - **`/(auth)`**: Rutas de autenticación (login, registro).
    - **`/(main)`**: Rutas principales de la aplicación que requieren autenticación.
    - **`/api`**: Endpoints de la API, como la configuración de NextAuth.js.
  - **`/components`**: Componentes de UI reutilizables y genéricos (botones, inputs, dialogs), basados en `shadcn/ui`.
  - **`/core`**: Lógica central y transversal de la aplicación.
    - **`/constants`**: Constantes globales (rutas de API, assets).
    - **`/context`**: React Contexts para estado global (ej. `TenantContext`).
    - **`/infrastructure`**: Clientes de API (Axios), configuración de `react-query`, etc.
  - **`/features`**: Módulos funcionales de la aplicación. Cada feature (ej. `buses`, `rutas`, `clientes`) contiene:
    - **`/components`**: Componentes específicos de la feature.
    - **`/hooks`**: Hooks de React para la lógica de la feature.
    - **`/interfaces`**: Tipos y interfaces de TypeScript.
    - **`/services`**: Lógica de comunicación con la API.
    - **`/schemas`**: Esquemas de validación (Zod).
    - **`/presentation`**: Vistas y componentes de alto nivel que unen la lógica de la feature.
  - **`/lib`**: Utilidades genéricas, como la función `cn` de `shadcn/ui`.
  - **`/shared`**: Componentes y hooks compartidos que no son específicos de una feature pero tampoco son "core".

---

## 📜 Convenciones de Código

Para mantener el código limpio, legible y consistente, seguimos las siguientes convenciones:

- **Nomenclatura**:
  - **Componentes:** `PascalCase` (ej. `BusTable.tsx`).
  - **Archivos (no componentes):** `kebab-case` (ej. `bus.service.ts`).
  - **Variables y Funciones:** `camelCase` (ej. `const busModels = ...`).
  - **Interfaces y Tipos:** `PascalCase` (ej. `interface Bus { ... }`).
- **Estructura de Componentes**:
  1. Hooks de React (`useState`, `useEffect`, etc.).
  2. Hooks de librerías (`useRouter`, `useQuery`).
  3. Funciones manejadoras de eventos (`handle...`).
  4. Renderizado del componente (JSX).
- **Estilo de Código**:
  - El proyecto está configurado con **ESLint** y **Prettier** para formateo automático y análisis de código. Asegúrate de tener las extensiones correspondientes en tu editor y formatea el código antes de hacer un commit.

---

## 🏗️ Arquitectura y Flujo de Datos

La aplicación utiliza una arquitectura limpia para separar responsabilidades, haciendo el código más mantenible y testeable.

- **Flujo de Datos Típico (Ejemplo: Cargar Buses)**:

  1. **UI (`BusesView.tsx`)**: El usuario navega a la página de buses.
  2. **Hook (`useBuses.ts`)**: El componente llama al hook `useBuses()`.
  3. **React Query**: Dentro del hook, `useQuery` se activa con una `queryKey` única (ej. `['buses']`).
  4. **Función de Fetching**: `useQuery` ejecuta la función de fetching, que a su vez llama al `BusService.getAll()`.
  5. **Servicio (`bus.service.ts`)**: El servicio construye la petición HTTP y la envía al backend usando el cliente **Axios**.
  6. **Estado y UI**: Los datos del backend son cacheados por React Query. El hook `useBuses` devuelve el estado (`data`, `loading`, `error`) que la UI utiliza para renderizarse.

- **Manejo de Estado Global**:
  - **TanStack Query**: Es la opción preferida para gestionar el estado del servidor (datos que vienen de la API). Se encarga del cacheo, re-intentos y sincronización.
  - **React Context**: Se utiliza para estado global de UI que no es del servidor, como el tema de la aplicación (`ThemeProvider`) o la información del tenant/usuario actual (`TenantContext`).

---

## ⚙️ Gestión de Estado con `TanStack Query`

`TanStack Query` es fundamental para la gestión de datos asíncronos en la aplicación.

- **Estructura de Query Keys**: Las `query keys` son la base del cacheo. Se definen en archivos `[feature]-keys.ts` (ej. `bus-keys.ts`) y siguen una estructura jerárquica para permitir una invalidación precisa.

  ```typescript
  // Ejemplo de bus-keys.ts
  export const busKeys = {
    all: ["buses"],
    lists: () => [...busKeys.all, "list"],
    list: (filters: string) => [...busKeys.lists(), { filters }],
    details: () => [...busKeys.all, "detail"],
    detail: (id: string) => [...busKeys.details(), id],
  };
  ```

- **Mutaciones y Actualización de UI**:
  - Para crear, actualizar o eliminar datos (`POST`, `PUT`, `DELETE`), se utiliza el hook `useMutation`.
  - Después de una mutación exitosa, se utiliza `queryClient.invalidateQueries` con la `queryKey` correspondiente para invalidar el caché y forzar un `refetch` de los datos, manteniendo la UI siempre sincronizada.

---

## 🎨 UI, Componentes y Theming

La interfaz de usuario se construye de manera modular y consistente.

- **`shadcn/ui`**: Es la base de nuestros componentes de UI. Para añadir un nuevo componente (ej. `Accordion`), se utiliza su CLI:
  ```bash
  npx shadcn-ui@latest add accordion
  ```
- **Componentes Reutilizables**:
  - **Generales**: Componentes de UI puros y muy reutilizables van en `/src/components/ui`.
  - **Específicos de un Módulo**: Componentes que solo se usan dentro de una `feature` van en `/src/features/[nombre-feature]/components`.
- **Theming**:
  - El tema (claro/oscuro) es gestionado por `ThemeProvider`.
  - Los colores y estilos globales de Tailwind CSS se definen en `tailwind.config.js` y las variables CSS en `/src/app/globals.css`.

---

## 🛠️ Instalación

Sigue estos pasos para configurar el entorno de desarrollo local:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/en-ruta-app.git
    cd en-ruta-app
    ```

2.  **Instalar dependencias:**
    El proyecto utiliza `npm` como gestor de paquetes.

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade las variables necesarias.

---

## 🔑 Variables de Entorno

Para ejecutar el proyecto, necesitas un archivo `.env.local` con las siguientes variables:

| Variable              | Descripción                                         | Ejemplo                            |
| --------------------- | --------------------------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base del backend al que se conecta la app.      | `http://api.enruta.com/v1`         |
| `NEXTAUTH_URL`        | URL de la aplicación, usada por NextAuth.js.        | `http://localhost:3000`            |
| `NEXTAUTH_SECRET`     | Una clave secreta para firmar los tokens de sesión. | `cualquier_string_largo_y_secreto` |

---

## 📦 Dependencias Principales

- **Framework**: [Next.js](https://nextjs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Gestión de Estado**: [TanStack Query (React Query)](https://tanstack.com/query/v4)
- **Formularios**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/)
- **Peticiones HTTP**: [Axios](https://axios-http.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

---

## ▶️ Ejecución

Una vez instalado, puedes ejecutar la aplicación con los siguientes comandos:

1.  **Iniciar el servidor de desarrollo:**

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

2.  **Construir para producción:**

    ```bash
    npm run build
    ```

    Este comando genera una versión optimizada de la aplicación en la carpeta `.next`.

3.  **Ejecutar la versión de producción:**
    ```bash
    npm start
    ```
    Este comando inicia un servidor con la build de producción.

¡Gracias por contribuir y ser parte de EnRuta App!
