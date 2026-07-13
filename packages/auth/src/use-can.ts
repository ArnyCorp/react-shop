import type { Permission } from "@react-shop/shared";
import { useAuthStore } from "./session-store";

export function useCan(permission: Permission): boolean {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  return permissions.includes(permission);
}
