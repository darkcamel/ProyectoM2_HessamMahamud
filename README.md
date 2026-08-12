# Blog API — Proyecto M2

API REST tipo JSONPlaceholder construida con Node.js, Express y PostgreSQL, que gestiona `authors`, `posts` y `comments` (extra credit). Incluye validaciones, manejo de errores centralizado, pruebas unitarias, documentación OpenAPI y despliegue en Railway.

- **Repositorio:** https://github.com/darkcamel/ProyectoM2_HessamMahamud
- **Aplicación en producción (Railway):** https://proyectom2hessammahamud-production.up.railway.app/

## Tecnologías

- **Node.js** (ES Modules) + **Express**
- **PostgreSQL** con el driver `pg` (queries parametrizadas, sin ORM)
- **`process.loadEnvFile`** nativo de Node para variables de entorno (sin `dotenv`)
- **`node --watch`** para desarrollo (sin `nodemon`)
- **Vitest** + **Supertest** para pruebas unitarias
- **Swagger UI** para documentación OpenAPI
- Desplegado en **Railway**

## Arquitectura

El proyecto sigue una arquitectura en capas, separando responsabilidades:

```
route → controller → service → base de datos
```

- **`routes/`**: define qué verbo HTTP + path dispara qué función del controller. No contiene lógica.
- **`controllers/`**: valida el request, orquesta llamadas a uno o varios services, arma la respuesta HTTP (status code + body).
- **`services/`**: única capa que ejecuta queries SQL. Un service solo conoce su propia tabla; nunca importa otro service.
- **`middleware/`**: `asyncHandler` (envuelve los controllers async para propagar errores automáticamente) y `errorHandler` (manejador de errores centralizado).
- **`utils/AppError.js`**: clase de error personalizada con `statusCode`, usada en toda la aplicación para errores esperados (validaciones, recursos no encontrados, etc.).

### Estructura de carpetas

```
src/
├── config/                # pool.config.js, run-setup-sql.js, run-seed-sql.js
├── db/                    # setup.sql, seed.sql
├── controllers/           # authors, posts, comments
├── routes/                # authors, posts, comments
├── services/              # authors, posts, comments
├── middleware/            # asyncHandler, errorHandler
├── utils/                 # AppError
├── tests/                 # api.test.js (vitest + supertest, services mockeados)
├── docs/                  # swagger.yaml (OpenAPI)
└── server.js              # configuración de Express (middlewares, routers)

index.js                   # levanta el servidor (app.listen) — sigue fuera
```

## Modelo de datos

- **authors**: `id, name, email (único), bio, created_at`
- **posts**: `id, title, content, author_id (FK -> authors), published, created_at`
- **comments**: `id, post_id (FK -> posts), author_id (FK -> authors), content, created_at`

Relaciones: un author tiene muchos posts; un post tiene muchos comments; un author también puede tener muchos comments. Los borrados son en cascada (`ON DELETE CASCADE`): eliminar un author borra sus posts y comments; eliminar un post borra sus comments.

## Instalación y uso local

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/darkcamel/ProyectoM2_HessamMahamud.git
cd ProyectoM2_HessamMahamud
npm install
```

### 2. Configurar variables de entorno

Copiá `.env.example` a `.env` y completá los valores según tu instancia local de PostgreSQL:

```bash
cp .env.example .env
```

Variables requeridas:

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de la base de datos |
| `DB_PORT` | Puerto de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_MAX` | Máximo de conexiones del pool (default: `20`) |
| `DB_IDLE_TIMEOUT_MILLIS` | Timeout de conexiones inactivas en ms (default: `30000`) |
| `DB_CONNECTION_TIMEOUT_MILLIS` | Timeout de conexión en ms (default: `2000`) |
| `PORT` | Puerto en el que corre el servidor (ej: `3001`) |

### 3. Crear las tablas en la base de datos

```bash
npm run db:setup
```

Este comando ejecuta el script `src/config/run-setup-sql.js`, que lee `src/db/setup.sql` y crea las tablas `authors`, `posts` y `comments` con sus respectivas claves foráneas. Usa `CREATE TABLE IF NOT EXISTS`, por lo que es seguro correrlo varias veces.

### 4. (Opcional) Poblar la base con datos de ejemplo

