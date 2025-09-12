import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    tasks: defineTable({
        text: v.string(),
        completed: v.boolean(),
    }),

    // Legacy users (existente)
    users: defineTable({
        name: v.string(),
        last_name: v.string(),
        email: v.string(),
        contact_emergency_name: v.string(),
        contact_emergency_phone: v.string(),
        birthday: v.string(),
        phone: v.string(),
        country_code: v.string(),
        clerkId: v.optional(v.string()),
    })
        .index("by_email", ["email"])
        .index("by_clerk_id", ["clerkId"]),

    // Espejo de identidades (Clerk)
    auth_identities: defineTable({
        userId: v.id("users"),
        provider: v.literal("clerk"),
        providerUserId: v.string(),          // clerkId
        emailFromProvider: v.optional(v.string()),
        lastLoginAt: v.optional(v.number()), // epoch ms
    }).index("by_providerUserId", ["providerUserId"]),

    // Asignaciones de rol (RBAC)
    role_assignments: defineTable({
        userId: v.id("users"),
        role: v.union(v.literal("CLIENT"), v.literal("TRAINER"), v.literal("ADMIN")),
        assignedAt: v.number(),                        // epoch ms
        assignedByUserId: v.optional(v.id("users")),   // quién otorgo el rol
        active: v.boolean(),
    })
        .index("by_user_active", ["userId", "active"])
        .index("by_user_time", ["userId", "assignedAt"]),

    // Auditoría de auth/RBAC
    auth_events: defineTable({
        type: v.union(
            v.literal("LOGIN"),
            v.literal("BOOTSTRAP"),
            v.literal("ROLE_CHANGED"),
            v.literal("SEED_ADMIN"),
            v.literal("SEED_BLOCKED")
        ),
        actorUserId: v.optional(v.id("users")), // puede no haber actor (seed inicial)
        targetUserId: v.optional(v.id("users")),
        metadata: v.optional(v.any()),          // JSON con detalles (email, oldRole, newRole, reason, etc.)
        createdAt: v.number(),                  // epoch ms
    })
        .index("by_user_time", ["targetUserId", "createdAt"])
        .index("by_type_time", ["type", "createdAt"]),
});
