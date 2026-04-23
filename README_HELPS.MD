# Guia detallada de cambios implementados (Auth + Seguridad)

Este documento explica de forma explicita:

1. Que se modifico.
2. En que archivo y linea esta cada cambio.
3. Para que sirve cada cambio.
4. Como se conectan entre si en el flujo de registro/login/renovacion/logout.

---

## 1) Cambios en base de datos (Prisma)

### Archivo modificado
- `prisma/schema.prisma`

### Cambio exacto
- Se agrego el campo `refreshTokenHash` en el modelo `User`.

### Ubicacion
- `prisma/schema.prisma:13`

### Que hace / para que sirve
- Antes solo se guardaba `password` hasheado.
- Ahora tambien se guarda una version hasheada del refresh token (`refreshTokenHash`).
- Esto evita guardar refresh tokens en texto plano en la BD.
- Mejora seguridad ante filtracion de base de datos.

### Resultado de seguridad
- Password protegido con bcrypt.
- Refresh token protegido con bcrypt.

---

## 2) Validaciones centralizadas (registro y login)

### Archivo nuevo
- `src/lib/validation.ts`

### Cambios y ubicaciones
- Regex de correo: `src/lib/validation.ts:1`
- Regex de password fuerte: `src/lib/validation.ts:2`
- `normalizeEmail(...)`: `src/lib/validation.ts:18`
- `validateEmail(...)`: `src/lib/validation.ts:22`
- `validatePasswordStrength(...)`: `src/lib/validation.ts:28`
- `validateRegisterInput(...)`: `src/lib/validation.ts:36`
- `validateLoginInput(...)`: `src/lib/validation.ts:63`

### Que hace / para que sirve
- Evita repetir validaciones en varios archivos.
- Estandariza reglas:
  - Email valido.
  - Password fuerte (8+, mayuscula, minuscula, numero, simbolo).
  - Campos requeridos.
  - Confirmacion de password.
- Normaliza email a minuscula para evitar duplicados por mayus/minus (`User@x.com` vs `user@x.com`).

---

## 3) JWT tipado y correccion de validacion refresh

### Archivo modificado
- `src/lib/jwt.ts`

### Cambios y ubicaciones
- Nuevo payload tipado `AuthTokenPayload`: `src/lib/jwt.ts:6`
- `generateAccessToken(...)`: `src/lib/jwt.ts:11`
- `generateRefreshToken(...)`: `src/lib/jwt.ts:17`
- `validateAccesToken(...)`: `src/lib/jwt.ts:23`
- `validateRefreshToken(...)`: `src/lib/jwt.ts:27`

### Que hace / para que sirve
- El token ahora incluye `userId` + `email`.
- Se retorno tipo consistente al verificar tokens.
- Se unifico nombre correcto para validar refresh token.

---

## 4) Cookies seguras para sesion

### Archivo nuevo
- `src/lib/auth-cookies.ts`

### Cambios y ubicaciones
- Nombres de cookies:
  - `ACCESS_COOKIE_NAME`: `src/lib/auth-cookies.ts:3`
  - `REFRESH_COOKIE_NAME`: `src/lib/auth-cookies.ts:4`
- Opciones base seguras: `src/lib/auth-cookies.ts:6`
- Expiracion access token cookie: `src/lib/auth-cookies.ts:13`
- Expiracion refresh token cookie: `src/lib/auth-cookies.ts:18`

### Que hace / para que sirve
- Configura cookies con:
  - `httpOnly`: evita acceso desde JS del navegador.
  - `sameSite: "strict"`: reduce riesgo CSRF.
  - `secure` en produccion: solo HTTPS.
- Access token dura 15 min.
- Refresh token dura 7 dias.

---

## 5) Utilidades centrales de autenticacion

### Archivo nuevo
- `src/lib/auth.ts`

### Cambios y ubicaciones
- `createAuthTokens(...)`: `src/lib/auth.ts:18`
- `setAuthCookies(...)`: `src/lib/auth.ts:25`
- `clearAuthCookies(...)`: `src/lib/auth.ts:35`
- `getAuthenticatedUserFromCookies(...)`: `src/lib/auth.ts:42`

### Que hace / para que sirve
- Centraliza logica de auth para no duplicar codigo.
- Permite:
  - Crear tokens.
  - Escribir y borrar cookies.
  - Resolver usuario autenticado desde cookies.
- Si no hay sesion valida, redirige a `/login`.

---

## 6) Registro de usuario reforzado

### Archivo modificado
- `src/services/registerUser.ts`

