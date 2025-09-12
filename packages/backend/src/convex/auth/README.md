# 📌 Authentication & Authorization Module (Convex + Clerk)

Este documento define el contrato del **módulo de autenticación y autorización** en Convex.  
Incluye **endpoints disponibles**, **inputs/outputs**, **reglas de autorización** y **ejemplos de uso desde React Native**.

---

## 🔑 Principios Clave

- Clerk maneja **autenticación** (login, JWT, user identity).  
- Convex maneja **autorización por roles (RBAC)**.  
- Rol por defecto al crear usuario: **CLIENT**.  
- Solo un **ADMIN** puede cambiar roles.  
- Primer ADMIN debe ser “sembrado” manualmente con `seedAdminByEmail`.

---

## 📂 Endpoints Disponibles

### Queries

#### `whoami`
- **Acceso**: Público  
- **Descripción**: Retorna identidad básica del usuario actual (si está autenticado).
- **Output**:
```ts
{
  userId: string | null;
  role: "CLIENT" | "TRAINER" | "ADMIN" | null;
  status: "anonymous" | "authenticated";
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}
```

#### `getMyUser`
- **Acceso**: Requiere login  
- **Descripción**: Retorna perfil completo del usuario autenticado.
- **Output**:
```ts
{ user: User | null }
```

#### `getMyRole`
- **Acceso**: Requiere login  
- **Descripción**: Retorna el rol activo del usuario autenticado.
- **Output**:
```ts
{ role: "CLIENT" | "TRAINER" | "ADMIN" | null }
```

#### `listUsersWithRoles`
- **Acceso**: Solo ADMIN  
- **Descripción**: Lista todos los usuarios con su rol activo.
- **Output**:
```ts
{
  users: Array<{
    userId: Id<"users">;
    name: string;
    email: string | null;
    role: string | null;
    assignedAt: number | null;
  }>
}
```

#### `hasAdmin`
- **Acceso**: Público  
- **Descripción**: Indica si ya existe un ADMIN activo.
- **Output**:
```ts
{ exists: boolean }
```

---

### Mutations

#### `bootstrapOnFirstLogin`
- **Acceso**: Requiere login  
- **Descripción**: Crea el perfil local en `users`, vincula con `auth_identities`, asigna rol **CLIENT** si no lo tenía.
- **Output**:
```ts
{
  userId: Id<"users">;
  created: boolean; // true si se creó por primera vez
  status: "active";
  role: "CLIENT" | "TRAINER" | "ADMIN";
  user: object; // resumen DTO
}
```

#### `setRole`
- **Acceso**: Solo ADMIN  
- **Descripción**: Cambia el rol activo de un usuario.
- **Args**:
```ts
{
  targetUserId: Id<"users">;
  role: "CLIENT" | "TRAINER" | "ADMIN";
  reason?: string;
}
```
- **Output**:
```ts
{
  changed: boolean;
  userId: Id<"users">;
  role: string;
  reason: string | null;
  assignedAt: number;
  assignedByUserId: Id<"users">;
}
```

#### `seedAdminByEmail`
- **Acceso**: Público, pero solo si `hasAdmin().exists === false`  
- **Descripción**: Asigna rol **ADMIN** al usuario con el email indicado (debe existir en `users` y haber sesión autenticada).
- **Args**:
```ts
{ email: string }
```
- **Output**:
```ts
{
  seeded: true;
  userId: Id<"users">;
  role: "ADMIN";
  assignedAt: number;
}
```

---

## ⚖️ Reglas de Autorización

| Endpoint                | Rol requerido            |
|------------------------|--------------------------|
| `whoami`               | Público                  |
| `getMyUser`            | Cualquier rol (login)    |
| `getMyRole`            | Cualquier rol (login)    |
| `listUsersWithRoles`   | ADMIN                    |
| `hasAdmin`             | Público                  |
| `bootstrapOnFirstLogin`| Cualquier rol (login)    |
| `setRole`              | ADMIN                    |
| `seedAdminByEmail`     | Público (solo sin admin) |

---

## 📱 Ejemplos en React Native (Convex Client)

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// 1) Verificar si ya hay admin
const { exists } = useQuery(api.auth.queries.hasAdmin, {}) ?? { exists: false };

// 2) Sembrar admin (solo si no existe ninguno)
const seedAdmin = useMutation(api.auth.mutations.seedAdminByEmail);
await seedAdmin({ email: "first.admin@example.com" });

// 3) Asegurar perfil local tras login
const bootstrap = useMutation(api.auth.mutations.bootstrapOnFirstLogin);
await bootstrap({});

// 4) Obtener identidad/rol
const me = useQuery(api.auth.queries.whoami, {});
const myRole = useQuery(api.auth.queries.getMyRole, {});

// 5) Listar usuarios con rol (si soy ADMIN)
const list = useQuery(api.auth.queries.listUsersWithRoles, {});

// 6) Cambiar rol (ADMIN)
const setRole = useMutation(api.auth.mutations.setRole);
await setRole({ targetUserId, role: "TRAINER" });
```

---

## ✅ Buenas Prácticas

1. Llama `bootstrapOnFirstLogin` tras el login para asegurar el espejo local del usuario.  
2. Controla en frontend si mostrar UI de “sembrar admin” usando `hasAdmin()`.  
3. No expongas `setRole` en UI pública; resérvalo para panel ADMIN.  
4. Mantén DTOs coherentes con los diagramas para la sustentación.  
5. Auditoría: `assignedByUserId` y timestamps ya quedan registrados en cambios de rol.

---

## 🗂 Archivos Relevantes (backend)

- `src/convex/lib/auth.ts` — helpers de autenticación (Clerk → Convex)  
- `src/convex/policies/rbac.ts` — autorización por roles (`getActiveRole`, `enforceRole`, `enforceAnyRole`)  
- `src/convex/auth/queries.ts` — `whoami`, `getMyUser`, `getMyRole`, `listUsersWithRoles`, `hasAdmin`  
- `src/convex/auth/mutations.ts` — `bootstrapOnFirstLogin`, `setRole`, `seedAdminByEmail`  
- `src/convex/schema.ts` — tablas: `users` (legacy), `auth_identities`, `role_assignments`  
- `src/convex/auth/validators.ts` (opcional) — zod schemas cuando se requieran argumentos

---

## 🔗 Coherencia con Diagramas

- `auth_identities` ↔ **AuthenticationIdentity** (diagrama de clases).  
- `role_assignments` ↔ **RoleAssignment** (diagrama de clases).  
- Checks de autorización centralizados en `policies/rbac.ts` (flujo del diagrama de secuencia).  
- `UserSummaryDTO` optimizado para frontend (como en el diagrama de DTOs).
