// src/convex/tests/mappers.test.ts
import { describe, it, expect } from "vitest";
import { calculateAge, mapUserToSummary } from "../lib/mappers";

describe("calculateAge", () => {
    it("returns null for empty", () => {
        expect(calculateAge("")).toBeNull();
        expect(calculateAge(null as any)).toBeNull();
        expect(calculateAge(undefined as any)).toBeNull();
    });

    it("calculates age for valid YYYY-MM-DD", () => {
        // Fecha fija para test: asumimos alguien nacido hace 20 años exactos el 01-01
        const today = new Date();
        const birth = `${today.getFullYear() - 20}-01-01`;
        const age = calculateAge(birth);
        // age puede ser 19 o 20 dependiendo del dia actual; solo se valida el rango razonable
        expect(age === 19 || age === 20).toBe(true);
    });
});

describe("mapUserToSummary", () => {
    const fakeUser = {
        _id: "user_1",
        _creationTime: Date.now(),
        name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "3000000000",
        country_code: "+57",
        birthday: "2000-01-01",
        clerkId: "clerk_123"
    };

    it("maps legacy user to DTO with contacts", () => {
        const dto = mapUserToSummary(fakeUser, { role: "CLIENT", lastLoginAt: 123 });
        expect(dto.id).toBe(fakeUser._id);
        expect(dto.role).toBe("CLIENT");
        expect(dto.person.firstName).toBe("John");
        expect(dto.contacts.length).toBeGreaterThan(0);
        const phone = dto.contacts.find(c => c.type === "phone");
        expect(phone?.phoneE164).toBe("+573000000000");
        expect(dto.identity.providerUserId).toBe("clerk_123");
        expect(dto.identity.lastLoginAt).toBe(123);
    });

    it("handles missing optional fields", () => {
        const u2 = { _id: "user_2", _creationTime: 1, name: "", last_name: "" };
        const dto = mapUserToSummary(u2, { role: null, lastLoginAt: null });
        expect(dto.id).toBe("user_2");
        expect(dto.role).toBeNull();
        expect(dto.contacts.length).toBe(0);
        expect(dto.identity.lastLoginAt).toBeNull();
    });
});
