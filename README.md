# Hospedaje Familiar Cusco - Web & CMS

Solución integral (Frontend y CMS) para un hospedaje familiar en Cusco, construida con una arquitectura moderna, escalable y de alto rendimiento.

## 🚀 Stack Tecnológico

* **Framework:** Next.js 15 (App Router)
* **CMS / Backend:** Payload CMS v3
* **Base de Datos:** PostgreSQL (mediante Drizzle ORM)
* **Almacenamiento de Archivos:** Cloudflare R2 (S3 API)
* **Estilos:** Tailwind CSS v4
* **Lenguaje:** TypeScript

## ⚙️ Configuración y Variables de Entorno

Para ejecutar este proyecto, configura tus variables de entorno basándote en la plantilla de la raíz:

1. **`.env.template`**: Plantilla base. **Se sube al repositorio**.
2. **`.env`**: Variables base del proyecto. **NO se sube**.
3. **`.env.local`**: Sobrescribe `.env` para tu desarrollo local. **NO se sube**.

**Pasos:** Duplica el archivo `.env.template`, renómbralo a `.env.local` y completa los valores con tus credenciales reales (Postgres, Payload, Cloudflare R2).

## 🗄️ Flujo de Base de Datos y Migraciones

Payload CMS v3 usa **Migraciones** para sincronizar de forma estricta tu código con la base de datos PostgreSQL, evitando pérdida accidental de datos.

### Entorno Local (Desarrollo)

Al modificar la estructura de datos (ej. añadir campos o colecciones), sigue estos dos pasos:

**1. Generar la migración (`migrate:create`)**

~~~bash
npm run migrate:create -- --name nombre-descriptivo
~~~
* Payload detecta los cambios y genera un archivo automatizado en `src/migrations/` con las instrucciones SQL.

**2. Aplicar la migración (`migrate`)**

~~~bash
npm run migrate
~~~
* Ejecuta el archivo generado para actualizar físicamente tu BD local.

> **Regla de oro:** ¡No edites los archivos de `src/migrations/` manualmente! Estos archivos **deben subirse a tu repositorio de Git**, ya que contienen el historial de tu BD.

### Entorno de Producción (VPS / Docker)

En producción solo aplicamos las migraciones existentes:

1. **Despliegue:** Haz `git pull` de tu código (incluyendo la carpeta `src/migrations/`) en tu VPS.
2. **Aplicar cambios:** Al ejecutar el contenedor Docker, asegúrate de correr:
   ~~~bash
   npm run migrate
   ~~~
3. Payload detectará las migraciones pendientes y actualizará la base de datos de producción de forma segura.

## 💻 Instalación y Ejecución Local

1. Clona el repositorio e instala las dependencias:
   ~~~bash
   npm install
   ~~~
2. Configura tu archivo `.env.local`.
3. Aplica las migraciones iniciales a tu base de datos:
   ~~~bash
   npm run migrate
   ~~~
4. Inicia el servidor de desarrollo:
   ~~~bash
   npm run dev
   ~~~

El panel de administración estará disponible en `http://localhost:3000/admin`.