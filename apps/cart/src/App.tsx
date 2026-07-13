import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CreateOrderSchema,
  DEFAULT_API_URL,
  formatPrice,
  OrderSchema,
} from "@react-shop/shared";
import { useCartStore } from "@react-shop/shared/cart";
import { ShopButton } from "@react-shop/ui";
import { useState } from "react";

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );
  const [email, setEmail] = useState("guest@react-shop.dev");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function checkout() {
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const payload = CreateOrderSchema.parse({
        email,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Checkout failed (${response.status})`);
      }

      const order = OrderSchema.parse(await response.json());
      clear();
      setMessage(`Order ${order.id.slice(0, 8)} placed for ${formatPrice(order.total)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ animation: "rise-in 480ms ease both", maxWidth: 720 }}>
      <Box>
        <Typography variant="overline" color="secondary">
          Cart microfrontend
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5 }}>
          Your bag
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Alert severity="info">Your cart is empty. Add something from the catalog.</Alert>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Box
              key={item.product.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "96px 1fr auto",
                gap: 2,
                alignItems: "center",
                p: 1.5,
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                component="img"
                src={item.product.image}
                alt={item.product.name}
                sx={{ width: 96, height: 96, objectFit: "cover", borderRadius: 2 }}
              />
              <Box>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.product.price)}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  label="Qty"
                  value={item.quantity}
                  onChange={(event) =>
                    setQuantity(item.product.id, Number(event.target.value) || 0)
                  }
                  inputProps={{ min: 1 }}
                  sx={{ mt: 1, width: 96 }}
                />
              </Box>
              <IconButton
                aria-label={`Remove ${item.product.name}`}
                onClick={() => removeItem(item.product.id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          ))}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
            />
            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
              {formatPrice(subtotal)}
            </Typography>
            <ShopButton onClick={checkout} disabled={submitting} color="secondary">
              {submitting ? "Placing…" : "Checkout"}
            </ShopButton>
          </Stack>
        </Stack>
      )}

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  );
}
