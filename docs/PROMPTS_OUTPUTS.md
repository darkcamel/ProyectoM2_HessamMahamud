# Prompts y Outputs — Sesión de trabajo con IA

Este documento recopila una selección de los intercambios más pertinentes durante el desarrollo del proyecto, como evidencia del proceso de trabajo con IA descrito en `USO_DE_IA.md`. No se incluye la totalidad de la conversación, sino los momentos que mejor representan la metodología aplicada: planificación previa, revisión de código, corrección de errores y toma de decisiones.

---

## 1. Planificación antes de escribir código

**Prompt:**
> Tengo que hacer este proyecto. No me interesa que me empieces a vomitar codigo. Necesito aprender a pensar como un DEV. Entonces antes de sentarse a escribir codigo un dev que le pasan esta consigna que hace.

**Output (resumen):**
La IA propuso un proceso de siete pasos previos a escribir código: (1) leer la consigna dos veces para detectar ambigüedades —señalando una inconsistencia real entre `authors` y `author_id -> users.id`—, (2) modelar entidades y relaciones antes que endpoints, (3) diseñar el esquema SQL con tipos y constraints, (4) diseñar la arquitectura de carpetas (routes/services/db/middlewares), (5) definir el contrato de cada endpoint (request/response/status codes), (6) definir la estrategia de testing, y (7) definir configuración de entorno y secretos.

---

## 2. Definición de contratos de endpoints (revisión guiada, no entregada)

**Prompt:**
> [el usuario envía su propio borrador de contratos para authors y posts, incompleto]
> Hasta ahí voy ayudame con el resto

**Output (resumen):**
En lugar de completar directamente todos los contratos, la IA desarrolló en profundidad el ejemplo de `POST /authors` (incluyendo la distinción entre error `400` por dato vacío vs. error por conflicto de unicidad), y devolvió al usuario la tarea de aplicar el mismo razonamiento a `PUT`/`DELETE` de authors y al resto de `posts`, formulando preguntas guía específicas (ej. "¿alcanza con 'no vacío', o también hay que chequear que ese `author_id` exista realmente?").

---

## 3. Corrección de un bug de arquitectura (mezcla de capas)

**Prompt:**
> Me parece que puede ser más una responsabilidad de capa, la capa de servicios. Así que reutilizar getAuthorById no debería ser un problema

**Output (resumen):**
La IA corrigió la confusión: `getAuthorById` no debía importarse en `posts.service.js` (violaría la regla de que un service solo habla SQL de su propia tabla), sino en `posts.controller.js`, que sí puede orquestar llamadas a servicios de otros recursos. Se reforzó la regla general: *"¿esto es una query SQL sobre la tabla, o es lógica de validación de un request HTTP? Si es lo primero, va en el service; si es lo segundo, va en el controller."*

---

## 4. Depuración de un bug real detectado en pruebas manuales

**Prompt:**
> [el usuario adjunta capturas de Thunder Client mostrando que un PUT devuelve 400 "email ya está en uso" para un id que ya había sido borrado]

**Output (resumen):**
La IA guio al usuario a formular una hipótesis verificable antes de asumir que era un bug ("¿cómo puede un id que no existe estar en conflicto con otro author por email?"), lo llevó a correr un `GET /authors` para confirmarla, y una vez confirmada, identificó la causa raíz: el orden de las validaciones en `putAuthor` chequeaba el conflicto de email antes de verificar si el recurso (`:id`) existía. Se corrigió reordenando las validaciones para aplicar el principio de "fail fast".

---

## 5. Explicación conceptual de JavaScript (destructuring)

**Prompt:**
> Pero te pregunte hace un rato si había algun problema con poner authorId en vez de author_id me dijiste que no, que son dos cosas distintas en JS y en sql.. decidite

