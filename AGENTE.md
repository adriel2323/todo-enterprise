# AGENTE.md

## Objetivo
Este repositorio contiene una API backend en NestJS para gestión de tareas con autenticación JWT y persistencia en PostgreSQL usando TypeORM. Las futuras implementaciones deben mantener la estructura modular actual, respetar la separación entre `auth` y `tasks`, y priorizar cambios pequeños, verificables y coherentes con el código existente.

## Stack real del proyecto
- Backend: NestJS 11 + TypeScript
- ORM: TypeORM 0.3
- Base de datos: PostgreSQL
- Auth: `@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`, `bcrypt`
- Validación: `class-validator` + `class-transformer`
- Documentación: Swagger en `/api/docs` cuando `NODE_ENV !== 'production'`
- Tests: Jest unitario y e2e
- Contenedores: `Dockerfile` simple + `docker-compose.yml` con app y postgres

## Estructura actual
- `backend/src/app.module.ts`: composición principal, configuración global y conexión TypeORM
- `backend/src/main.ts`: bootstrap, `ValidationPipe` global y Swagger
- `backend/src/auth`: registro, login, estrategia JWT, entidad `User`
- `backend/src/tasks`: CRUD de tareas, DTOs, entidad `Task`, servicio y controlador
- `backend/test`: pruebas e2e base de Nest, hoy desalineadas con la app real

## Convenciones que sí deben mantenerse
- Implementar nuevas capacidades por módulo Nest (`module`, `controller`, `service`, `dto`, `entity` si aplica)
- Validar entradas con DTOs decorados con `class-validator`
- Documentar endpoints y modelos expuestos con decoradores de Swagger
- Mantener lógica de negocio en servicios, no en controladores
- Usar TypeORM repository injection con `@InjectRepository`
- Mantener las rutas protegidas con `AuthGuard('jwt')` cuando la información sea por usuario
- Cuando una entidad tenga relaciones sensibles, ocultarlas en respuestas serializadas si corresponde, como ya ocurre con `Task.user`

## Convenciones que deben corregirse o no propagarse
- No copiar el doble decorador `@Module` presente en `backend/src/tasks/tasks.module.ts`; cada módulo debe declarar un solo `@Module`
- No asumir que el `README` documenta el proyecto; es un template genérico
- No endurecer dependencias sobre strings mágicos existentes si pueden encapsularse
- No replicar inconsistencias de naming actuales como `singUp`, `JWtStrategy` o `updateTaskStatus.dto.ts`; en cambios nuevos usar nombres consistentes
- No ampliar tests siguiendo assertions incorrectas del spec actual si contradicen el código real

## Reglas de implementación
### Nuevos endpoints
- Definir DTO de entrada/salida si hay payload o query params
- Añadir validación y documentación Swagger
- Si el recurso depende del usuario autenticado, pasar `@GetUser()` al servicio y filtrar por `user.id`
- Lanzar excepciones HTTP explícitas (`NotFoundException`, `UnauthorizedException`, `ConflictException`, etc.)

### Cambios en entidades
- Preferir columnas y relaciones explícitas
- Si se modifica una relación con `User`, revisar serialización para no filtrar datos sensibles
- Confirmar impacto en soft delete de `Task` (`deletedAt`)

### Cambios en consultas
- Mantener el patrón de filtrado por usuario en tareas
- Si se agregan filtros o paginación, implementarlos en DTO + query builder o repository de forma consistente
- Si una consulta incluye soft-deleted, dejarlo explícito

### Seguridad
- No exponer `password`
- No agregar endpoints de tareas sin guard JWT salvo que el requerimiento lo exija expresamente
- Si se toca JWT, evitar secretos hardcodeados nuevos; preferir variables de entorno

## Entorno y ejecución
El código espera variables de entorno en `../.env` respecto de `backend/src`, y `docker-compose.yml` también consume `.env` en la raíz del repo.

Comandos principales en `backend`:
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

## Estado actual a tener en cuenta antes de implementar
- El árbol git puede tener cambios locales no relacionados; no revertirlos sin instrucción explícita
- `synchronize: true` está activo en TypeORM, útil para desarrollo pero no una base para producción
- El e2e actual referencia `GET /` y `Hello World!`, pero la app no muestra ese controlador; tratar esos tests como desactualizados
- La autenticación usa secreto JWT hardcodeado; si una tarea toca auth o despliegue, considerar moverlo a configuración
- `GetTaskFilterDto` usa `class-transformer` para paginación; respetar ese patrón al agregar query params numéricos

## Checklist mínima para cada cambio
- El cambio sigue la estructura Nest existente
- DTOs y validaciones están actualizados
- Swagger refleja el endpoint o modelo modificado
- Se revisó impacto de auth y ownership por usuario
- Se añadieron o ajustaron tests si el comportamiento cambió
- Se ejecutó al menos `npm run lint` y el test más cercano al área modificada, si el entorno lo permite

## Prioridad de trabajo para futuros agentes
1. Leer primero `backend/src/app.module.ts`, `backend/src/main.ts` y el módulo afectado
2. Detectar si el cambio toca `auth`, `tasks`, base de datos o configuración
3. Implementar con el menor cambio posible y sin reestructuras innecesarias
4. Verificar con lint/tests antes de cerrar
5. Documentar brevemente cualquier deuda detectada que no se haya corregido

## Deudas técnicas visibles
- Renombrar `singUp` a `signUp`
- Renombrar `JWtStrategy` a `JwtStrategy`
- Corregir `backend/src/tasks/tasks.module.ts`
- Revisar tests unitarios de tareas, porque algunas expectativas no coinciden con la implementación
- Reemplazar secretos hardcodeados por configuración
- Revisar si `TaskStatus.DELETED` sigue siendo necesario cuando ya existe soft delete
