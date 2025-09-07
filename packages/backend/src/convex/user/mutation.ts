import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { AuthError } from "./error";

export const createUser = mutation({
    args: {
        name: v.string(),
        last_name: v.string(),
        email: v.string(),
        contact_emergency_name: v.optional(v.string()),
        contact_emergency_phone: v.optional(v.string()),
        birthday: v.string(),
        phone: v.string(),
        country_code: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first();

            if (existingUser) {
                throw new AuthError(
                    'USER_CREATION_FAILED',
                    `User with email ${args.email} already exists`
                );
            }

            // Crear el usuario
            const userId = await ctx.db.insert("users", {
                name: args.name,
                last_name: args.last_name,
                email: args.email,
                contact_emergency_name: args.contact_emergency_name || "",
                contact_emergency_phone: args.contact_emergency_phone || "",
                birthday: args.birthday,
                phone: args.phone,
                country_code: args.country_code || "+57", // Colombia por defecto
            });

            return { success: true, userId };
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            throw new AuthError(
                'USER_CREATION_FAILED',
                `Failed to create user: ${error}`,
                error
            );
        }
    },
});

export const updateUser = mutation({
    args: {
        userId: v.id("users"),
        name: v.optional(v.string()),
        last_name: v.optional(v.string()),
        email: v.optional(v.string()),
        contact_emergency_name: v.optional(v.string()),
        contact_emergency_phone: v.optional(v.string()),
        birthday: v.optional(v.string()),
        phone: v.optional(v.string()),
        country_code: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        try {
            const { userId, ...updateData } = args;

            // Filtrar campos undefined
            const filteredData = Object.fromEntries(
                Object.entries(updateData).filter(([_, value]) => value !== undefined)
            );

            if (Object.keys(filteredData).length === 0) {
                return { success: true, message: "No fields to update" };
            }

            await ctx.db.patch(userId, filteredData);
            return { success: true };
        } catch (error) {
            throw new AuthError(
                'USER_CREATION_FAILED',
                `Failed to update user: ${error}`,
                error
            );
        }
    },
});

export const deleteUser = mutation({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        try {
            await ctx.db.delete(args.userId);
            return { success: true };
        } catch (error) {
            throw new AuthError(
                'USER_CREATION_FAILED',
                `Failed to delete user: ${error}`,
                error
            );
        }
    },
});