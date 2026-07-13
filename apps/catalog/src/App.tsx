import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import { DEFAULT_API_URL, ProductSchema, type Product } from "@react-shop/shared";
import { useCartStore } from "@react-shop/shared/cart";
import { ProductCard } from "@react-shop/ui";
import { useEffect, useState } from "react";
import { z } from "zod";

const ProductsResponseSchema = z.array(ProductSchema);

async function fetchProducts(apiUrl: string): Promise<Product[]> {
  const response = await fetch(`${apiUrl}/products`);
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }
  return ProductsResponseSchema.parse(await response.json());
}

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts(apiUrl)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load catalog");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  return (
    <Stack spacing={3} sx={{ animation: "rise-in 480ms ease both" }}>
      <Box>
        <Typography variant="overline" color="primary">
          Catalog microfrontend
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5 }}>
          Curated home goods
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
          Browse the Nest-powered catalog. Adding an item updates the shared Zustand cart store
          across remotes.
        </Typography>
      </Box>

      {error ? <Alert severity="warning">{error}</Alert> : null}

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={360} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(item) => addItem(item)}
              />
            ))}
      </Box>
    </Stack>
  );
}
