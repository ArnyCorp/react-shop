import {
  Alert,
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@react-shop/auth";
import {
  AuthTokenResponseSchema,
  DEFAULT_API_URL,
  LoginSchema,
} from "@react-shop/shared";
import { ShopButton } from "@react-shop/ui";
import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { homeForRole } from "../auth-routing";

const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;

export function LoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [email, setEmail] = useState("admin@react-shop.dev");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const credentials = LoginSchema.parse({ email, password });
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed (${response.status})`);
      }

      const session = AuthTokenResponseSchema.parse(await response.json());
      useAuthStore.getState().setSession(session);
      navigate(homeForRole(session.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        px: 2,
        py: 6,
      }}
    >
      <Card variant="outlined" sx={{ width: "100%", maxWidth: 480, borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack component="form" spacing={3} onSubmit={submitLogin}>
            <Box>
              <Typography variant="overline" color="primary">
                React Shop shell
              </Typography>
              <Typography variant="h3" sx={{ mt: 0.5 }}>
                Sign in
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Use a seeded account to open the shopper app or staff dashboard.
              </Typography>
            </Box>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <ShopButton type="submit" disabled={submitting} fullWidth>
              {submitting ? "Signing in..." : "Sign in"}
            </ShopButton>

            <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              Seed credentials: admin@react-shop.dev, manager@react-shop.dev,
              support@react-shop.dev, or user@react-shop.dev with password123.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
