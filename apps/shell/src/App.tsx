import { Box, CircularProgress, Container } from "@mui/material";
import { useCartStore } from "@react-shop/shared/cart";
import { ShopHeader } from "@react-shop/ui";
import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

const CatalogApp = lazy(() => import("catalog/App"));
const CartApp = lazy(() => import("cart/App"));

function Loading() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: 280 }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

export function App() {
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <ShopHeader
        cartCount={cartCount}
        renderBrandLink={(children) => (
          <Link to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
            {children}
          </Link>
        )}
        renderCartLink={(children) => (
          <Link to="/cart" style={{ textDecoration: "none" }}>
            {children}
          </Link>
        )}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<CatalogApp />} />
            <Route path="/cart" element={<CartApp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Container>
    </Box>
  );
}
