import type { AuthUser, Permission } from "@react-shop/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";

type AuthState = {
  user: AuthUser | null;
};

const { mockState, useAuthStoreMock } = vi.hoisted(() => {
  const state: AuthState = {
    user: null,
  };

  const storeMock = vi.fn((selector: (state: AuthState) => boolean) => {
    const selected = selector(state);

    if (typeof selected !== "boolean") {
      throw new Error("useCan must subscribe to a derived boolean");
    }

    return selected;
  });

  return { mockState: state, useAuthStoreMock: storeMock };
});

vi.mock("./session-store", () => ({
  useAuthStore: useAuthStoreMock,
}));

import { useCan } from "./use-can";

describe("useCan", () => {
  beforeEach(() => {
    mockState.user = null;
    useAuthStoreMock.mockClear();
  });

  it("subscribes to a boolean permission result", () => {
    mockState.user = {
      id: "1",
      email: "admin@example.com",
      name: "Ada Admin",
      role: "admin",
      permissions: ["settings:write"],
    };

    expect(useCan("settings:write")).toBe(true);
  });

  it("returns false when there is no signed-in user", () => {
    expect(useCan("users:read")).toBe(false);
  });

  it("returns false when the signed-in user lacks the permission", () => {
    mockState.user = {
      id: "2",
      email: "customer@example.com",
      name: "Uma User",
      role: "user",
      permissions: ["catalog:read", "orders:read"] satisfies Permission[],
    };

    expect(useCan("settings:write")).toBe(false);
  });
});