### Cambios y ubicaciones
- Importa y aplica validacion central: `src/services/registerUser.ts:4`
- Validacion de entrada: `src/services/registerUser.ts:7`
- Busca email normalizado: `src/services/registerUser.ts:15`
- Error de email duplicado: `src/services/registerUser.ts:19`
- Hashea password: `src/services/registerUser.ts:23`
- Crea usuario con email normalizado: `src/services/registerUser.ts:25`

### Que hace / para que sirve
- Garantiza reglas de registro antes de tocar BD.
- Bloquea correos existentes.
- Siempre guarda password hasheado.

---

## 7) Login reforzado + persistencia segura del refresh token

### Archivo modificado
- `src/services/loginUser.ts`

### Cambios y ubicaciones
- Validacion de login: `src/services/loginUser.ts:8`
- Busca usuario por email normalizado: `src/services/loginUser.ts:13`
- Compara password con bcrypt: `src/services/loginUser.ts:21`
- Crea payload con `userId` y `email`: `src/services/loginUser.ts:27`
- Genera access + refresh: `src/services/loginUser.ts:32`
- Hashea refresh token: `src/services/loginUser.ts:33`
- Guarda `refreshTokenHash` en BD: `src/services/loginUser.ts:35`
- Retorna `user` + `accessToken` + `refreshToken`: `src/services/loginUser.ts:40`

### Que hace / para que sirve
- Verifica credenciales correctamente.
- No guarda refresh token plano.
- Prepara data para respuesta y cookie segura.

---

## 8) Endpoint de registro (API)

### Archivo modificado
- `src/app/api/auth/register/route.ts`

### Cambios y ubicaciones
- Usa `validateRegisterInput`: `src/app/api/auth/register/route.ts:3`
- Lee body y valida: `src/app/api/auth/register/route.ts:8`
- Llama servicio de registro: `src/app/api/auth/register/route.ts:11`
- Manejo de status:
  - `201` creado.
  - `409` correo ya registrado.
  - `400` validacion/entrada invalida.
  - Ubicacion: `src/app/api/auth/register/route.ts:20`

### Que hace / para que sirve
- Respuestas HTTP mas correctas.
- Error handling consistente.

---

## 9) Endpoint de login (API)

### Archivo modificado
- `src/app/api/auth/login/route.ts`

### Cambios y ubicaciones
- Usa `validateLoginInput`: `src/app/api/auth/login/route.ts:3`
- Valida body: `src/app/api/auth/login/route.ts:10`
- Llama servicio de login: `src/app/api/auth/login/route.ts:11`
- Escribe cookies seguras: `src/app/api/auth/login/route.ts:12`
- Respuesta con `user` y `accessToken`: `src/app/api/auth/login/route.ts:14`

### Que hace / para que sirve
- El login ya no depende de `localStorage` como sesion real.
- La sesion queda en cookies seguras del servidor.

---

## 10) Endpoint nuevo: refresh token

### Archivo nuevo
- `src/app/api/auth/refresh/route.ts`

### Cambios y ubicaciones
- Lee cookie refresh: `src/app/api/auth/refresh/route.ts:12`
- Verifica JWT refresh: `src/app/api/auth/refresh/route.ts:19`
- Busca usuario por `userId`: `src/app/api/auth/refresh/route.ts:20`
- Compara cookie refresh vs hash en BD: `src/app/api/auth/refresh/route.ts:28`
- Rota tokens (genera nuevos): `src/app/api/auth/refresh/route.ts:34`
- Actualiza nuevo `refreshTokenHash`: `src/app/api/auth/refresh/route.ts:39`
- Reescribe cookies seguras: `src/app/api/auth/refresh/route.ts:46`

### Que hace / para que sirve
- Renovacion de sesion segura.
- Rotacion de refresh token (mitiga replay).

---

## 11) Endpoint nuevo: logout

### Archivo nuevo
- `src/app/api/auth/logout/route.ts`

### Cambios y ubicaciones
- Lee refresh cookie: `src/app/api/auth/logout/route.ts:11`
- Si es valida, limpia `refreshTokenHash` en BD: `src/app/api/auth/logout/route.ts:17`
- Borra cookies de auth: `src/app/api/auth/logout/route.ts:26`

### Que hace / para que sirve
- Cierra sesion en cliente y servidor.
- Invalida refresh token persistido.

---

## 12) Proteccion de rutas y redireccion con Proxy (Next 16)

### Archivo nuevo
- `src/proxy.ts`

