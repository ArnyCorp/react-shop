import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { formatPrice, type Product } from "@react-shop/shared";
import { ShopButton } from "./ShopButton";

export type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 220ms ease, box-shadow 220ms ease",
        animation: "rise-in 420ms ease both",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(20, 34, 27, 0.12)",
        },
      }}
    >
      <CardActionArea disableRipple sx={{ alignItems: "stretch", height: "100%" }}>
        <CardMedia
          component="img"
          height="220"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="overline" color="text.secondary">
              {product.category}
            </Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {formatPrice(product.price)}
            </Typography>
          </Stack>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {product.description}
          </Typography>
          {onAddToCart ? (
            <ShopButton
              fullWidth
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onAddToCart(product);
              }}
            >
              Add to cart
            </ShopButton>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Box>
  );
}
