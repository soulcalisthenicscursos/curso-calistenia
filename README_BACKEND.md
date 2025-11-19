# Configuración del Backend

## Variables de Entorno

Para que el backend funcione correctamente, necesitas configurar las siguientes variables de entorno en un archivo `.env.local`:

```env
UPSTASH_REDIS_REST_URL=tu_url_de_upstash_redis
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash_redis
```

## Cómo obtener las credenciales de Upstash Redis

1. Ve a [https://console.upstash.com/](https://console.upstash.com/)
2. Crea una cuenta o inicia sesión
3. Crea una nueva base de datos Redis
4. Copia la `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` desde el dashboard
5. Agrega estas variables a tu archivo `.env.local` en la raíz del proyecto

## Funcionalidades Implementadas

### Autenticación
- **POST /api/auth/register**: Registro de nuevos usuarios
- **POST /api/auth/login**: Inicio de sesión
- **GET /api/auth/me**: Verificar sesión actual
- **POST /api/auth/logout**: Cerrar sesión

### Progreso
- **POST /api/progress/mark-complete**: Marcar una lección como completada
- **GET /api/progress/get**: Obtener el progreso del usuario

## Datos Almacenados

Cada usuario tiene:
- Email y contraseña (hasheada con bcrypt)
- Lista de lecciones completadas
- Porcentaje de progreso del curso

## Notas

- Las contraseñas se hashean con bcrypt antes de guardarse
- Las sesiones se almacenan en Redis con expiración de 7 días
- El progreso se calcula automáticamente basado en las lecciones completadas

