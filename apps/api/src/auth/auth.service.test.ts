import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { describe, expect, it } from "vitest";
import { AuthTokenResponseSchema, permissionsForRole } from "@react-shop/shared";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";

describe("AuthService", () => {
  it("logs in seeded users and signs the JWT subject as the user id", async () => {
    const jwtService = new JwtService({ secret: "test-secret" });
    const usersService = new UsersService();
    const authService = new AuthService(usersService, jwtService);

    const response = await authService.login({
      email: "admin@react-shop.dev",
      password: "password123",
    });

    expect(AuthTokenResponseSchema.parse(response)).toEqual(response);
    expect(response.user.role).toBe("admin");
    expect(response.user.permissions).toEqual(permissionsForRole("admin"));
    expect(jwtService.verify(response.accessToken).sub).toBe(response.user.id);
  });

  it("rejects invalid credentials", async () => {
    const authService = new AuthService(
      new UsersService(),
      new JwtService({ secret: "test-secret" }),
    );

    await expect(
      authService.login({
        email: "admin@react-shop.dev",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("registers users with the default user role", async () => {
    const jwtService = new JwtService({ secret: "test-secret" });
    const authService = new AuthService(new UsersService(), jwtService);

    const response = await authService.register({
      email: "registered@react-shop.dev",
      name: "Registered User",
      password: "password123",
    });

    expect(response.user.role).toBe("user");
    expect(response.user.permissions).toEqual(permissionsForRole("user"));
    expect(jwtService.verify(response.accessToken).sub).toBe(response.user.id);
  });
});
