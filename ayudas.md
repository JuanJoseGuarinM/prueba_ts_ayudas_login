# Ayudas

Lista de archivos modificados y qué cambié en cada uno:

- [prisma/schema.prisma](prisma/schema.prisma): Añadí los campos `nombre` y `apellido` al modelo `User` (los dejé opcionales `String?` para sincronizar sin perder datos).
- [src/types/user.ts](src/types/user.ts): Actualicé la interfaz `User` para incluir `nombre` y `apellido`.
- [src/services/registerUser.ts](src/services/registerUser.ts): Guardé `nombre` y `apellido` en `prisma.user.create` y ajusté el mensaje de error para detectar usuario existente.
- [src/app/api/auth/register/route.ts](src/app/api/auth/register/route.ts): La ruta POST ahora valida y recibe `nombre` y `apellido` además de `email` y `password`.
- [src/components/ui/RegisterForm.tsx](src/components/ui/RegisterForm.tsx): Añadí inputs y estados para `nombre` y `apellido`, y envío esos campos en el body del POST; también cambié el color del texto de los inputs a negro (`text-black`).
- [src/components/ui/LoginForm.tsx](src/components/ui/LoginForm.tsx): Cambié el color del texto de los inputs a negro (`text-black`) para que se vea al escribir.

Notas:
- Para aplicar el cambio en la base de datos usé `npx prisma db push` y `npx prisma generate`. Opté por columnas opcionales para evitar resetear la BD remota.
- Si quieres que haga los campos obligatorios (`String` en vez de `String?`) debo rellenar los valores existentes primero o ejecutar una migración destructiva (`prisma migrate reset`).

Si quieres, agrego instrucciones rápidas para probar el formulario o creo un script para rellenar `nombre`/`apellido` en los usuarios existentes.