### Cambios y ubicaciones
- Rutas de auth publicas: `src/proxy.ts:6`
- Rutas protegidas: `src/proxy.ts:7`
- Detecta sesion por cookies: `src/proxy.ts:11`
- Si autenticado y entra a `/login` o `/register` -> manda a `/dashboard`: `src/proxy.ts:18`
- Si no autenticado y entra a `/dashboard` -> manda a `/login`: `src/proxy.ts:22`
- Matcher configurado: `src/proxy.ts:29`

### Que hace / para que sirve
- Control de acceso centralizado.
- Evita entrar a vistas que no corresponden al estado de sesion.

---

## 13) Nueva vista protegida: dashboard

### Archivo nuevo
- `src/app/dashboard/page.tsx`

### Cambios y ubicaciones
- Lee usuario autenticado desde cookies: `src/app/dashboard/page.tsx:5`
- Muestra panel protegido: `src/app/dashboard/page.tsx:8`
- Integra boton de logout: `src/app/dashboard/page.tsx:21`

### Que hace / para que sirve
- Prueba funcional de acceso protegido.
- Punto de entrada post-login.

---

## 14) Boton de cierre de sesion

### Archivo nuevo
- `src/components/ui/LogoutButton.tsx`

### Cambios y ubicaciones
- Llama endpoint logout: `src/components/ui/LogoutButton.tsx:10`
- Manejo de respuesta y alertas: `src/components/ui/LogoutButton.tsx:16`
- Redirige a login y refresca: `src/components/ui/LogoutButton.tsx:33`

### Que hace / para que sirve
- Permite cerrar sesion desde UI de forma correcta.

---

## 15) Ajustes en formularios (cliente)

### Registro
- Archivo: `src/components/ui/RegisterForm.tsx`
- Cambios:
  - Nuevo estado `confirmPassword`: `src/components/ui/RegisterForm.tsx:10`
  - Envia `confirmPassword` al endpoint: `src/components/ui/RegisterForm.tsx:22`
  - Mensaje de regla de password: `src/components/ui/RegisterForm.tsx:99`
  - Input confirmar password: `src/components/ui/RegisterForm.tsx:104`
  - Quita dependencia de `localStorage` para sesion.

### Login
- Archivo: `src/components/ui/LoginForm.tsx`
- Cambios:
  - Corrige nombre de componente a `LoginForm`: `src/components/ui/LoginForm.tsx:7`
  - Login exitoso redirige a `/dashboard`: `src/components/ui/LoginForm.tsx:35`
  - Quita `localStorage` para sesion.

### Para que sirven
- Alinea frontend con backend seguro basado en cookies + tokens.

---

## 16) Ajuste de tipos

### Archivo modificado
- `src/types/user.ts`

### Cambios y ubicacion
- `nombre`, `apellido`, `confirmPassword` como opcionales: `src/types/user.ts:4`

### Para que sirve
- Permite reutilizar el tipo para registro y login sin errores de tipado.

---

## 17) Archivos tecnicos actualizados por herramientas

### `package-lock.json`
- Se actualizo al regenerar/sincronizar dependencias y cliente Prisma.

### Comandos ejecutados para validar
- `npm run lint`
- `npm run build`
- `npx prisma generate`
- `npx prisma db push`

Estado: compilacion y lint correctos en la ultima verificacion.

---

## 18) Flujo completo final (resumen de arquitectura)

### Registro
1. Cliente envia nombre/apellido/email/password/confirmPassword.
2. API valida estructura y reglas.
3. Servicio revisa duplicado por email normalizado.
4. Password se hashea y se guarda usuario.

### Login
1. Cliente envia email/password.
2. API valida entrada.
3. Servicio busca usuario y compara hash.
4. Se generan `accessToken` (15m) + `refreshToken` (7d).
5. `refreshToken` se hashea y se guarda en BD.
6. Tokens se guardan en cookies seguras.

### Refresh
1. API toma refresh cookie.
2. Verifica JWT + compara hash con BD.
3. Si coincide, rota tokens.
4. Actualiza hash del nuevo refresh en BD y reescribe cookies.

### Logout
1. API valida refresh cookie (si existe).
2. Limpia hash en BD.
3. Borra cookies de sesion.

### Proxy (proteccion)
- Si hay sesion y vas a login/register -> redirige a dashboard.
- Si no hay sesion y vas a dashboard -> redirige a login.

---

## 19) Nota importante de nombre de archivo

Tu solicitud fue escribir esto en `README_HELPS.MD`.

- Archivo creado: `README_HELPS.MD`
- Tambien existe `README_HELP.MD` (singular) y estaba vacio.

Si quieres, en el siguiente paso puedo:
- mover este contenido a `README_HELP.MD`, o
- dejar uno apuntando al otro para no duplicar.