```bash
npm run db:seed
```

Este comando ejecuta `src/config/run-seed-sql.js`, que inserta registros de ejemplo desde `src/db/seed.sql`. Es útil para pruebas rápidas. Los datos incluyen 3 autores, 5 posts y 7 comentarios.

### 5. Levantar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:<PORT>` con recarga automática (`node --watch`).

### 6. Levantar el servidor en modo producción

```bash
npm start
```

## Scripts npm

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor con `node --watch` (recarga automática) |
| `npm run db:setup` | Crea las tablas en la base de datos desde `src/db/setup.sql` |
| `npm run db:seed` | Inserta datos de ejemplo desde `src/db/seed.sql` |
| `npm test` | Ejecuta los tests con Vitest |

## Documentación de la API (Swagger)

Con el servidor corriendo, la documentación interactiva está disponible en:

```
http://localhost:<PORT>/api-docs
```

En producción: https://proyectom2hessammahamud-production.up.railway.app/api-docs

## Endpoints principales

### Authors

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/authors` | Listar todos los authors |
| `GET` | `/authors/:id` | Obtener un author por id |
| `POST` | `/authors` | Crear un author |
| `PUT` | `/authors/:id` | Actualizar un author |
| `DELETE` | `/authors/:id` | Eliminar un author (borra en cascada sus posts y comments) |

### Posts

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/posts` | Listar todos los posts |
| `GET` | `/posts/:id` | Obtener un post por id |
| `GET` | `/posts/author/:authorId` | Listar los posts de un author |
| `POST` | `/posts` | Crear un post |
| `PUT` | `/posts/:id` | Actualizar un post |
| `DELETE` | `/posts/:id` | Eliminar un post (borra en cascada sus comments) |

### Comments

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/posts/:postId/comments` | Listar los comments de un post |
| `POST` | `/comments` | Crear un comment |

## Validaciones

- **authors**: `name` y `email` requeridos; `email` debe ser único.
- **posts**: `title`, `content` y `author_id` requeridos; `author_id` debe corresponder a un author existente.
- **comments**: `content`, `post_id` y `author_id` requeridos; `post_id` y `author_id` deben corresponder a registros existentes.

Todas las respuestas de error en el handler siguen el formato `{ "error": "mensaje descriptivo" }`, con el status code correspondiente (`400`, `404`, `500`).

## Pruebas

```bash
npm test
```

Las pruebas usan `vitest` y `supertest`, mockeando la capa de services (`vi.mock`) para no depender de una base de datos real. Cubren el flujo principal y los casos de error más relevantes de `authors`, `posts` y `comments`.

## Despliegue

El proyecto está desplegado en [Railway](https://railway.app), con un servicio para la aplicación Node.js y otro para PostgreSQL. Las variables de entorno de conexión a la base se configuran referenciando las variables del servicio de PostgreSQL de Railway.

### Pasos resumidos para desplegar en Railway:

1. Subí el código a GitHub (repositorio público).
2. En Railway, creá un nuevo proyecto desde el repositorio.
3. Agregá un servicio PostgreSQL (Railway provee las variables de entorno automáticamente).
4. Configurá las variables de entorno que no están en el servicio de Postgres (ej. `PORT`).
5. Conectate a la base de datos de Railway desde la consola (`railway connect`) o usando la interfaz web y ejecutá `npm run db:setup` para crear las tablas.
6. La aplicación se desplegará automáticamente y recibirá una URL pública.

> **Nota:** En Railway no se utiliza un archivo `.env` físico; las variables se definen en el panel de control. El código está preparado para cargar `.env` solo en desarrollo (`NODE_ENV !== 'production'`).

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó Claude (Anthropic) como asistente para:

- Planificación de la arquitectura y diseño de la base de datos.
- Revisión de código y corrección de errores (middlewares, validaciones, manejo de errores).
- Generación de la documentación OpenAPI y este README.
- Asistencia en el despliegue y configuración de Railway.

Para más detalles, consultar el archivo [`USO_DE_IA.md`](USO_DE_IA.md) y la lista de prompts relevantes en [`PROMPTS_OUTPUTS.md`](PROMPTS_OUTPUTS.md).

## Licencia

ISC

---