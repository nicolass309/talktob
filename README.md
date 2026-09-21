# TalktoB LSCH Frontend — Integración con Backend Real (v1)

Aplicación React 19 + Vite + TypeScript con autenticación Clerk e integración completa con la API FastAPI de TalktoB LSCH.

---

## Requisitos y Variables de Entorno

Copia `.env.example` a `.env` (o configura las variables en tu entorno):

```bash
VITE_API_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZXhhbXBsZS1jbGVyay1rZXktbHNjaC10YWxrdG9iLmNsa2FwcC5kZXYk
VITE_DEV_AUTH_TOKEN=dev:mi_usuario_local
```

- `VITE_API_URL`: Dirección base de la API backend (por defecto `http://localhost:8000`).
- `VITE_CLERK_PUBLISHABLE_KEY`: Clave pública para la integración con Clerk Auth. Si es placeholder o falta, la app entra en modo dev sin Clerk.
- `VITE_DEV_AUTH_TOKEN`: Token de autenticación local para desarrollo cuando Clerk está deshabilitado.

---

## Correr en local sin Clerk

Los 3 comandos exactos para levantar el entorno completo de desarrollo local sin necesidad de una API key real de Clerk:

1. **Backend en modo dev y storage local:**
```bash
AUTH_DEV_MODE=true STORAGE_BACKEND=local uvicorn app.main:app --reload
```

2. **Poblar la base de datos con datos de prueba:**
```bash
make seed
```

3. **Frontend en modo desarrollo:**
```bash
VITE_API_URL=http://localhost:8000 VITE_DEV_AUTH_TOKEN=dev:mi_usuario_local npm run dev
```

---

## Arquitectura de Servicios

- `src/services/apiClient.ts`: Cliente HTTP tipado con manejo de errores `{ error: { code, message, details } }` y adjunta headers de `Authorization: Bearer <token>`.
- `src/services/authMode.ts`: Detecta la validez de la key de Clerk y habilita el token de desarrollo en dev mode.
- `src/components/auth/ClerkTokenBridge.tsx`: Puente React para registrar el generador de tokens de Clerk en `apiClient` cuando Clerk está activo.
- `src/services/wordsService.ts`: Listado paginado de palabras (`GET /api/v1/words`) y propuestas (`POST /api/v1/words`).
- `src/services/contributionsService.ts`: Creación de aportes (`POST /api/v1/contributions`), URLs firmadas para subida de tomas (`POST /api/v1/contributions/{id}/takes`), verificación (`complete`), envío (`submit`), subida por `XMLHttpRequest.upload.onprogress`, e historial del usuario.
- `src/services/gamificationService.ts`: Retos (`/challenges`), Ranking (`/ranking`), Progreso Comunitario (`/community/progress`) y Perfil de Usuario (`/me`, `PATCH /me`).
- **Cola Offline Real**: En caso de estar sin conexión o desconexión durante la grabación, los aportes se persisten en IndexedDB y se sincronizan al reconectar mediante `POST /api/v1/sync`.

---

## Verificación de Código

```bash
npm run build
npx tsc -b
npm run lint
```
