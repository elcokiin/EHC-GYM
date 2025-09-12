/*import { v } from "convex/values";
import { query } from "../_generated/server";
import { AuthError } from "./error";

export const getUserByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const user = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first();

            return user;
        } catch (error) {
            throw new AuthError(
                'USER_LOOKUP_FAILED',
                `Failed to find user by email: ${error}`,
                error
            );
        }
    },
});

export const getUserById = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        try {
            const user = await ctx.db.get(args.userId);
            return user;
        } catch (error) {
            throw new AuthError(
                'USER_LOOKUP_FAILED',
                `Failed to find user by ID: ${error}`,
                error
            );
        }
    },
});

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        try {
            const users = await ctx.db.query("users").collect();
            return users;
        } catch (error) {
            throw new AuthError(
                'USER_LOOKUP_FAILED',
                `Failed to get all users: ${error}`,
                error
            );
        }
    },
});

export const searchUsersByName = query({
    args: {
        searchTerm: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const users = await ctx.db
                .query("users")
                .filter((q) =>
                    q.or(
                        q.eq(q.field("name"), args.searchTerm),
                        q.eq(q.field("last_name"), args.searchTerm)
                    )
                )
                .collect();

            return users;
        } catch (error) {
            throw new AuthError(
                'USER_LOOKUP_FAILED',
                `Failed to search users: ${error}`,
                error
            );
        }
    },
});*/