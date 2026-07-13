import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { AppBar, Box, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "@react-shop/auth";
import type { ReactNode } from "react";

export type UserShellNavItem = {
  label: string;
  href: string;
};

export type UserShellProps = {
  brand?: string;
  navItems?: UserShellNavItem[];
  children: ReactNode;
};

export function UserShell({
  brand = "React Shop",
  navItems = [
    { label: "Shop", href: "#" },
    { label: "Orders", href: "#orders" },
    { label: "Account", href: "#account" },
  ],
  children,
}: UserShellProps) {
  const user = useAuthStore((state) => state.user);
  const accountName = user?.name ?? "Guest";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(247, 250, 248, 0.86)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 3, minHeight: 72 }}>
            <Typography
              variant="h5"
              component="a"
              href="#"
              sx={{
                color: "text.primary",
                fontFamily: '"Syne", sans-serif',
                textDecoration: "none",
              }}
            >
              {brand}
            </Typography>

            <Stack
              component="nav"
              aria-label="User navigation"
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
            >
              {navItems.map((item) => (
                <Typography
                  key={item.label}
                  component="a"
                  href={item.href}
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>

            <Chip
              icon={<AccountCircleOutlinedIcon />}
              label={accountName}
              variant="outlined"
              sx={{ ml: "auto", bgcolor: "background.paper" }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
