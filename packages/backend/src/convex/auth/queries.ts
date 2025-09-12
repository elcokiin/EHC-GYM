// src/convex/auth/queries.ts
import { query } from "../_generated/server";
import { getAuthenticatedUser, getCurrentUserProfile, requireAuth } from "../lib/auth";
import { getActiveRole, enforceRole } from "../policies/rbac";

export const whoami = query({
    args: {},
    handler: async (ctx) => {
        const identity = await getAuthenticatedUser(ctx);
        if (!identity) {
            return {
                userId: null,
                role: null,
                status: "anonymous",
                email: null,
                name: null,
                avatarUrl: null,
            };
        }
        const name =
            [identity.givenName, identity.familyName].filter(Boolean).join(" ") || null;

        return {
            userId: identity.subject ?? null,
            role: await getActiveRole(ctx), // rol real (o null)
            status: "authenticated",
            email: identity.email ?? null,
            name,
            avatarUrl: identity.pictureUrl ?? null,
        };
    },
});

export const getMyUser = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const user = await getCurrentUserProfile(ctx);
        return { user }; // puede ser null si falta bootstrap
    },
});

export const getMyRole = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const role = await getActiveRole(ctx);
        return { role }; // string o null
    },
});

/**
 * Admin: lista usuarios con su rol activo (si existe).
 * NOTA: implementacion simple (N+1). Se puede optimizar mas adelante.
 */
export const listUsersWithRoles = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        await enforceRole(ctx, "ADMIN");

        const users = await ctx.db.query("users").collect();

        const result = [];
        for (const u of users) {
            const activeRole = await ctx.db
                .query("role_assignments")
                .withIndex("by_user_active", (q) => q.eq("userId", u._id).eq("active", true))
                .first();

            result.push({
                userId: u._id,
                name: `${u.name ?? ""} ${u.last_name ?? ""}`.trim(),
                email: u.email ?? null,
                role: activeRole?.role ?? null,
                assignedAt: activeRole?.assignedAt ?? null,
            });
        }
        return { users: result };
    },
});

/**
 * Publico: indica si ya existe al menos un ADMIN activo.
 * Util para decidir en frontend si mostrar la UI de "sembrar admin".
 */
export const hasAdmin = query({
    args: {},
    handler: async (ctx) => {
        const admin = await ctx.db
            .query("role_assignments")
            .filter((q) => q.and(q.eq(q.field("role"), "ADMIN"), q.eq(q.field("active"), true)))
            .first();

        return { exists: !!admin };
    },
});
