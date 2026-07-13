import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { AppBar, Box, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "@react-shop/auth";
import type { ElementType, ReactNode } from "react";

export type UserShellNavItem = {
  label: string;
  href: string;
};

export type UserShellProps = {
  brand?: string;
  navItems?: UserShellNavItem[];
  activeHref?: string;
  linkComponent?: ElementType;
  children: ReactNode;
};

export function UserShell({
  brand = "React Shop",
  navItems = [
    { label: "Shop", href: "." },
    { label: "Orders", href: "orders" },
    { label: "Account", href: "account" },
  ],
  activeHref = "/",
  linkComponent: LinkComponent = "a",
  children,
}: UserShellProps) {
  const user = useAuthStore((state) => state.user);
  const accountName = user?.name ?? "Guest";
  const activeKey = normalizeHref(activeHref);

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
              component={LinkComponent}
              href="."
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
              {navItems.map((item) => {
                const selected = activeKey === normalizeHref(item.href);

                return (
                  <Typography
                    key={item.label}
                    component={LinkComponent}
                    href={item.href}
                    variant="body2"
                    color={selected ? "primary.main" : "text.secondary"}
                    aria-current={selected ? "page" : undefined}
                    sx={{
                      fontWeight: selected ? 700 : 500,
                      textDecoration: "none",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item.label}
                  </Typography>
                );
              })}
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

function normalizeHref(href: string): string {
  const segments = href.split("?")[0].split("#")[0].split("/").filter(Boolean);
  return segments.at(-1) ?? ".";
}
