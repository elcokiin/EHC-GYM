# Convex Authentication System

This document explains how to use the authentication functions in your Convex application with Clerk.

## Important Files

- `auth.ts` - Authentication utility functions
- `auth.config.ts` - Clerk configuration
- `user/` - User-related queries and mutations

## Available Authentication Functions

### 1. `getAuthenticatedUser(ctx)`
Checks if the user is authenticated without throwing errors.
```typescript
const user = await getAuthenticatedUser(ctx);
if (user) {
    // Authenticated user
    console.log(user.email, user.subject);
} else {
    // Non-authenticated user
}
```

### 2. `requireAuth(ctx)`
Requires the user to be authenticated, throws error if not.
```typescript
const user = await requireAuth(ctx); // Throws AuthError if not authenticated
// User is guaranteed to be authenticated here
```

### 3. `getCurrentUserId(ctx)`
Gets the current user's Clerk ID.
```typescript
const userId = await getCurrentUserId(ctx); // string | null
```

### 4. `requireCurrentUserId(ctx)`
Gets the current user's Clerk ID, requires authentication.
```typescript
const userId = await requireCurrentUserId(ctx); // string, throws error if not authenticated
```

### 5. `getCurrentUserProfile(ctx)`
Gets the user profile from the database.
```typescript
const profile = await getCurrentUserProfile(ctx); // User | null
```

### 6. `requireCurrentUserProfile(ctx)`
Gets the user profile from the database, requires it to exist.
```typescript
const profile = await requireCurrentUserProfile(ctx); // User, throws error if doesn't exist
```

### 7. `hasPermission(ctx, resourceUserId)`
Checks if the current user has permissions over a resource.
```typescript
const canAccess = await hasPermission(ctx, resource.ownerId); // boolean
```

### 8. `requirePermission(ctx, resourceUserId)`
Requires the current user to have permissions over a resource.
```typescript
await requirePermission(ctx, resource.ownerId); // Throws error if no permissions
```

## Usage Examples

### Public vs Private Query
```typescript
export const getData = query({
    args: {},
    handler: async (ctx) => {
        const user = await getAuthenticatedUser(ctx);
        
        if (user) {
            // Show private data
            return await ctx.db.query("private_data").collect();
        } else {
            // Show public data
            return await ctx.db.query("public_data").collect();
        }
    },
});
```

### Query that Requires Authentication
```typescript
export const getMyData = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx); // Throws error if not authenticated
        
        return await ctx.db.query("user_specific_data").collect();
    },
});
```

### Mutation with Permission Verification
```typescript
export const updateResource = mutation({
    args: {
        resourceId: v.id("resources"),
        newValue: v.string(),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        
        const resource = await ctx.db.get(args.resourceId);
        if (!resource) {
            throw new Error("Resource not found");
        }
        
        // Only owner can update
        await requirePermission(ctx, resource.ownerId);
        
        await ctx.db.patch(args.resourceId, { value: args.newValue });
        return { success: true };
    },
});
```

### Get Current User Profile
```typescript
export const getMyProfile = query({
    args: {},
    handler: async (ctx) => {
        return await getCurrentUserProfile(ctx);
    },
});
```

## Error Handling

All functions that require authentication throw `AuthError` with the following types:
- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User doesn't have permissions
- `USER_PROFILE_NOT_FOUND` - User profile not found
- `USER_PROFILE_LOOKUP_FAILED` - Error looking up profile

```typescript
try {
    await requireAuth(ctx);
    // Protected code
} catch (error) {
    if (error instanceof AuthError) {
        // Handle authentication error
        console.log(error.code, error.message);
    }
    throw error;
}
```

## Schema Configuration

Make sure your schema includes the necessary indexes:

```typescript
users: defineTable({
    clerkId: v.optional(v.string()),
    email: v.string(),
    // ... other fields
}).index("by_email", ["email"])
  .index("by_clerk_id", ["clerkId"]),
```

## Best Practices

1. **Use `requireAuth()` for private endpoints**: If your endpoint should be private, use `requireAuth()` at the beginning.

2. **Use `getAuthenticatedUser()` for flexible endpoints**: If your endpoint can work with or without authentication.

3. **Verify permissions for specific resources**: Use `requirePermission()` when the user should own the resource.

4. **Handle errors appropriately**: Always catch and handle `AuthError` in your frontend.

5. **Use database indexes**: Make sure you have indexes on `email` and `clerkId` for efficient searches.
