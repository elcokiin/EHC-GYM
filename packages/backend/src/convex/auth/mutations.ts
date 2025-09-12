// src/convex/auth/mutations.ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { AuthError } from "../lib/errors";
import { requireAuth, requireCurrentUserProfile } from "../lib/auth";
import { enforceRole } from "../policies/rbac";
import { mapUserToSummary } from "../lib/mappers";
import { logAuthEvent } from "../audit";
import { allowSeedAdmin } from "../lib/env";

/**
 * Crea/vincula el usuario local en la primera sesión autenticada por Clerk.
 * - Asegura doc en "users" (legacy) por clerkId o email.
 * - Crea/actualiza espejo en "auth_identities".
 * - Si no tiene rol activo, asigna por defecto: CLIENT.
 * - Registra evento de auditoría BOOTSTRAP.
 */
export const bootstrapOnFirstLogin = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await requireAuth(ctx);
        const clerkId = identity.subject;
        const email = identity.email?.toLowerCase() ?? "";

        try {
            // === 1) Resolver/crear User local en "users" (legacy) ===
            let user =
                (clerkId &&
                    (await ctx.db
                        .query("users")
                        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
                        .first())) ||
                (email &&
                    (await ctx.db
                        .query("users")
                        .withIndex("by_email", (q) => q.eq("email", email))
                        .first())) ||
                null;

            if (!user) {
                const firstName = identity.givenName ?? "";
                const lastName = identity.familyName ?? "";
                const userId = await ctx.db.insert("users", {
                    name: firstName,
                    last_name: lastName,
                    email,
                    contact_emergency_name: "",
                    contact_emergency_phone: "",
                    birthday: "",
                    phone: "",
                    country_code: "+57",
                    clerkId: clerkId ?? undefined,
                });
                user = await ctx.db.get(userId);
            } else {
                // asegurar clerkId/email normalizado
                const patch: Record<string, unknown> = {};
                if (clerkId && user.clerkId !== clerkId) patch.clerkId = clerkId;
                if (email && user.email !== email) patch.email = email;
                if (Object.keys(patch).length) await ctx.db.patch(user._id, patch);
            }

            // === 2) Espejo de identidad en "auth_identities" ===
            if (!clerkId) {
                throw new AuthError("USER_CREATION_FAILED", "Missing Clerk subject");
            }

            const existingIdentity = await ctx.db
                .query("auth_identities")
                .withIndex("by_providerUserId", (q) => q.eq("providerUserId", clerkId))
                .first();

            const now = Date.now();
            if (!existingIdentity) {
                await ctx.db.insert("auth_identities", {
                    userId: user!._id,
                    provider: "clerk",
                    providerUserId: clerkId,
                    emailFromProvider: identity.email ?? undefined,
                    lastLoginAt: now,
                });
            } else {
                const patch: Record<string, unknown> = {};
                if (existingIdentity.userId !== user!._id) patch.userId = user!._id;
                patch.emailFromProvider = identity.email ?? undefined;
                patch.lastLoginAt = now;
                await ctx.db.patch(existingIdentity._id, patch);
            }

            // === 3) Asignar rol por defecto (CLIENT) si no existe uno activo ===
            const activeRole = await ctx.db
                .query("role_assignments")
                .withIndex("by_user_active", (q) => q.eq("userId", user!._id).eq("active", true))
                .first();

            if (!activeRole) {
                await ctx.db.insert("role_assignments", {
                    userId: user!._id,
                    role: "CLIENT",
                    assignedAt: now,
                    assignedByUserId: undefined,
                    active: true,
                });
            }

            // Auditoria
            await logAuthEvent(ctx, {
                type: "BOOTSTRAP",
                actorUserId: user!._id,
                targetUserId: user!._id,
                metadata: { email },
                createdAt: now,
            });

            // Mapeo DTO
            const dto = mapUserToSummary(user!, { role: "CLIENT", lastLoginAt: now });

            return {
                userId: user!._id,
                created: !activeRole, // si no tenia rol activo, es la primera vez
                status: "active",
                role: "CLIENT",
                user: dto,
            };
        } catch (error) {
            throw new AuthError("USER_CREATION_FAILED", `Failed to bootstrap user: ${error}`, error);
        }
    },
});

/**
 * Cambia el rol activo de un usuario objetivo (solo ADMIN).
 * - Desactiva el rol activo previo si existe.
 * - Inserta una nueva asignacion activa con el rol solicitado.
 * - Registra evento ROLE_CHANGED.
 */
