import type { Permission } from "@react-shop/shared";
import { useAuthStore } from "./session-store";

export function useCan(permission: Permission): boolean {
  return useAuthStore((s) => (s.user?.permissions ?? []).includes(permission));
}
