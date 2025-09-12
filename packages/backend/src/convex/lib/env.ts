// src/convex/lib/env.ts

/**
 * Controla si se permite la mutacion seedAdminByEmail.
 * En produccion, setear ALLOW_SEED_ADMIN="false".
 */
export function allowSeedAdmin(): boolean {
    const raw = process.env.ALLOW_SEED_ADMIN;
    if (raw === undefined) {
        // Por defecto: true en dev, false en prod
        return true;
    }
    return raw.toLowerCase() === "true";
}
