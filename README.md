# Frontend - Motion Manager

Aplicacion web construida con React, TypeScript y Vite para la gestion de vehiculos de Motion Manager. Incluye autenticacion, registro, recuperacion de contrasena, rutas protegidas, control por rol y una interfaz responsive con animaciones.

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Lucide React
- ESLint

## Requisitos

- Node.js 20 o superior recomendado
- npm
- Backend ejecutandose localmente o disponible mediante URL publica

## Instalacion

Desde la carpeta `frontend`:

```bash
npm install
```

## Variables de entorno

El frontend consume la API usando `VITE_API_URL`.

Crea un archivo `.env` dentro de `frontend` si necesitas cambiar la URL del backend:

```env
VITE_API_URL=http://localhost:8000
```

Si no se define, la aplicacion usa por defecto:

```text
http://localhost:8000
```

## Scripts

```bash
npm run dev
```

Levanta el servidor de desarrollo de Vite.

```bash
npm run build
```

Compila TypeScript y genera el build de produccion en `dist`.

```bash
npm run preview
```

Sirve localmente el contenido generado en `dist`.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Uso en desarrollo

1. Instala dependencias:

```bash
npm install
```

2. Asegurate de tener el backend corriendo.

3. Configura `VITE_API_URL` si el backend no esta en `http://localhost:8000`.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrara la URL local para abrir la aplicacion en el navegador.

## Funcionalidades

- Home publico con animaciones.
- Login con loader full screen antes de entrar.
- Registro con login automatico y loader full screen.
- Cierre de sesion con loader full screen.
- Recuperacion de contrasena.
- Sesion guardada en `localStorage`.
- Redireccion automatica al login cuando la API responde `401`.
- Rutas protegidas para usuarios autenticados.
- Bloqueo de login/register/forgot-password cuando el usuario ya esta autenticado.
- Gestion de vehiculos desde `/vehicles`.
- Creacion, edicion y eliminacion inline de vehiculos.
- Confirmacion visual antes de eliminar.
- Skeleton loading para carga inicial de datos.
- Tabla responsive con truncado de texto y tooltip nativo usando `title`.
- Acciones restringidas por rol `admin`.

## Rutas principales

- `/home`: pantalla de inicio publica.
- `/login`: inicio de sesion.
- `/register`: registro de usuario.
- `/forgot-password`: recuperacion de contrasena.
- `/vehicles`: listado y gestion de vehiculos.
- `/vehicles/create`: ruta protegida para crear vehiculos, solo `admin`.
- `/vehicles/:vehicleId/edit`: ruta protegida para editar vehiculos, solo `admin`.

## Estructura

```text
src/
  api/                 Configuracion base de Axios
  app/
    layouts/           Layout principal autenticado
    router/            Rutas protegidas y control por rol
  assets/              Imagenes, logos e iconos SVG
  features/
    auth/              Paginas, componentes y API de autenticacion
    vehicles/          Paginas, API, modelos y componentes de vehiculos
  shared/
    ui/                Componentes compartidos de interfaz
    utils/             Utilidades compartidas
  store/               Estado global de autenticacion
```

## Integracion con backend

El cliente usa Axios desde `src/api/axios.ts`.

- La URL base sale de `VITE_API_URL`.
- Si existe token de sesion, se envia como `Authorization: Bearer <token>`.
- Si la API responde `401`, se limpia la sesion y se redirige al login.

Endpoints consumidos principalmente:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`

## Build de produccion

```bash
npm run build
```

El resultado queda en:

```text
dist/
```

Para probar el build:

```bash
npm run preview
```
