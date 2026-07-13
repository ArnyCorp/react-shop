import type { Preview } from "@storybook/react";
import { useAuthStore } from "@react-shop/auth";
import { permissionsForRole, type Role } from "@react-shop/shared";
import { useLayoutEffect, type ReactNode } from "react";
import { AppThemeProvider } from "../src/AppThemeProvider";

const roleNames: Record<Role, string> = {
  guest: "Guest Visitor",
  user: "Uma User",
  support: "Sam Support",
  manager: "Mara Manager",
  admin: "Ada Admin",
};

type RoleSyncProps = {
  role: Role;
  children: ReactNode;
};

function RoleSync({ role, children }: RoleSyncProps) {
  useLayoutEffect(() => {
    const name = roleNames[role];

    useAuthStore.setState({
      accessToken: role === "guest" ? null : `storybook-${role}-token`,
      user: {
        id: `storybook-${role}`,
        email: `${role}@react-shop.local`,
        name,
        role,
        permissions: permissionsForRole(role),
      },
    });
  }, [role]);

  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    role: {
      description: "Role used by auth-aware stories",
      defaultValue: "admin",
      toolbar: {
        title: "Role",
        icon: "user",
        items: [
          { value: "guest", title: "Guest" },
          { value: "user", title: "User" },
          { value: "support", title: "Support" },
          { value: "manager", title: "Manager" },
          { value: "admin", title: "Admin" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    backgrounds: {
      default: "shop mist",
      values: [
        { name: "shop mist", value: "#eef3f0" },
        { name: "paper", value: "#f7faf8" },
      ],
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Primitives",
          "Patterns",
          "Layouts",
          "Shop",
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const role = (context.globals.role ?? "admin") as Role;

      return (
        <AppThemeProvider>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <div style={{ padding: 24, minHeight: "100vh" }}>
            <RoleSync role={role}>
              <Story />
            </RoleSync>
          </div>
        </AppThemeProvider>
      );
    },
  ],
};

export default preview;
