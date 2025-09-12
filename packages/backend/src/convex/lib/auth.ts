// src/convex/lib/auth.ts
import { QueryCtx, MutationCtx } from "../_generated/server";
import { AuthError } from "./errors";

/** Obtiene la identidad autenticada de Clerk (o null) */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    return identity ?? null;
}

/** Requiere usuario autenticado; lanza 401 si no lo hay */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new AuthError('UNAUTHORIZED', 'User must be authenticated to access this resource');
    }
    return identity;
}

/** Obtiene el subject (clerkId) o null */
export async function getCurrentUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await getAuthenticatedUser(ctx);
    return identity?.subject ?? null;
}

/** Requiere subject (clerkId) y lo retorna */
export async function requireCurrentUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await requireAuth(ctx);
    return identity.subject;
}

/** ¿El recurso pertenece al user autenticado? (comparando clerkId con resourceUserId) */
export async function hasPermission(ctx: QueryCtx | MutationCtx, resourceUserId: string) {
    const currentUserId = await getCurrentUserId(ctx);
    return currentUserId === resourceUserId;
}

/** Exige permiso de propietario */
export async function requirePermission(ctx: QueryCtx | MutationCtx, resourceUserId: string) {
    const currentUserId = await requireCurrentUserId(ctx);
    if (currentUserId !== resourceUserId) {
        throw new AuthError('FORBIDDEN', 'User does not have permission to access this resource');
    }
}

/** Busca perfil local por clerkId o por email normalizado */
export async function getCurrentUserProfile(ctx: QueryCtx | MutationCtx) {
    const identity = await getAuthenticatedUser(ctx);
    if (!identity) return null;

    try {
        if (identity.subject) {
            const byClerk = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
                .first();
            if (byClerk) return byClerk;
        }

        const email = identity.email?.toLowerCase();
        if (email) {
            const byEmail = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", email))
                .first();
            return byEmail ?? null;
        }
        return null;
    } catch (error) {
        throw new AuthError('USER_PROFILE_LOOKUP_FAILED', `Failed to get user profile: ${error}`, error);
    }
}

/** Exige perfil local existente */
export async function requireCurrentUserProfile(ctx: QueryCtx | MutationCtx) {
    const user = await getCurrentUserProfile(ctx);
    if (!user) {
        throw new AuthError('USER_PROFILE_NOT_FOUND', 'User profile not found in database');
    }
    return user;
}
