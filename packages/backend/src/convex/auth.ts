import { QueryCtx, MutationCtx } from "./_generated/server";
import { AuthError } from "./user/error";

/**
 * Checks if the user is authenticated
 * @param ctx - Convex context (query or mutation)
 * @returns Authenticated user or null if not authenticated
 */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
}

/**
 * Checks if the user is authenticated and throws an error if not
 * @param ctx - Convex context (query or mutation)
 * @returns Authenticated user
 * @throws AuthError if user is not authenticated
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new AuthError(
            'UNAUTHORIZED',
            'User must be authenticated to access this resource',
            null
        );
    }

    return identity;
}

/**
 * Gets the authenticated user ID from Clerk
 * @param ctx - Convex context (query or mutation)
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await getAuthenticatedUser(ctx);
    return identity?.subject || null;
}

/**
 * Gets the authenticated user ID and throws an error if not authenticated
 * @param ctx - Convex context (query or mutation)
 * @returns User ID
 * @throws AuthError if user is not authenticated
 */
export async function requireCurrentUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await requireAuth(ctx);
    return identity.subject;
}

/**
 * Checks if the current user has permissions to access a specific resource
 * @param ctx - Convex context (query or mutation)
 * @param resourceUserId - ID of the user who owns the resource
 * @returns true if user has permissions, false otherwise
 */
export async function hasPermission(ctx: QueryCtx | MutationCtx, resourceUserId: string) {
    const currentUserId = await getCurrentUserId(ctx);
    return currentUserId === resourceUserId;
}

/**
 * Checks permissions and throws an error if user doesn't have access
 * @param ctx - Convex context (query or mutation)
 * @param resourceUserId - ID of the user who owns the resource
 * @throws AuthError if user doesn't have permissions
 */
export async function requirePermission(ctx: QueryCtx | MutationCtx, resourceUserId: string) {
    const currentUserId = await requireCurrentUserId(ctx);

    if (currentUserId !== resourceUserId) {
        throw new AuthError(
            'FORBIDDEN',
            'User does not have permission to access this resource',
            null
        );
    }
}

/**
 * Gets the authenticated user's profile from the database
 * @param ctx - Convex context (query or mutation)
 * @returns User profile or null if not authenticated or doesn't exist in DB
 */
export async function getCurrentUserProfile(ctx: QueryCtx | MutationCtx) {
    const identity = await getAuthenticatedUser(ctx);

    if (!identity) {
        return null;
    }

    try {
        // First try to lookup user by clerk ID (subject)
        if (identity.subject) {
            const userByClerkId = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
                .first();

            if (userByClerkId) {
                return userByClerkId;
            }
        }

        // Fallback to email lookup if no clerk ID match found
        if (identity.email) {
            // Normalize email to lowercase for consistent lookup
            const normalizedEmail = identity.email.toLowerCase();
            const userByEmail = await ctx.db
                .query("users")
                .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
                .first();

            return userByEmail;
        }

        return null;
    } catch (error) {
        throw new AuthError(
            'USER_PROFILE_LOOKUP_FAILED',
            `Failed to get user profile: ${error}`,
            error
        );
    }
}

/**
 * Gets the authenticated user's profile and throws an error if it doesn't exist
 * @param ctx - Convex context (query or mutation)
 * @returns User profile
 * @throws AuthError if user is not authenticated or doesn't exist in DB
 */
export async function requireCurrentUserProfile(ctx: QueryCtx | MutationCtx) {
    const userProfile = await getCurrentUserProfile(ctx);

    if (!userProfile) {
        throw new AuthError(
            'USER_PROFILE_NOT_FOUND',
            'User profile not found in database',
            null
        );
    }

    return userProfile;
}