**Output (resumen):**
La IA aclaró la aparente contradicción explicando dos mecánicas distintas de JavaScript: cuando un parámetro es un valor suelto (no destructurado), su nombre es libre; cuando se hace destructuring de un objeto (`const { author_id } = objeto`), el nombre debe coincidir exactamente con la clave real del objeto de origen. Se ejemplificó con el caso concreto del proyecto (`getPostsByAuthorId(authorId)` vs. `createPost({ author_id })`).

---

## 6. Middleware de manejo de errores centralizado

**Prompt:**
> Y que hay de los middleware para centralizar errores? Según la misma conversación estabamos haciendo throw error precisamente para eso también, no? En ese caso empezaría por ahí...

**Output (resumen):**
La IA explicó el mecanismo de los middlewares de error en Express (funciones con cuatro parámetros `(err, req, res, next)`, reconocidas automáticamente por Express), su necesidad (evitar exponer stack traces del manejador default de Express) y su ubicación (al final de todos los `app.use`). Posteriormente el usuario amplió la solución propia agregando una clase `AppError` y un `asyncHandler`, que la IA revisó y corrigió (faltaba `next` en varias firmas de controladores, uso incorrecto de `next(...)` sin invocar, código de estado incorrecto para "ruta no encontrada").

---

## 7. Ajuste de estilo de trabajo por parte del usuario

**Prompt:**
> Respondo preguntas y empezamos de una porque me gaste todo los tokes respondiendo preguntas y no trabajando. Necesito que seas más agil en ese sentido, está super bien que me cuestiones, eso fue lo que te pedí, pero desde que empezamos a conversar hoy ya voy el 73% de los tokens comprometidos el avance ha sido insignificante.

**Output (resumen):**
La IA ajustó su enfoque para el resto de la sesión: dejó de detenerse a formular preguntas socráticas antes de cada paso y pasó a proponer código concreto directamente, manteniendo las explicaciones y correcciones pero reduciendo las pausas reflexivas, respetando el nivel de autonomía que el usuario ya había demostrado tener.

---

## 8. Pruebas unitarias con mocking (exigencia de buenas prácticas)

**Prompt:**
> No pero si van a leer y modificar mi base de datos real necesito el mocking... Hagamos todo bien hecho, la consigna es una guia para pasar, pero la idea es ser prolijo desde el inicio...

**Output (resumen):**
La IA reescribió la propuesta inicial de tests (que pegaba contra la base de datos real) usando `vi.mock` de Vitest para mockear la capa de servicios, evitando cualquier efectivo acceso a PostgreSQL durante las pruebas, y explicó el uso de `vi.fn`, `mockResolvedValue` y `beforeEach(() => vi.clearAllMocks())`.

---

## 9. Depuración del proceso de despliegue en Railway

**Prompt:**
> [el usuario reporta un crash en Railway con el log de error ENOENT sobre el archivo .env]

**Output (resumen):**
La IA identificó que `process.loadEnvFile('.env')` se ejecutaba sin condición en `pool.config.js`, fallando en Railway porque ese entorno no provee un archivo `.env` físico. Se corrigió moviendo la carga condicional de variables de entorno únicamente al punto de entrada (`index.js`), y se guio al usuario paso a paso para mapear las variables del servicio de PostgreSQL de Railway hacia los nombres esperados por la aplicación, y finalmente para ejecutar el script de creación de tablas contra la base de datos remota usando la consola del servicio de Postgres (bash + `psql`), tras identificar que el hostname interno de Railway no es accesible desde fuera de su red privada.

---

## Nota metodológica

En la mayoría de los casos documentados, la IA no entregó la solución final de forma directa, sino que señaló el error o la inconsistencia, explicó su causa, y devolvió al usuario la tarea de corregirlo, revisando después el resultado. Este patrón se sostuvo de forma consistente a lo largo de la construcción de los tres recursos principales (`authors`, `posts`, `comments`), y se flexibilizó hacia el final del proyecto (manejo de errores, testing, despliegue) a pedido explícito del usuario, priorizando avance concreto sobre repetición del proceso pedagógico completo en cada paso.