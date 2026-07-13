import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  type AuthUser,
  type Permission,
  permissionsForRole,
} from "@react-shop/shared";
import { PERMISSIONS_KEY } from "./permissions.decorator";

type RequestWithUser = {
  user?: AuthUser;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      return false;
    }

    const grantedPermissions = new Set<Permission>([
      ...permissionsForRole(user.role),
      ...user.permissions,
    ]);
    return requiredPermissions.every((permission) =>
      grantedPermissions.has(permission),
    );
  }
}
