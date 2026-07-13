import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { permissionsForRole } from "@react-shop/shared";
import { compareSync } from "bcryptjs";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  it("seeds users with hashed passwords and role-derived permissions", () => {
    const usersService = new UsersService();

    const admin = usersService.findByEmail("admin@react-shop.dev");

    expect(admin?.role).toBe("admin");
    expect(admin?.permissions).toEqual(permissionsForRole("admin"));
    expect(admin?.passwordHash).not.toBe("password123");
    expect(compareSync("password123", admin?.passwordHash ?? "")).toBe(true);
  });

  it("returns public users without password hashes", () => {
    const usersService = new UsersService();

    const users = usersService.findAll();

    expect(users).toHaveLength(4);
    expect(users[0]).not.toHaveProperty("passwordHash");
  });

  it("creates registered users with the user role and derived permissions", () => {
    const usersService = new UsersService();

    const created = usersService.create({
      email: "new@react-shop.dev",
      name: "New User",
      password: "password123",
    });

    expect(created).toMatchObject({
      email: "new@react-shop.dev",
      name: "New User",
      role: "user",
      permissions: permissionsForRole("user"),
    });
    expect(created).not.toHaveProperty("passwordHash");
  });

  it("updates a user's role with derived permissions without exposing password hashes", () => {
    const usersService = new UsersService();

    const updated = usersService.updateRole("seed-support", "manager");

    expect(updated).toMatchObject({
      id: "seed-support",
      role: "manager",
      permissions: permissionsForRole("manager"),
    });
    expect(updated).not.toHaveProperty("passwordHash");
    expect(usersService.findByEmail("support@react-shop.dev")?.permissions).toEqual(
      permissionsForRole("manager"),
    );
  });

  it("throws NotFoundException when updating a missing user's role", () => {
    const usersService = new UsersService();

    expect(() => usersService.updateRole("missing-user", "admin")).toThrow(NotFoundException);
  });
});
