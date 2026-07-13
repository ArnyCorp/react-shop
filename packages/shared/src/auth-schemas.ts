import { z } from "zod";
import { PermissionSchema, RoleSchema } from "./rbac";

export const AuthUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema,
  permissions: z.array(PermissionSchema),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: AuthUserSchema,
});
export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
