import { AppBar, Badge, Container, Toolbar, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import type { ReactNode } from "react";
import { ShopButton } from "./ShopButton";

export type ShopHeaderProps = {
  brand?: string;
  cartCount?: number;
  brandHref?: string;
  cartHref?: string;
  onCartClick?: () => void;
  renderBrandLink?: (children: ReactNode) => ReactNode;
  renderCartLink?: (children: ReactNode) => ReactNode;
};

export function ShopHeader({
  brand = "React Shop",
  cartCount = 0,
  brandHref = "/",
  cartHref = "/cart",
  onCartClick,
  renderBrandLink,
  renderCartLink,
}: ShopHeaderProps) {
  const brandLabel = (
    <Typography
      variant="h5"
      sx={{
        color: "text.primary",
        flexGrow: 1,
        fontFamily: '"Syne", sans-serif',
        textDecoration: "none",
      }}
    >
      {brand}
    </Typography>
  );

  const cartButton = (
    <ShopButton
      variant="outlined"
      color="inherit"
      href={renderCartLink ? undefined : cartHref}
      startIcon={
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingBagOutlinedIcon fontSize="small" />
        </Badge>
      }
      onClick={onCartClick}
    >
      Cart
    </ShopButton>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(14px)",
        bgcolor: "rgba(247, 250, 248, 0.82)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
          {renderBrandLink ? (
            renderBrandLink(brandLabel)
          ) : (
            <Typography
              component="a"
              href={brandHref}
              variant="h5"
              sx={{
                color: "text.primary",
                flexGrow: 1,
                fontFamily: '"Syne", sans-serif',
                textDecoration: "none",
              }}
            >
              {brand}
            </Typography>
          )}
          {renderCartLink ? renderCartLink(cartButton) : cartButton}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
