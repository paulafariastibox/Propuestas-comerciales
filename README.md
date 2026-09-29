# Portal de Propuestas TIBOX

MVP del portal para publicar propuestas comerciales TIBOX como experiencias web privadas.

## Objetivo
Permitir crear y compartir propuestas comerciales mediante una URL privada, con acceso por PIN o por email + OTP, soporte para propuestas HTML interactivas y documentos PDF, y trazabilidad básica de visualizaciones.

## Estado
MVP en desarrollo. No utilizar aún para información real o confidencial.

> Importante: el repositorio está actualmente **público**. Antes de almacenar propuestas, datos de clientes, credenciales o variables de entorno, debe cambiarse a **privado**.

## MVP
- Dashboard de propuestas
- Nueva propuesta
- Datos de cliente, RUT, contacto, email, KAM y oportunidad
- Vigencia y estado
- Acceso por Link + PIN
- Acceso por Email + OTP (simulado en el MVP)
- Propuesta HTML interactiva de demostración
- Soporte conceptual para PDF / HTML
- Métricas básicas de apertura

## Demo
La primera propuesta de demostración está inspirada en un proyecto de modernización de sitio web, pero los datos de acceso y valores del MVP son ficticios.

## Próximos pasos de producción
1. Microsoft Entra ID para administración interna.
2. Base de datos PostgreSQL o Azure SQL.
3. Azure Blob Storage para PDFs/HTML.
4. OTP real por SendGrid.
5. Auditoría y eventos de visualización.
6. Dominio `propuestas.tibox.cl`.
7. Integración posterior con Tibox Navigator/CRM.
