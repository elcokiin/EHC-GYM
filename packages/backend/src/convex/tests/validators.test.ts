// src/convex/tests/validators.test.ts
import { describe, it, expect } from "vitest";
import type { RoleType, ContactDTO } from "../dto/user";

describe("RoleType", () => {
    it("accepts valid roles", () => {
        const roles: RoleType[] = ["CLIENT", "TRAINER", "ADMIN"];
        expect(roles).toContain("CLIENT");
        expect(roles).toContain("TRAINER");
        expect(roles).toContain("ADMIN");
    });
});

describe("ContactDTO shape", () => {
    it("email contact minimal", () => {
        const c: ContactDTO = {
            type: "email",
            isPrimary: true,
            email: "a@b.com",
            verified: false,
        };
        expect(c.type).toBe("email");
        expect(c.email).toBeDefined();
    });

    it("phone contact minimal", () => {
        const c: ContactDTO = {
            type: "phone",
            isPrimary: true,
            phoneE164: "+573000000000",
            verified: false,
        };
        expect(c.type).toBe("phone");
        expect(c.phoneE164).toMatch(/^\+\d+/);
    });
});
