// src/convex/audit/index.ts
import { MutationCtx } from "../_generated/server";
import { AuthEventPayload } from "./events";

/**
 * Inserta un evento de auditoria en auth_events.
 * Requiere MutationCtx (escritura).
 */
export async function logAuthEvent(ctx: MutationCtx, payload: AuthEventPayload) {
    const now = payload.createdAt ?? Date.now();
    await ctx.db.insert("auth_events", {
        type: payload.type,
        actorUserId: payload.actorUserId ? (payload.actorUserId as any) : undefined,
        targetUserId: payload.targetUserId ? (payload.targetUserId as any) : undefined,
        metadata: payload.metadata ?? undefined,
        createdAt: now,
    });
}
