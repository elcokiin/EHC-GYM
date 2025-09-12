// src/convex/lib/guard.ts
import { QueryCtx, MutationCtx } from "../_generated/server";
import { requireAuth } from "./auth";
import { enforceAnyRole, enforceRole, RoleType } from "../policies/rbac";

/**
 * Aplica requireAuth y enforcement de roles de manera estandarizada.
 */
export async function guardAuth(ctx: QueryCtx | MutationCtx) {
    await requireAuth(ctx);
}

export async function guardRole(ctx: QueryCtx | MutationCtx, role: RoleType) {
    await requireAuth(ctx);
    await enforceRole(ctx, role);
}

export async function guardAnyRole(ctx: QueryCtx | MutationCtx, roles: RoleType[]) {
    await requireAuth(ctx);
    await enforceAnyRole(ctx, roles);
}
