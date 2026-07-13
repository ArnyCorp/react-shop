import { beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => {
      store.clear();
    },
  };
  // @ts-expect-error test mock
  globalThis.localStorage = localStorage;
  // @ts-expect-error test mock
  globalThis.window = { localStorage };
});

import { useAuthStore } from "./session-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null });
  });

  it("sets session on login", () => {
    useAuthStore.getState().setSession({
      accessToken: "token",
      user: {
        id: "1",
        email: "a@b.com",
        name: "Ada",
        role: "admin",
        permissions: ["settings:write"],
      },
    });
    expect(useAuthStore.getState().user?.role).toBe("admin");
  });
});
