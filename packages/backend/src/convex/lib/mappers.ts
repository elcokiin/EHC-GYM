// src/convex/lib/mappers.ts
import type { ContactDTO, PersonDTO, UserSummaryDTO } from "../dto/user";
import type { RoleType } from "../dto/user";

// Utilidad para calcular edad desde una fecha "YYYY-MM-DD"
export function calculateAge(birthDate: string | null | undefined): number | null {
    if (!birthDate) return null;
    // Acepta formato "YYYY-MM-DD" o cadena vacia
    const [y, m, d] = birthDate.split("-").map((s) => parseInt(s, 10));
    if (!y || !m || !d) return null;
    const today = new Date();
    let age = today.getFullYear() - y;
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    if (mm < m || (mm === m && dd < d)) age--;
    return age >= 0 ? age : null;
}

// Mapea un documento de "users" (schema legacy) a UserSummaryDTO
// Nota: aqui no resuelve role assignment real; se deja como null
// y lo rellenan las queries/mutations cuando corresponda.
export function mapUserToSummary(u: any, opts?: {
    role?: RoleType | null;
    lastLoginAt?: number | null;
}): UserSummaryDTO {
    const role = opts?.role ?? null;
    const lastLoginAt = opts?.lastLoginAt ?? null;

    const person: PersonDTO = {
        firstName: u?.name ?? "",
        lastName: u?.last_name ?? "",
        avatarUrl: null,
        birthDate: u?.birthday ? String(u.birthday) : "",
        age: calculateAge(u?.birthday),
    };

    const contacts: ContactDTO[] = [];
    if (u?.email) {
        contacts.push({
            type: "email",
            isPrimary: true,
            email: String(u.email),
            verified: false,
        });
    }
    if (u?.phone) {
        contacts.push({
            type: "phone",
            isPrimary: !!u.phone,
            phoneE164: `${u.country_code ?? ""}${u.phone}`,
            verified: false,
        });
    }

    return {
        id: u._id,
        createdAt: u._creationTime,
        status: "active",
        role,
        clerkId: u?.clerkId ?? null,
        person,
        contacts,
        identity: {
            provider: "clerk",
            providerUserId: u?.clerkId ?? null,
            emailFromProvider: u?.email ?? null,
            lastLoginAt,
        },
        activeSession: null,
        currentRoleAssignment: {
            role,
            assignedAt: null,
            assignedByUserId: null,
            active: role != null,
        },
    };
}
