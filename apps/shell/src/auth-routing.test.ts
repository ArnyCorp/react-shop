import { describe, expect, it } from "vitest";
import { homeForRole, isStaffRole } from "./auth-routing";

describe("shell auth routing", () => {
  it("routes guest and user roles to the shopper app", () => {
    expect(homeForRole("guest")).toBe("/app");
    expect(homeForRole("user")).toBe("/app");
  });

  it("routes staff roles to the dashboard", () => {
    expect(homeForRole("support")).toBe("/dashboard");
    expect(homeForRole("manager")).toBe("/dashboard");
    expect(homeForRole("admin")).toBe("/dashboard");
  });

  it("allows only staff roles into the dashboard", () => {
    expect(isStaffRole("guest")).toBe(false);
    expect(isStaffRole("user")).toBe(false);
    expect(isStaffRole("support")).toBe(true);
    expect(isStaffRole("manager")).toBe(true);
    expect(isStaffRole("admin")).toBe(true);
  });
});
