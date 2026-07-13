import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCan } from "@react-shop/auth";
import { DashboardShell, EmptyState, PageHeader, StatCard } from "@react-shop/ui";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Link as ReactRouterLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { UsersPage } from "./pages/UsersPage";

type RouterLinkAdapterProps = Omit<ComponentPropsWithoutRef<typeof ReactRouterLink>, "href" | "to"> & {
  href: string;
};

const RouterLinkAdapter = forwardRef<HTMLAnchorElement, RouterLinkAdapterProps>(
  function RouterLinkAdapter({ href, ...props }, ref) {
    return <ReactRouterLink ref={ref} to={href} {...props} />;
  },
);

const mockOrders = [
  { id: "ORD-1048", customer: "Taylor Smith", status: "Packed" },
  { id: "ORD-1049", customer: "Jordan Lee", status: "Awaiting payment" },
  { id: "ORD-1050", customer: "Riley Green", status: "Ready to ship" },
];

function activeHrefForMount(pathname: string, mountSegment: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const mountIndex = segments.indexOf(mountSegment);
  const remoteSegments = mountIndex >= 0 ? segments.slice(mountIndex + 1) : segments;
  return remoteSegments[0] ?? ".";
}

function OverviewPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Dashboard microfrontend"
        title="Store overview"
        description="Mock operational metrics for the federated staff dashboard."
      />
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        <StatCard value="128" label="Orders today" helperText="Up 12% from yesterday" />
        <StatCard value="$24.8k" label="Revenue" helperText="Mock trailing 24 hour total" />
        <StatCard value="37" label="Open tickets" helperText="Support queue placeholder" />
        <StatCard value="98.7%" label="Uptime" helperText="Platform health mock" />
      </Box>
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
        title="Operations order queue"
        description="Placeholder order data for dashboard routing."
      />
      <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          {mockOrders.map((order) => (
            <Box
              key={order.id}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "120px 1fr auto" },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <Typography fontWeight={700}>{order.id}</Typography>
              <Typography color="text.secondary">{order.customer}</Typography>
              <Chip label={order.status} size="small" />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

function SettingsPage() {
  const canWriteSettings = useCan("settings:write");

  if (!canWriteSettings) {
    return (
      <EmptyState
        title="Settings are unavailable"
        description="Your current role does not include settings:write."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Settings"
        title="Platform settings"
        description="Administrative settings will be connected as the platform workflow expands."
      />
      <Paper variant="outlined" sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
        <Typography color="text.secondary">
          Placeholder for tenant configuration, access controls, and platform preferences.
        </Typography>
      </Paper>
    </Stack>
  );
}

export default function App() {
  const location = useLocation();
  const activeHref = activeHrefForMount(location.pathname, "dashboard");

  return (
    <DashboardShell
      title="Operations dashboard"
      linkComponent={RouterLinkAdapter}
      activeHref={activeHref}
    >
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </DashboardShell>
  );
}
