import { Box, Button, CircularProgress, Container, Stack } from "@mui/material";
import { useAuthStore } from "@react-shop/auth";
import { useCartStore } from "@react-shop/shared/cart";
import { ShopHeader } from "@react-shop/ui";
import { lazy, type ReactNode, Suspense } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { isStaffRole } from "./auth-routing";
import { LoginPage } from "./pages/LoginPage";

const CatalogApp = lazy(() => import("catalog/App"));
const CartApp = lazy(() => import("cart/App"));
const UserApp = lazy(() => import("user/App"));
const DashboardApp = lazy(() => import("dashboard/App"));

function Loading() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: 280 }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

type RouteGuardProps = {
  children: ReactNode;
};

function RequireAuth({ children }: RouteGuardProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!user || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function RequireStaff({ children }: RouteGuardProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!user || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isStaffRole(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

function LogoutButton({ fixed = false }: { fixed?: boolean }) {
  const navigate = useNavigate();

  function logout() {
    useAuthStore.getState().clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <Button
      color={fixed ? "primary" : "inherit"}
      variant={fixed ? "contained" : "outlined"}
      onClick={logout}
      sx={
        fixed
          ? {
              position: "fixed",
              right: 16,
              top: 16,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }
          : undefined
      }
    >
      Logout
    </Button>
  );
}

function ShopChrome({ children }: RouteGuardProps) {
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ShopHeader
        cartCount={cartCount}
        renderBrandLink={(children) => (
          <Link to="/catalog" style={{ textDecoration: "none", flexGrow: 1 }}>
            {children}
          </Link>
        )}
        renderCartLink={(children) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Link to="/cart" style={{ textDecoration: "none" }}>
              {children}
            </Link>
            <LogoutButton />
          </Stack>
        )}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

function RemoteChrome({ children }: RouteGuardProps) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <LogoutButton fixed />
      {children}
    </Box>
  );
}

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app/*"
          element={
            <RequireAuth>
              <RemoteChrome>
                <UserApp />
              </RemoteChrome>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <RequireStaff>
              <RemoteChrome>
                <DashboardApp />
              </RemoteChrome>
            </RequireStaff>
          }
        />
        <Route
          path="/catalog"
          element={
            <RequireAuth>
              <ShopChrome>
                <CatalogApp />
              </ShopChrome>
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <ShopChrome>
                <CartApp />
              </ShopChrome>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