export const setRole = mutation({
    args: {
        targetUserId: v.id("users"),
        role: v.union(v.literal("CLIENT"), v.literal("TRAINER"), v.literal("ADMIN")),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // 1) Debe estar autenticado y ser ADMIN
        await requireAuth(ctx);
        await enforceRole(ctx, "ADMIN");

        // 2) Actor (quien realiza el cambio) — para trazabilidad
        const actor = await requireCurrentUserProfile(ctx);

        // 3) Usuario objetivo debe existir
        const targetUser = await ctx.db.get(args.targetUserId);
        if (!targetUser) {
            throw new AuthError("USER_LOOKUP_FAILED", "Target user not found");
        }

        // 4) Ya tiene ese rol activo?
        const currentActive = await ctx.db
            .query("role_assignments")
            .withIndex("by_user_active", (q) => q.eq("userId", args.targetUserId).eq("active", true))
            .first();

        if (currentActive?.role === args.role) {
            return {
                changed: false,
                userId: args.targetUserId,
                role: currentActive.role,
                message: "Role already active",
            };
        }

        // 5) Desactivar rol activo (si lo hay)
        if (currentActive) {
            await ctx.db.patch(currentActive._id, { active: false });
        }

        // 6) Insertar nueva asignacion activa
        const now = Date.now();
        await ctx.db.insert("role_assignments", {
            userId: args.targetUserId,
            role: args.role,
            assignedAt: now,
            assignedByUserId: actor._id,
            active: true,
        });

        // Auditoria
        await logAuthEvent(ctx, {
            type: "ROLE_CHANGED",
            actorUserId: actor._id,
            targetUserId: args.targetUserId as unknown as string,
            metadata: {
                newRole: args.role,
                oldRole: currentActive?.role ?? null,
                reason: args.reason ?? null,
            },
            createdAt: now,
        });

        return {
            changed: true,
            userId: args.targetUserId,
            role: args.role,
            reason: args.reason ?? null,
            assignedAt: now,
            assignedByUserId: actor._id,
        };
    },
});

/**
 * Semilla temporal para crear el PRIMER ADMIN del sistema.
 * Reglas:
 * - Requiere estar autenticado.
 * - Solo se permite si NO existe ningun ADMIN activo en role_assignments.
 * - Respeta ALLOW_SEED_ADMIN (env).
 * - Promueve al usuario con el email dado a ADMIN (desactiva su rol activo si existe).
 * - Registra evento SEED_ADMIN o SEED_BLOCKED.
 */
export const seedAdminByEmail = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);

        const normalizedEmail = args.email.trim().toLowerCase();
        if (!normalizedEmail) {
            throw new AuthError("USER_LOOKUP_FAILED", "Email is required");
        }

        const now = Date.now();

        // 0) Bloqueo por env (hardening)
        if (!allowSeedAdmin()) {
            await logAuthEvent(ctx, {
                type: "SEED_BLOCKED",
                metadata: { email: normalizedEmail, reason: "ALLOW_SEED_ADMIN=false" },
                createdAt: now,
            });
            throw new AuthError(
                "FORBIDDEN",
                "Seed admin is disabled by environment configuration"
            );
        }

        // 1) Comprobar si ya existe al menos un ADMIN activo
        const existingAdmin = await ctx.db
            .query("role_assignments")
            .filter((q) => q.and(q.eq(q.field("role"), "ADMIN"), q.eq(q.field("active"), true)))
            .first();

        if (existingAdmin) {
            await logAuthEvent(ctx, {
                type: "SEED_BLOCKED",
                metadata: { email: normalizedEmail, reason: "Admin already exists" },
                createdAt: now,
            });
            throw new AuthError(
                "FORBIDDEN",
                "An active ADMIN already exists. Use setRole (ADMIN only) to manage roles."
            );
        }

        // 2) Buscar al usuario por email
        const targetUser =
            (await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
                .first()) ?? null;

        if (!targetUser) {
            await logAuthEvent(ctx, {
                type: "SEED_BLOCKED",
                metadata: { email: normalizedEmail, reason: "User not found" },
                createdAt: now,
            });
            throw new AuthError("USER_LOOKUP_FAILED", `User with email ${normalizedEmail} not found`);
        }

        // 3) Desactivar rol activo (si lo hay)
        const currentActive = await ctx.db
            .query("role_assignments")
            .withIndex("by_user_active", (q) => q.eq("userId", targetUser._id).eq("active", true))
            .first();

        if (currentActive) {
            await ctx.db.patch(currentActive._id, { active: false });
        }

        // 4) Insertar ADMIN activo
        await ctx.db.insert("role_assignments", {
            userId: targetUser._id,
            role: "ADMIN",
            assignedAt: now,
            assignedByUserId: undefined, // primer admin: no hay actor admin previo
            active: true,
        });

        // Auditoria
        await logAuthEvent(ctx, {
            type: "SEED_ADMIN",
            targetUserId: targetUser._id,
            metadata: { email: normalizedEmail },
            createdAt: now,
        });

        return {
            seeded: true,
            userId: targetUser._id,
            email: normalizedEmail,
            role: "ADMIN" as const,
            assignedAt: now,
        };
    },
});
