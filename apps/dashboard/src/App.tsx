import {
  Alert,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCan } from "@react-shop/auth";
import { DashboardShell, EmptyState, PageHeader, StatCard } from "@react-shop/ui";
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

const mockUsers = [
  { name: "Ava Chen", email: "ava@example.com", role: "admin" },
  { name: "Milo Grant", email: "milo@example.com", role: "support" },
  { name: "Nora Patel", email: "nora@example.com", role: "manager" },
];

const mockOrders = [
  { id: "ORD-1048", customer: "Taylor Smith", status: "Packed" },
  { id: "ORD-1049", customer: "Jordan Lee", status: "Awaiting payment" },
  { id: "ORD-1050", customer: "Riley Green", status: "Ready to ship" },
];

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

function UsersPage() {
  const canReadUsers = useCan("users:read");
  const canWriteUsers = useCan("users:write");

  if (!canReadUsers) {
    return (
      <EmptyState
        title="Users are unavailable"
        description="Your current role does not include users:read."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Users"
        title="User management"
        description="A placeholder staff list for the upcoming management workflow."
      />
      <Alert severity={canWriteUsers ? "success" : "info"}>
        {canWriteUsers
          ? "users:write is enabled; Task 7 can attach edit actions here."
          : "Read-only mode: Task 7 actions stay disabled until users:write is granted."}
      </Alert>
      <Paper variant="outlined" sx={{ borderRadius: 4 }}>
        <List disablePadding>
          {mockUsers.map((user) => (
            <ListItem
              key={user.email}
              divider
              secondaryAction={<Chip label={user.role} size="small" />}
            >
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          ))}
        </List>
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
        description="Administrative settings will be connected in a later task."
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

  return (
    <DashboardShell
      title="Operations dashboard"
      linkComponent={RouterLinkAdapter}
      activeHref={location.pathname}
    >
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardShell>
  );
}
