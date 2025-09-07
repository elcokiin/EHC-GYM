import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        text: v.string(),
        completed: v.boolean(),
    }),

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
    }).index("by_email", ["email"])
        .index("by_clerk_id", ["clerkId"]),
});
