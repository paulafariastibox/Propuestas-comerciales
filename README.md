# Portal de Propuestas TIBOX

Aplicación para publicar propuestas comerciales privadas como experiencias web, PDF o PowerPoint convertido, con acceso por PIN/OTP y trazabilidad.

## Stack

**Frontend**
- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router

**Backend preparado**
- Node.js + Express + TypeScript
- SQL Server / Azure SQL mediante `mssql`
- Azure Blob Storage mediante `@azure/storage-blob`
- Acceso temporal mediante JWT
- PIN con hash bcrypt

## Estructura

```
/
├── src/                  # React + Vite + Tailwind
├── server/               # API TypeScript
├── database/schema.sql   # SQL Server / Azure SQL
├── .env.example
└── vite.config.ts
```

## Flujo

1. El equipo TIBOX crea una propuesta.
2. Define cliente, contacto, KAM, vigencia y acceso.
3. Carga HTML, PDF o PPTX.
4. El API guarda metadata en SQL Server / Azure SQL.
5. El archivo se guarda en Azure Blob Storage privado.
6. Se genera una URL `/p/{token}`.
7. El cliente valida PIN u OTP.
8. El API entrega el contenido sólo durante una sesión autorizada.
9. Las aperturas quedan registradas en `ProposalEvents`.

## Ejecutar frontend en modo demo

```bash
npm install
npm run dev
```

La demo utiliza `VITE_DEMO_MODE=true` y no requiere base de datos.

- Cliente demo: `/p/demo-web`
- PIN demo: `2468`
- OTP demo: `482731`

## Ejecutar API

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Mientras SQL y Blob no estén configurados, el API usa memoria + almacenamiento local para facilitar el desarrollo.

## Activar SQL Server / Azure SQL

1. Ejecutar `database/schema.sql` en una base de desarrollo.
2. Configurar en `server/.env`:
   - `SQL_SERVER`
   - `SQL_DATABASE`
   - `SQL_USER`
   - `SQL_PASSWORD`
3. Mantener `SQL_ENCRYPT=true` para Azure SQL.

> El script actual es de bootstrap para una base de desarrollo nueva. Para producción debe reemplazarse por migraciones incrementales.

## Activar Azure Blob Storage

Configurar:
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER=propuestas`

El contenedor debe mantenerse **privado**. El API autoriza y transmite el contenido; el navegador no recibe la connection string.

## Notas de seguridad

- No poner connection strings, passwords o secretos en variables `VITE_*`: esas variables terminan en el navegador.
- Los secretos pertenecen exclusivamente al backend.
- El repositorio debe ser privado antes de incorporar datos reales de clientes.
- HTML de terceros debe seguir mostrándose dentro de un iframe con `sandbox` y una CSP restrictiva.
- El OTP incluido actualmente es sólo un stub de desarrollo. En producción debe conectarse a SendGrid, Azure Communication Services u otro proveedor.
- Para PPT/PPTX falta el worker de conversión a PDF/imágenes antes de visualizarlo.
- Para producción se recomienda Microsoft Entra ID para administradores internos y Managed Identity cuando se despliegue en Azure.

## Próximas fases

- Login interno con Microsoft Entra ID.
- OTP real por email.
- Conversión PPTX -> PDF/imágenes.
- Versionado y revocación.
- Analítica por sección y tiempo de lectura.
- Integración con Tibox Navigator/CRM.
- Despliegue Azure Static Web Apps/App Service + Azure SQL + Blob Storage.
