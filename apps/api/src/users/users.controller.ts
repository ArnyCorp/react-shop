import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RoleSchema } from "@react-shop/shared";
import { z } from "zod";
import { RequirePermissions } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { UsersService } from "./users.service";

const UpdateUserRoleSchema = z.object({
  role: RoleSchema,
});

type UpdateUserRoleBody = z.infer<typeof UpdateUserRoleSchema>;

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"), PermissionsGuard)
  @RequirePermissions("users:read")
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(":id/role")
  @UseGuards(AuthGuard("jwt"), PermissionsGuard)
  @RequirePermissions("users:write")
  updateRole(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateUserRoleSchema)) body: UpdateUserRoleBody,
  ) {
    return this.usersService.updateRole(id, body.role);
  }
}
