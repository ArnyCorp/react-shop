import { describe, expect, it } from "vitest";
import { can, permissionsForRole, RoleSchema } from "./rbac";

describe("rbac", () => {
  it("parses known roles", () => {
    expect(RoleSchema.parse("admin")).toBe("admin");
  });

  it("grants admin settings:write", () => {
    expect(can("admin", "settings:write")).toBe(true);
  });

  it("denies user users:write", () => {
    expect(can("user", "users:write")).toBe(false);
  });

  it("lists unique permissions for manager", () => {
    expect(permissionsForRole("manager")).toContain("catalog:write");
  });
});
