// src/convex/auth/validators.ts
import { z } from "zod";

export const NoArgsSchema = z.object({}).strict();

export const SetRoleSchema = z.object({
    targetUserId: z.string().min(1), // v.id("users") en runtime
    role: z.enum(["CLIENT", "TRAINER", "ADMIN"]),
    reason: z.string().max(500).optional(),
}).strict();
