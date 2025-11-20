# Configuración de Variables de Entorno para Desarrollo Local

Para que los inicios de sesión funcionen en tu entorno local, necesitas crear un archivo `.env.local` con las credenciales de Upstash Redis.

## Pasos:

1. **Crea el archivo `.env.local`** en la raíz del proyecto (al mismo nivel que `package.json`)

2. **Agrega las siguientes variables:**

```env
UPSTASH_REDIS_REST_URL=https://tu-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_aqui
```

3. **Cómo obtener las credenciales:**

   - Ve a https://console.upstash.com/
   - Inicia sesión o crea una cuenta
   - Crea una nueva base de datos Redis (si no tienes una)
   - En el dashboard de tu base de datos, encontrarás:
     - **UPSTASH_REDIS_REST_URL**: Una URL que termina en `.upstash.io`
     - **UPSTASH_REDIS_REST_TOKEN**: Un token largo

4. **Copia los valores** y pégalos en tu archivo `.env.local`

5. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## Nota importante:

- El archivo `.env.local` NO debe subirse a Git (ya está en `.gitignore`)
- Estas son las mismas credenciales que usarás en Vercel para producción
- Asegúrate de que los valores no tengan espacios al inicio o al final

