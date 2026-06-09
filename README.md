# ReviJob

Aplicación web para **organizar tu búsqueda de empleo**: registra tus postulaciones, hazles seguimiento por etapas y construye tu CV con varias versiones, todo desde una interfaz limpia con modo claro/oscuro.

> Interfaz en español. La aplicación funciona íntegramente en el navegador y guarda tus datos en `localStorage` (no requiere backend para empezar).

## Características

- **Seguimiento de postulaciones** con tres vistas intercambiables:
  - **Kanban** por estado (Pendiente, En revisión, Entrevista, Rechazada, Aceptada)
  - **Tabla** para una vista compacta y ordenable
  - **Calendario** según la fecha de postulación
- **Panel de detalle (drawer)** por postulación con empresa, puesto, plataforma, ubicación, salario, enlace, y registro de **comentarios y notas** con marca de tiempo.
- **Dashboard** con estadísticas y gráficas: totales, distribución por estado, por plataforma y por mes.
- **Generador de CV** con:
  - Datos personales, resumen, habilidades, competencias, experiencia, educación y proyectos
  - **Versionado** del CV (hasta 30 versiones, con etiqueta, restauración y renombrado)
  - **Color de acento** personalizable
  - **Exportación a PDF** y opción de subir un PDF propio
- **Tema claro/oscuro** que sigue la preferencia del sistema y se recuerda entre sesiones.
- **Banner de Google AdSense** opcional (desactivado por defecto; ver [configuración](#adsense-opcional)).

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| UI | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build / dev server | [Vite](https://vite.dev/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Enrutado | [React Router](https://reactrouter.com/) |
| Animaciones | [Framer Motion](https://www.framer.com/motion/) |
| Persistencia | `localStorage` (con `@supabase/supabase-js` ya disponible como dependencia para una futura migración) |
| Linting | ESLint + typescript-eslint |

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- npm (incluido con Node.js)

## Puesta en marcha

```bash
# Instalar dependencias
npm install

# Arrancar el servidor de desarrollo (con HMR)
npm run dev
```

Vite mostrará la URL local (por defecto `http://localhost:5173`).

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compila TypeScript (`tsc -b`) y genera el build de producción en `dist/`. |
| `npm run preview` | Sirve localmente el build de producción para verificarlo. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |

## Estructura del proyecto

```
src/
├─ components/        Componentes reutilizables
│  ├─ applications/   Vistas de postulaciones (Kanban, Tabla, Calendario, Drawer)
│  ├─ dashboard/      Gráficas del dashboard
│  └─ ui/             Primitivas de interfaz (Panel, Field, Button, StatCard…)
├─ context/           ThemeContext (modo claro/oscuro)
├─ layouts/           MainLayout (app) y PublicLayout (login/registro)
├─ pages/             HomePage, ApplicationsPage, CVPage, SettingsPage, Login, Register
├─ services/          Lógica de datos (applicationService, cvService, dashboardService)
├─ types/             Tipos de dominio (application, cv)
└─ utils/             Utilidades (generación de PDF del CV)
```

### Capa de datos

Los servicios (`src/services/`) exponen una **interfaz** (`EmploymentApplicationService`, `CVService`) con una implementación basada en `localStorage`. Esto permite desarrollar sin backend y sustituir más adelante la persistencia por Supabase u otra API sin tocar el resto de la aplicación.

## Rutas

| Ruta | Vista |
|------|-------|
| `/` | Dashboard (resumen de la búsqueda) |
| `/applications` | Postulaciones (Kanban / Tabla / Calendario) |
| `/cv` | Generador y versiones de CV |
| `/settings` | Ajustes |
| `/login`, `/register` | Acceso (maquetación) |

## AdSense (opcional)

El banner de anuncios está **desactivado por defecto** y no carga ningún script externo mientras no se configure. Para activarlo, edita [src/components/AdSenseBanner.tsx](src/components/AdSenseBanner.tsx) y define:

```ts
export const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'
export const ADSENSE_SLOT = '1234567890'
```

## Estado actual

- La autenticación (`/login`, `/register`) está implementada a nivel de **interfaz**; aún no hay integración real con un proveedor de identidad.
- La persistencia es local al navegador (`localStorage`); la dependencia de Supabase está incluida como preparación para una futura sincronización en la nube.

## Licencia

Software **propietario**. Copyright (c) 2026 Steven Gazo Maliaño. Todos los derechos reservados. El uso, copia, modificación o distribución requieren autorización escrita del titular. Consulta el archivo [LICENSE](LICENSE) para más detalles.
