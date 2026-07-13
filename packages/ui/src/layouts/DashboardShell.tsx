import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuthStore, useCan } from "@react-shop/auth";
import type { Permission } from "@react-shop/shared";
import type { ElementType, ReactNode } from "react";

type DashboardNavItem = {
  label: string;
  href: string;
  permission?: Permission;
};

const dashboardNavItems: DashboardNavItem[] = [
  { label: "Overview", href: "." },
  { label: "Users", href: "users", permission: "users:read" },
  { label: "Orders", href: "orders", permission: "orders:read" },
  { label: "Settings", href: "settings", permission: "settings:write" },
];

export type DashboardShellProps = {
  brand?: string;
  title?: string;
  activeHref?: string;
  linkComponent?: ElementType;
  children: ReactNode;
};

export function DashboardShell({
  brand = "React Shop",
  title = "Dashboard",
  activeHref = "/",
  linkComponent: LinkComponent = "a",
  children,
}: DashboardShellProps) {
  const user = useAuthStore((state) => state.user);
  const canReadUsers = useCan("users:read");
  const canReadOrders = useCan("orders:read");
  const canWriteSettings = useCan("settings:write");

  const permissionVisibility: Partial<Record<Permission, boolean>> = {
    "orders:read": canReadOrders,
    "users:read": canReadUsers,
    "settings:write": canWriteSettings,
  };

  const visibleNavItems = dashboardNavItems.filter(
    (item) => !item.permission || permissionVisibility[item.permission] === true,
  );
  const activeKey = normalizeHref(activeHref);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Paper
        component="aside"
        square
        elevation={0}
        sx={{
          borderRight: { md: "1px solid" },
          borderBottom: { xs: "1px solid", md: 0 },
          borderColor: "divider",
          bgcolor: "background.paper",
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h5" fontFamily='"Syne", sans-serif'>
              {brand}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Staff workspace
            </Typography>
          </Stack>

          <Chip
            label={`${user?.name ?? "Guest"} - ${user?.role ?? "guest"}`}
            variant="outlined"
            sx={{ justifyContent: "flex-start", bgcolor: "background.default" }}
          />

          <Divider />

          <List component="nav" aria-label="Dashboard navigation" disablePadding>
            {visibleNavItems.map((item) => {
              const selected = activeKey === normalizeHref(item.href);

              return (
                <ListItemButton
                  key={item.label}
                  component={LinkComponent}
                  href={item.href}
                  selected={selected}
                  aria-current={selected ? "page" : undefined}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Stack>
      </Paper>

      <Box component="main" sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Typography variant="h3" component="h1">
            {title}
          </Typography>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

function normalizeHref(href: string): string {
  const segments = href.split("?")[0].split("#")[0].split("/").filter(Boolean);
  return segments.at(-1) ?? ".";
}
