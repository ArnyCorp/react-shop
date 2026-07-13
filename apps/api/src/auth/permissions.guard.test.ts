import "reflect-metadata";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";
import { permissionsForRole } from "@react-shop/shared";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { PermissionsGuard } from "./permissions.guard";

function contextWithUser(user: unknown): ExecutionContext {
  return {
    getHandler: () => contextWithUser,
    getClass: () => Object,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe("PermissionsGuard", () => {
  it("requires every declared permission", () => {
    const reflector = new Reflector();
    Reflect.defineMetadata(
      PERMISSIONS_KEY,
      ["users:read", "users:write"],
      contextWithUser,
    );
    const guard = new PermissionsGuard(reflector);

    const allowed = guard.canActivate(
      contextWithUser({
        id: "admin",
        email: "admin@react-shop.dev",
        name: "Admin User",
        role: "admin",
        permissions: permissionsForRole("admin"),
      }),
    );

    expect(allowed).toBe(true);
  });

  it("denies users missing any declared permission", () => {
    const reflector = new Reflector();
    Reflect.defineMetadata(
      PERMISSIONS_KEY,
      ["users:read", "users:write"],
      contextWithUser,
    );
    const guard = new PermissionsGuard(reflector);

    const allowed = guard.canActivate(
      contextWithUser({
        id: "support",
        email: "support@react-shop.dev",
        name: "Support User",
        role: "support",
        permissions: permissionsForRole("support"),
      }),
    );

    expect(allowed).toBe(false);
  });
});
