// src/convex/audit/events.ts

export type AuthEventType =
    | "LOGIN"
    | "BOOTSTRAP"
    | "ROLE_CHANGED"
    | "SEED_ADMIN"
    | "SEED_BLOCKED";

export interface AuthEventPayload {
    type: AuthEventType;
    actorUserId?: string | null;
    targetUserId?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt?: number;
}
