// src/convex/policies/rbac.ts
import { QueryCtx, MutationCtx } from "../_generated/server";
import { AuthError } from "../lib/errors";
import { getCurrentUserProfile, requireAuth } from "../lib/auth";

export type RoleType = 'CLIENT' | 'TRAINER' | 'ADMIN';

async function getActiveRoleAssignment(ctx: QueryCtx | MutationCtx) {
    await requireAuth(ctx);
    const me = await getCurrentUserProfile(ctx);
    if (!me) return null;

    const active = await ctx.db
        .query("role_assignments")
        .withIndex("by_user_active", (q) => q.eq("userId", me._id).eq("active", true))
        .first();

    return active ?? null;
}

export async function getActiveRole(ctx: QueryCtx | MutationCtx): Promise<RoleType | null> {
    const ra = await getActiveRoleAssignment(ctx);
    return (ra?.role as RoleType) ?? null;
}

export async function enforceRole(ctx: QueryCtx | MutationCtx, role: RoleType): Promise<void> {
    const current = await getActiveRole(ctx);
    if (!current) {
        throw new AuthError('FORBIDDEN', 'No active role assigned');
    }
    if (current !== role) {
        throw new AuthError('FORBIDDEN', `Role ${role} required`);
    }
}

export async function enforceAnyRole(
    ctx: QueryCtx | MutationCtx,
    roles: RoleType[]
): Promise<void> {
    const current = await getActiveRole(ctx);
    if (!current) {
        throw new AuthError('FORBIDDEN', 'No active role assigned');
    }
    if (!roles.includes(current)) {
        throw new AuthError('FORBIDDEN', `One of roles [${roles.join(", ")}] is required`);
    }
}
