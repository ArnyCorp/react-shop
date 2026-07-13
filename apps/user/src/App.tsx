import { Alert, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore, useCan } from "@react-shop/auth";
import { EmptyState, PageHeader, UserShell } from "@react-shop/ui";
import { Navigate, Route, Routes } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Account", href: "/account" },
];

function HomePage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="User microfrontend"
        title="Welcome to your shop account"
        description="Manage your profile and order history from a federated user workspace."
      />
      <Alert severity="info">
        Authentication is shared through the platform auth store; shell login routing arrives in
        Task 6.
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
  return (
    <UserShell navItems={navItems}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserShell>
  );
}
