import { Alert, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore, useCan } from "@react-shop/auth";
import { EmptyState, PageHeader, UserShell } from "@react-shop/ui";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link as ReactRouterLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

type RouterLinkAdapterProps = Omit<ComponentPropsWithoutRef<typeof ReactRouterLink>, "href" | "to"> & {
  href: string;
};

const RouterLinkAdapter = forwardRef<HTMLAnchorElement, RouterLinkAdapterProps>(
  function RouterLinkAdapter({ href, ...props }, ref) {
    return <ReactRouterLink ref={ref} to={href} {...props} />;
  },
);

const navItems = [
  { label: "Home", href: "." },
  { label: "Orders", href: "orders" },
  { label: "Account", href: "account" },
];

function activeHrefForMount(pathname: string, mountSegment: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const mountIndex = segments.indexOf(mountSegment);
  const remoteSegments = mountIndex >= 0 ? segments.slice(mountIndex + 1) : segments;
  return remoteSegments[0] ?? ".";
}

function HomePage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="User microfrontend"
        title="Welcome to your shop account"
        description="Manage your profile and order history from a federated user workspace."
      />
      <Alert severity="info">
        Authentication is shared through the platform auth store after signing in through the shell.
      </Alert>
    </Stack>
  );
}

function AccountPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <EmptyState
        title="No profile loaded"
        description="Sign in through the shell to view account details in this remote."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Account"
        title={user.name}
        description="Profile details from the shared auth session."
      />
      <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="overline" color="text.secondary">
              Email
            </Typography>
            <Typography variant="h6">{user.email}</Typography>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Role
            </Typography>
            <Chip label={user.role} sx={{ alignSelf: "flex-start", textTransform: "capitalize" }} />
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Permissions
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {user.permissions.map((permission) => (
                <Chip key={permission} label={permission} variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

function OrdersPage() {
  const canReadOrders = useCan("orders:read");

  if (!canReadOrders) {
    return (
      <EmptyState
        title="Orders are unavailable"
        description="Your current role does not include orders:read."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Orders"
        title="Order history"
        description="A customer order list will appear here once the account API is wired."
      />
      <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
        <Typography color="text.secondary">
          Placeholder for recent orders, shipment status, and reorder actions.
        </Typography>
      </Paper>
    </Stack>
  );
}

export default function App() {
  const location = useLocation();
  const activeHref = activeHrefForMount(location.pathname, "app");

  return (
    <UserShell
      navItems={navItems}
      linkComponent={RouterLinkAdapter}
      activeHref={activeHref}
    >
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </UserShell>
  );
}
