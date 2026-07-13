import { Button, type ButtonProps } from "@mui/material";
import { forwardRef } from "react";

export type ShopButtonProps = ButtonProps;

export const ShopButton = forwardRef<HTMLButtonElement, ShopButtonProps>(
  function ShopButton({ children, ...props }, ref) {
    return (
      <Button ref={ref} variant="contained" color="primary" {...props}>
        {children}
      </Button>
    );
  },
);
