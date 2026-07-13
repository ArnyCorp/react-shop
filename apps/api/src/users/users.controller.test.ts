import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { PERMISSIONS_KEY } from "../auth/permissions.decorator";
import { UsersController } from "./users.controller";

describe("UsersController", () => {
  it("requires users:write and delegates role changes to UsersService", () => {
    const usersService = {
      updateRole: vi.fn().mockReturnValue({ id: "seed-support", role: "manager" }),
    };
    const controller = new UsersController(usersService as never);

    const result = controller.updateRole("seed-support", { role: "manager" });

    expect(Reflect.getMetadata(PERMISSIONS_KEY, UsersController.prototype.updateRole)).toEqual([
      "users:write",
    ]);
    expect(usersService.updateRole).toHaveBeenCalledWith("seed-support", "manager");
    expect(result).toEqual({ id: "seed-support", role: "manager" });
  });
});
