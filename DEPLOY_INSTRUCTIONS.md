# Instrucciones para Deploy en Vercel

## Paso 1: Subir a GitHub

Si el push falló por autenticación, tienes dos opciones:

### Opción A: Crear el repositorio en GitHub primero
1. Ve a https://github.com/soulcalisthenicscursos
2. Haz clic en "New repository"
3. Nombre: `curso-calistenia`
4. NO marques "Initialize with README"
5. Crea el repositorio
6. Luego ejecuta estos comandos en PowerShell:

```powershell
cd "C:\Users\nacho\OneDrive\Escritorio\pagina agus"
git remote add origin https://github.com/soulcalisthenicscursos/curso-calistenia.git
git push -u origin main
```

Si te pide autenticación, usa un Personal Access Token de GitHub.

### Opción B: Usar GitHub Desktop o GitHub CLI
- Si tienes GitHub Desktop instalado, puedes hacer push desde ahí
- O instala GitHub CLI y autentícate con `gh auth login`

## Paso 2: Deploy en Vercel

1. **Ve a Vercel:**
   - Abre https://vercel.com
   - Inicia sesión con tu cuenta (puedes usar GitHub para autenticarte)

2. **Importar proyecto:**
   - Haz clic en "Add New..." → "Project"
   - Selecciona "Import Git Repository"
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Busca y selecciona `soulcalisthenicscursos/curso-calistenia`

3. **Configurar el proyecto:**
   - **Framework Preset:** Next.js (debería detectarlo automáticamente)
   - **Root Directory:** `./` (dejar por defecto)
   - **Build Command:** `npm run build` (debería estar por defecto)
   - **Output Directory:** `.next` (debería estar por defecto)
   - **Install Command:** `npm install` (debería estar por defecto)

4. **Variables de Entorno:**
   Antes de hacer deploy, agrega estas variables de entorno en Vercel:
   
   - Ve a la sección "Environment Variables" en la configuración del proyecto
   - Agrega estas dos variables:

   ```
   UPSTASH_REDIS_REST_URL = (tu URL de Upstash Redis)
   UPSTASH_REDIS_REST_TOKEN = (tu Token de Upstash Redis)
   ```

   **Cómo obtener las credenciales de Upstash Redis:**
   1. Ve a https://console.upstash.com/
   2. Inicia sesión o crea una cuenta
   3. Crea una nueva base de datos Redis (si no tienes una)
   4. En el dashboard de tu base de datos, verás:
      - **UPSTASH_REDIS_REST_URL**: Una URL que termina en `.upstash.io`
      - **UPSTASH_REDIS_REST_TOKEN**: Un token largo
   5. Copia ambos valores y pégalos en Vercel

5. **Deploy:**
   - Haz clic en "Deploy"
   - Espera a que termine el build (puede tardar unos minutos)
   - Una vez completado, tendrás una URL como `curso-calistenia.vercel.app`

## Paso 3: Verificar que funciona

1. Visita la URL que te dio Vercel
2. Prueba registrarte con una cuenta nueva
3. Verifica que puedas iniciar sesión
4. Prueba ver un video y marcarlo como completado
5. Verifica que el progreso se guarde correctamente

## Notas importantes:

- **Variables de entorno:** Asegúrate de que las variables de entorno estén configuradas ANTES del primer deploy, o el backend no funcionará
- **Upstash Redis:** Necesitas tener una cuenta activa en Upstash (tienen un plan gratuito generoso)
- **Dominio personalizado:** Si quieres usar un dominio propio, puedes configurarlo en Vercel después del deploy

## Solución de problemas:

- Si el build falla, revisa los logs en Vercel
- Si las variables de entorno no funcionan, verifica que estén escritas exactamente como se muestra arriba
- Si Redis no funciona, verifica que las credenciales sean correctas en Upstash

