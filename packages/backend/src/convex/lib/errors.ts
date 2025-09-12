// src/convex/lib/errors.ts
export type AuthErrorType =
    | 'USER_CREATION_FAILED'
    | 'USER_LOOKUP_FAILED'
    | 'INVALID_CREDENTIALS'
    | 'TOKEN_GENERATION_FAILED'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'USER_PROFILE_LOOKUP_FAILED'
    | 'USER_PROFILE_NOT_FOUND'
    | 'RBAC_NOT_CONFIGURED';

export class AuthError extends Error {
    constructor(
        public readonly type: AuthErrorType,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'AuthError';
    }
    get code(): AuthErrorType {
        return this.type;
    }
}
