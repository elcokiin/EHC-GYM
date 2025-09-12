// src/convex/dto/user.ts

export type RoleType = 'CLIENT' | 'TRAINER' | 'ADMIN';

export type ContactType = 'email' | 'phone';

export interface ContactDTO {
    type: ContactType;
    isPrimary: boolean;
    // email contact
    email?: string;
    // phone contact
    phoneE164?: string;
    verified: boolean;
}

export interface PersonDTO {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    birthDate: string | null; // ISO date string (YYYY-MM-DD) o vacio si no hay dato
    age: number | null;       // calculada si hay birthDate valida
}

export interface IdentityDTO {
    provider: 'clerk';
    providerUserId: string | null;   // clerkId
    emailFromProvider: string | null;
    lastLoginAt: number | null;      // epoch ms
}

export interface RoleAssignmentDTO {
    role: RoleType | null;
    assignedAt: number | null;        // epoch ms
    assignedByUserId: string | null;  // Id<"users"> as string
    active: boolean;
}

export interface UserSummaryDTO {
    id: string;                 // Id<"users">
    createdAt: number;          // epoch ms
    status: 'active' | 'inactive';
    role: RoleType | null;
    clerkId: string | null;

    person: PersonDTO;
    contacts: ContactDTO[];

    identity: IdentityDTO;

    activeSession: null; // placeholder para futura integracion de sesiones
    currentRoleAssignment: RoleAssignmentDTO;
}
