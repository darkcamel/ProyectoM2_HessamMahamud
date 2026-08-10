# Uso de Inteligencia Artificial en el proyecto

Este documento describe cómo se utilizó inteligencia artificial (Claude, de Anthropic) durante el desarrollo de este proyecto, con el fin de ser transparente sobre el proceso de construcción y el rol que cumplió la herramienta.

## Herramienta utilizada

- **Claude** (Anthropic), usado como asistente conversacional a través de la interfaz de chat.

## Enfoque general de trabajo

Desde el inicio se estableció una metodología de trabajo intencional con la IA, orientada al aprendizaje y no a la generación automática de código sin comprensión. El enfoque acordado fue:

1. **Pensar antes de codear**: antes de escribir cualquier línea de código, se trabajó junto con la IA en analizar la consigna, identificar ambigüedades, modelar las entidades y sus relaciones, diseñar el esquema de base de datos, definir la arquitectura de carpetas y establecer los contratos de cada endpoint (input, output, códigos de estado y casos de error).
2. **Escritura propia del código**: la gran mayoría del código fue escrito por el desarrollador, no generado directamente por la IA. La IA cumplió un rol de guía, revisor y mentor técnico.
3. **Revisión de código con retroalimentación pedagógica**: cada bloque de código propio fue enviado a la IA para revisión. La IA señalaba errores (de sintaxis, de lógica, de convención de nombres, de arquitectura), explicaba la causa raíz del problema y, en la mayoría de los casos, guiaba al desarrollador hacia la solución en lugar de entregarla directamente, para reforzar el aprendizaje.
4. **Explicaciones detalladas**: dado que el desarrollador se encontraba en una etapa temprana de aprendizaje en programación, se solicitaron explicaciones detalladas de conceptos de JavaScript (por ejemplo, diferencias entre `||` y `??`, destructuring de objetos, `async/await`, manejo de promesas, middlewares de Express) y de SQL (consultas parametrizadas, `RETURNING`, claves foráneas, `ON DELETE CASCADE`).

## Tareas en las que se usó IA

- **Análisis de la consigna y planificación previa a la escritura de código.**
- **Revisión y corrección de código propio** en las capas de servicios (queries SQL parametrizadas), controladores (validaciones, manejo de errores) y rutas (Express Router).
- **Depuración de errores** durante el desarrollo y las pruebas manuales en Thunder Client (por ejemplo: errores de sintaxis en JSON, errores de referencias de variables, problemas de orden de rutas en Express, errores de conexión a base de datos).
- **Diseño del middleware de manejo de errores centralizado** (clase `AppError`, `errorHandler`, `asyncHandler`), incluyendo la explicación del mecanismo de middlewares de cuatro parámetros en Express.
- **Redacción de pruebas unitarias** con Vitest y Supertest, incluyendo la explicación del uso de mocks (`vi.mock`) para aislar la capa de servicios de la base de datos real.
- **Generación de la documentación OpenAPI** (`swagger.yaml`), a partir de los endpoints, esquemas y validaciones ya implementados en el proyecto.
- **Asistencia en el proceso de despliegue en Railway**, incluyendo la resolución de errores relacionados con variables de entorno, red interna vs. pública de Railway, y ejecución del script de creación de tablas contra la base de datos de producción.
- **Generación de esta documentación y del archivo `README.md`** del proyecto.

## Tareas realizadas sin asistencia de IA (o con mínima asistencia)

- Toma de decisiones de diseño finales (por ejemplo: elección de la ruta anidada para comments, convención de nombres de mensajes de error, ubicación de las validaciones de existencia de recursos).
- Escritura manual de la totalidad del código de servicios, controladores y rutas.
- Pruebas manuales de los endpoints en Thunder Client.
- Configuración manual del proyecto en Railway a través de la interfaz web.

## Consideraciones

El uso de IA en este proyecto estuvo orientado a **acelerar el aprendizaje mediante retroalimentación inmediata y detallada**, no a sustituir el proceso de escritura y comprensión del código por parte del desarrollador. Todo el código presente en el repositorio fue escrito, revisado y comprendido por el autor del proyecto, con el apoyo de la IA como herramienta de mentoría técnica.