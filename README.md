# Blog API — Proyecto M2

API REST tipo JSONPlaceholder construida con Node.js, Express y PostgreSQL, que gestiona `authors`, `posts` y `comments`. Incluye validaciones, manejo de errores centralizado, pruebas unitarias, documentación OpenAPI y despliegue en Railway.

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

```
src/
├── config/         # pool.config.js, setup.sql, run-setup-sql.js
├── controllers/     # authors, posts, comments
├── routes/          # authors, posts, comments
├── services/        # authors, posts, comments
├── middleware/       # asyncHandler, errorHandler
├── utils/            # AppError
└── server.js         # configuración de Express (middlewares, routers)
tests/
└── api.test.js        # pruebas con vitest + supertest (services mockeados)
docs/
└── swagger.yaml        # documentación OpenAPI
index.js                # levanta el servidor (app.listen)
```

## Modelo de datos

- **authors**: `id, name, email (único), bio, created_at`
- **posts**: `id, title, content, author_id (FK -> authors), published, created_at`
- **comments**: `id, post_id (FK -> posts), author_id (FK -> authors), content, created_at`

Relaciones: un author tiene muchos posts; un post tiene muchos comments; un author también puede tener muchos comments. Los borrados son en cascada (`ON DELETE CASCADE`): eliminar un author borra sus posts y comments; eliminar un post borra sus comments.

## Instalación y uso local

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repo>
cd <carpeta-del-proyecto>
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

Esto ejecuta `src/config/setup.sql`, que crea las tablas `authors`, `posts` y `comments` con sus respectivas foreign keys (usa `CREATE TABLE IF NOT EXISTS`, es seguro correrlo varias veces).

### 4. Levantar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:<PORT>` con recarga automática (`node --watch`).

### 5. Levantar el servidor en modo producción

```bash
npm start
```

## Documentación de la API (Swagger)

Con el servidor corriendo, la documentación interactiva está disponible en:

```
http://localhost:<PORT>/api-docs
```

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

- `authors`: `name` y `email` requeridos; `email` debe ser único.
- `posts`: `title`, `content` y `author_id` requeridos; `author_id` debe corresponder a un author existente.
- `comments`: `content`, `post_id` y `author_id` requeridos; `post_id` y `author_id` deben corresponder a registros existentes.

Todas las respuestas de error siguen el formato `{ "error": "mensaje descriptivo" }`, con el status code correspondiente (`400`, `404`, `500`).

## Pruebas

```bash
npm test
```

Las pruebas usan `vitest` y `supertest`, mockeando la capa de services (`vi.mock`) para no depender de una base de datos real. Cubren el flujo principal y los casos de error más relevantes de `authors`, `posts` y `comments`.

## Despliegue

El proyecto está desplegado en [Railway](https://railway.app), con un servicio para la aplicación Node.js y otro para PostgreSQL. Las variables de entorno de conexión a la base se configuran referenciando las variables del servicio de PostgreSQL de Railway.